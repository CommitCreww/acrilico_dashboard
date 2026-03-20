from flask import Blueprint, jsonify
from database.connection import SessionLocal
from database.models import Pedido, Material, PedidoMaterial, Cliente
from querys.dashboard_querys import RESUMO_DASHBOARD,PEDIDOS_RECENTES,PEDIDOS_STATUS,FATURAMENTO_MENSAL,FATURAMENTO_POR_CLIENTE,MATERIAIS_MAIS_USADOS
from utils.auth_middleware import token_required
from sqlalchemy import func, text

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/resumo", methods=["GET"])
@token_required
def resumo_dashboard():

    db = SessionLocal()

    resultado = db.execute(text(RESUMO_DASHBOARD)).mappings().first()

    db.close()

    return jsonify({
        "total_pedidos": resultado["total_pedidos"],
        "pedidos_pendentes": resultado["pedidos_pendentes"],
        "pedidos_em_producao": resultado["pedidos_em_producao"],
        "faturamento_total": float(resultado["faturamento_total"])
    })

@dashboard_bp.route("/dashboard/pedidos-status", methods=["GET"])
@token_required
def pedidos_por_status():
    db = SessionLocal()

    resultados = db.execute(text(PEDIDOS_STATUS)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "status": item["status"],
            "quantidade": item["quantidade"]
        })

    return jsonify(resposta)


@dashboard_bp.route("/dashboard/faturamento-mensal", methods=["GET"])
@token_required
def faturamento_mensal():
    db = SessionLocal()

    resultados = db.execute(text(FATURAMENTO_MENSAL)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "mes": int(item["mes"]),
            "total": float(item["total"])
        })

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

    resultados = db.execute(text(PEDIDOS_RECENTES)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "id": item["id"],
            "cliente": item["cliente"],
            "descricao": item["descricao"],
            "valor": float(item["valor"]) if item["valor"] is not None else 0,
            "status": item["status"]
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