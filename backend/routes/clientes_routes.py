from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from utils.auth_middleware import token_required
from sqlalchemy import text

from querys.clientes_querys import (
    LISTAR_CLIENTES,
    BUSCAR_CLIENTE_POR_ID,
    CRIAR_CLIENTE,
    ATUALIZAR_CLIENTE
)

clientes_bp = Blueprint("clientes", __name__)


@clientes_bp.route("/clientes", methods=["GET"])
@token_required
def listar_clientes():
    db = SessionLocal()

    resultados = db.execute(text(LISTAR_CLIENTES)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "id": item["id"],
            "nome": item["nome"],
            "email": item["email"],
            "telefone": item["telefone"],
            "cpf_cnpj": item["cpf_cnpj"],
            "endereco": item["endereco"]
        })

    return jsonify(resposta)


@clientes_bp.route("/clientes/<int:id>", methods=["GET"])
@token_required
def buscar_cliente(id):
    db = SessionLocal()

    cliente = db.execute(
        text(BUSCAR_CLIENTE_POR_ID),
        {"cliente_id": id}
    ).mappings().first()

    db.close()

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    return jsonify({
        "id": cliente["id"],
        "nome": cliente["nome"],
        "email": cliente["email"],
        "telefone": cliente["telefone"],
        "cpf_cnpj": cliente["cpf_cnpj"],
        "endereco": cliente["endereco"]
    })


@clientes_bp.route("/clientes", methods=["POST"])
@token_required
def criar_cliente():
    db = SessionLocal()

    try:
        dados = request.json

        resultado = db.execute(
            text(CRIAR_CLIENTE),
            {
                "nome": dados["nome"],
                "email": dados["email"],
                "telefone": dados["telefone"],
                "cpf_cnpj": dados["cpf_cnpj"],
                "endereco": dados["endereco"]
            }
        ).mappings().first()

        db.commit()
        db.close()

        return jsonify({
            "message": "Cliente criado com sucesso",
            "id": resultado["id"]
        }), 201

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@clientes_bp.route("/clientes/<int:id>", methods=["PUT"])
@token_required
def atualizar_cliente(id):
    db = SessionLocal()

    try:
        dados = request.json

        cliente = db.execute(
            text(BUSCAR_CLIENTE_POR_ID),
            {"cliente_id": id}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente não encontrado"}), 404

        db.execute(
            text(ATUALIZAR_CLIENTE),
            {
                "cliente_id": id,
                "nome": dados["nome"],
                "email": dados["email"],
                "telefone": dados["telefone"],
                "cpf_cnpj": dados["cpf_cnpj"],
                "endereco": dados["endereco"]
            }
        )

        db.commit()
        db.close()

        return jsonify({"message": "Cliente atualizado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500