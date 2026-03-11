from flask import Blueprint, jsonify
from database.connection import SessionLocal
from database.models import Pedido, Material, PedidoMaterial

from utils.auth_middleware import token_required
from sqlalchemy import func

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/resumo", methods=["GET"])
@token_required
def resumo_dashboard():

    db = SessionLocal()

    total_pedidos = db.query(func.count(Pedido.id)).scalar()

    pedidos_pendentes = db.query(func.count(Pedido.id)).filter(
        Pedido.status_pedido == "PENDENTE"
    ).scalar()

    pedidos_producao = db.query(func.count(Pedido.id)).filter(
        Pedido.status_pedido == "EM_PRODUCAO"
    ).scalar()

    faturamento_total = db.query(func.sum(Pedido.valor)).scalar() or 0

    db.close()

    return jsonify({
        "total_pedidos": total_pedidos,
        "pedidos_pendentes": pedidos_pendentes,
        "pedidos_em_producao": pedidos_producao,
        "faturamento_total": float(faturamento_total)
    })

@dashboard_bp.route("/dashboard/pedidos-status", methods=["GET"])
@token_required
def pedidos_por_status():

    db = SessionLocal()

    resultados = db.query(
        Pedido.status_pedido,
        func.count(Pedido.id)
    ).group_by(Pedido.status_pedido).all()

    db.close()

    resposta = []

    for status, quantidade in resultados:
        resposta.append({
            "status": status,
            "quantidade": quantidade
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/faturamento-mensal", methods=["GET"])
@token_required
def faturamento_mensal():

    db = SessionLocal()

    resultados = db.query(
        func.extract("month", Pedido.data_entrada).label("mes"),
        func.sum(Pedido.valor).label("total")
    ).group_by(
        func.extract("month", Pedido.data_entrada)
    ).order_by(
        func.extract("month", Pedido.data_entrada)
    ).all()

    db.close()

    resposta = []

    for mes, total in resultados:
        resposta.append({
            "mes": int(mes),
            "total": float(total)
        })

    return jsonify(resposta)

@dashboard_bp.route("/dashboard/materiais-mais-usados", methods=["GET"])
@token_required
def materiais_mais_usados():

    db = SessionLocal()

    resultados = db.query(
        Material.tipo,
        Material.cor,
        func.sum(PedidoMaterial.quantidade).label("total")
    ).join(
        PedidoMaterial, Material.id == PedidoMaterial.material_id
    ).group_by(
        Material.tipo, Material.cor
    ).order_by(
        func.sum(PedidoMaterial.quantidade).desc()
    ).all()

    db.close()

    resposta = []

    for tipo, cor, total in resultados:
        resposta.append({
            "material": f"{tipo} {cor}",
            "quantidade": int(total)
        })

    return jsonify(resposta)

@dashboard_bp.route("/dashboard/pedidos-recentes", methods=["GET"])
@token_required
def pedidos_recentes():

    db = SessionLocal()

    pedidos = db.query(Pedido).order_by(
        Pedido.data_entrada.desc()
    ).limit(5).all()

    resposta = []

    for pedido in pedidos:
        resposta.append({
            "id": pedido.id,
            "cliente": pedido.cliente.nome if pedido.cliente else None,
            "descricao": pedido.descricao,
            "valor": float(pedido.valor) if pedido.valor else 0,
            "status": pedido.status_pedido
        })

    db.close()

    return jsonify(resposta)

@dashboard_bp.route("/dashboard/faturamento-por-cliente", methods=["GET"])
@token_required
def faturamento_por_cliente():

    db = SessionLocal()

    resultados = db.query(
        Cliente.nome,
        func.sum(Pedido.valor).label("total")
    ).join(
        Pedido, Cliente.id == Pedido.cliente_id
    ).group_by(
        Cliente.nome
    ).order_by(
        func.sum(Pedido.valor).desc()
    ).all()

    db.close()

    resposta = []

    for nome, total in resultados:
        resposta.append({
            "cliente": nome,
            "faturamento": float(total)
        })

    return jsonify(resposta)