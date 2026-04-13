from flask import Blueprint, jsonify, g
from database.connection import SessionLocal
from querys.dashboard_querys import (
    RESUMO_DASHBOARD,
    PEDIDOS_RECENTES,
    PEDIDOS_STATUS,
    FATURAMENTO_MENSAL,
    FATURAMENTO_POR_CLIENTE,
    MATERIAIS_MAIS_USADOS,
    PEDIDOS_ENTREGA_HOJE,
)
from utils.auth_middleware import token_required
from utils.pedidos_status import compute_status_pedido
from utils.permissions import can_view_pedido, get_usuario_contexto
from sqlalchemy import text

dashboard_bp = Blueprint("dashboard", __name__)


def get_pedidos_visiveis(db, query):
    usuario = get_usuario_contexto(db, g.user_id)
    if not usuario:
        return None, []

    resultados = db.execute(text(query)).mappings().all()
    visiveis = [
        item
        for item in resultados
        if can_view_pedido(usuario.nivel_acesso, item["colaborador_id"], g.user_id)
    ]
    return usuario, visiveis


@dashboard_bp.route("/dashboard/resumo", methods=["GET"])
@token_required
def resumo_dashboard():

    db = SessionLocal()
    usuario, resultados = get_pedidos_visiveis(db, RESUMO_DASHBOARD)

    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    db.close()

    total_pedidos = len(resultados)
    pedidos_pendentes = 0
    pedidos_em_producao = 0
    pedidos_atrasados = 0
    faturamento_total = 0

    for item in resultados:
        status = compute_status_pedido(
            item["status_pedido"],
            item["data_entrega"],
            item["horario_entrega"],
        )
        faturamento_total += float(item["valor"]) if item["valor"] is not None else 0

        if status == "PENDENTE":
            pedidos_pendentes += 1
        elif status == "EM_PRODUCAO":
            pedidos_em_producao += 1
        elif status == "ATRASADO":
            pedidos_atrasados += 1

    return jsonify({
        "total_pedidos": total_pedidos,
        "pedidos_pendentes": pedidos_pendentes,
        "pedidos_em_producao": pedidos_em_producao,
        "pedidos_atrasados": pedidos_atrasados,
        "faturamento_total": faturamento_total
    })


@dashboard_bp.route("/dashboard/pedidos-status", methods=["GET"])
@token_required
def pedidos_por_status():
    db = SessionLocal()
    usuario, resultados = get_pedidos_visiveis(db, PEDIDOS_STATUS)

    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    db.close()

    contagem_status = {}

    for item in resultados:
        status = compute_status_pedido(
            item["status_pedido"],
            item["data_entrega"],
            item["horario_entrega"],
        )
        contagem_status[status] = contagem_status.get(status, 0) + 1

    resposta = []

    for status in sorted(contagem_status.keys()):
        resposta.append({
            "status": status,
            "quantidade": contagem_status[status]
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/faturamento-mensal", methods=["GET"])
@token_required
def faturamento_mensal():
    db = SessionLocal()
    usuario, resultados = get_pedidos_visiveis(db, FATURAMENTO_MENSAL)

    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    db.close()

    faturamento_por_mes = {}

    for item in resultados:
        mes = int(item["mes"])
        total = float(item["valor_total"]) if item["valor_total"] is not None else 0
        recebido = float(item["valor_recebido"]) if item["valor_recebido"] is not None else 0
        em_aberto = max(total - recebido, 0)

        if mes not in faturamento_por_mes:
            faturamento_por_mes[mes] = {
                "mes": mes,
                "total": 0,
                "recebido": 0,
                "em_aberto": 0,
            }

        faturamento_por_mes[mes]["total"] += total
        faturamento_por_mes[mes]["recebido"] += recebido
        faturamento_por_mes[mes]["em_aberto"] += em_aberto

    resposta = [
        {
            "mes": item["mes"],
            "total": round(item["total"], 2),
            "recebido": round(item["recebido"], 2),
            "em_aberto": round(item["em_aberto"], 2),
        }
        for item in sorted(faturamento_por_mes.values(), key=lambda registro: registro["mes"])
    ]

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/materiais-mais-usados", methods=["GET"])
@token_required
def materiais_mais_usados():
    db = SessionLocal()

    resultados = db.execute(text(MATERIAIS_MAIS_USADOS)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "material": item["material"],
            "quantidade": int(item["quantidade"])
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/pedidos-recentes", methods=["GET"])
@token_required
def pedidos_recentes():
    db = SessionLocal()
    usuario, resultados = get_pedidos_visiveis(db, PEDIDOS_RECENTES)

    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    db.close()

    resposta = []

    for item in resultados[:5]:
        resposta.append({
            "id": item["id"],
            "cliente": item["cliente"],
            "descricao": item["descricao"],
            "valor": float(item["valor"]) if item["valor"] is not None else 0,
            "status": compute_status_pedido(
                item["status"],
                item["data_entrega"],
                item["horario_entrega"],
            )
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/pedidos-entrega-hoje", methods=["GET"])
@token_required
def pedidos_entrega_hoje():
    db = SessionLocal()
    usuario, resultados = get_pedidos_visiveis(db, PEDIDOS_ENTREGA_HOJE)

    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    db.close()

    resposta = []

    for item in resultados:
        status_pedido = compute_status_pedido(
            item["status_pedido"],
            item["data_entrega"],
            item["horario_entrega"],
        )
        if status_pedido == "CONCLUIDO":
            continue

        horario_entrega = item["horario_entrega"]
        horario_formatado = None
        if horario_entrega is not None:
            horario_formatado = (
                horario_entrega.strftime("%H:%M")
                if hasattr(horario_entrega, "strftime")
                else str(horario_entrega)
            )

        resposta.append({
            "id": item["id"],
            "cliente": item["cliente"],
            "colaborador": item["colaborador"],
            "data_entrega": str(item["data_entrega"]) if item["data_entrega"] else None,
            "horario_entrega": horario_formatado,
            "status_pedido": status_pedido,
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/faturamento-por-cliente", methods=["GET"])
@token_required
def faturamento_por_cliente():
    db = SessionLocal()

    resultados = db.execute(text(FATURAMENTO_POR_CLIENTE)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "cliente": item["cliente"],
            "faturamento": float(item["faturamento"])
        })

    return jsonify(resposta)
