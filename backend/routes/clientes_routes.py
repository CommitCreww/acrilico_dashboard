from flask import Blueprint, request, jsonify, g
from database.connection import SessionLocal
from utils.auth_middleware import token_required
from sqlalchemy import text
from utils.pedidos_status import compute_status_pedido
from utils.permissions import can_view_pedido, get_usuario_contexto
from utils.crypto import encrypt_cpf, hash_cpf, decrypt_cpf

from querys.clientes_querys import (
    LISTAR_CLIENTES,
    BUSCAR_CLIENTE_POR_ID,
    CRIAR_CLIENTE,
    ATUALIZAR_CLIENTE,
    LISTAR_PEDIDOS_DO_CLIENTE,
)

clientes_bp = Blueprint("clientes", __name__)


def ensure_clientes_columns(db):
    db.execute(text("ALTER TABLE clientes ADD COLUMN IF NOT EXISTS observacoes TEXT;"))
    db.execute(text("ALTER TABLE clientes ALTER COLUMN cpf_cnpj TYPE TEXT;"))
    db.execute(text("ALTER TABLE clientes ADD COLUMN IF NOT EXISTS hash_cpf VARCHAR(64);"))
    db.commit()


def serialize_cliente(item, total_pedidos=0):
    return {
        "id": item["id"],
        "nome": item["nome"],
        "email": item["email"],
        "telefone": item["telefone"],
        "cpf_cnpj": decrypt_cpf(item["cpf_cnpj"]),
        "endereco": item["endereco"],
        "observacoes": item["observacoes"],
        "total_pedidos": total_pedidos,
        "tipo_cliente": "RECORRENTE" if total_pedidos > 1 else "NOVO",
    }


def serialize_pedido_cliente(item):
    horario_entrega = item["horario_entrega"]
    if horario_entrega is not None:
        horario_entrega = (
            horario_entrega.strftime("%H:%M")
            if hasattr(horario_entrega, "strftime")
            else str(horario_entrega)
        )

    return {
        "id": item["id"],
        "cliente": item["cliente"],
        "descricao": item["descricao"],
        "valor": float(item["valor"]) if item["valor"] is not None else 0,
        "data_entrada": str(item["data_entrada"]) if item["data_entrada"] else None,
        "data_entrega": str(item["data_entrega"]) if item["data_entrega"] else None,
        "horario_entrega": horario_entrega,
        "status_pedido": compute_status_pedido(
            item["status_pedido"],
            item["data_entrega"],
            item["horario_entrega"],
        ),
    }


def get_pedidos_visiveis_do_cliente(db, cliente_id):
    usuario = get_usuario_contexto(db, g.user_id)
    if not usuario:
        return None, []

    pedidos = db.execute(
        text(LISTAR_PEDIDOS_DO_CLIENTE),
        {"cliente_id": cliente_id},
    ).mappings().all()

    return usuario, [
        pedido
        for pedido in pedidos
        if can_view_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id)
    ]


@clientes_bp.route("/clientes", methods=["GET"])
@token_required
def listar_clientes():
    db = SessionLocal()

    ensure_clientes_columns(db)

    usuario = get_usuario_contexto(db, g.user_id)
    if not usuario:
        db.close()
        return jsonify({"erro": "UsuÃ¡rio nÃ£o encontrado"}), 404

    resultados = db.execute(text(LISTAR_CLIENTES)).mappings().all()
    resposta = []

    for item in resultados:
        _, pedidos_visiveis = get_pedidos_visiveis_do_cliente(db, item["id"])
        resposta.append(serialize_cliente(item, len(pedidos_visiveis)))

    db.close()

    return jsonify(resposta)


@clientes_bp.route("/clientes/<int:id>", methods=["GET"])
@token_required
def buscar_cliente(id):
    db = SessionLocal()

    ensure_clientes_columns(db)

    cliente = db.execute(
        text(BUSCAR_CLIENTE_POR_ID),
        {"cliente_id": id}
    ).mappings().first()

    if not cliente:
        db.close()
        return jsonify({"erro": "Cliente nÃ£o encontrado"}), 404

    _, pedidos_visiveis = get_pedidos_visiveis_do_cliente(db, id)
    resposta = serialize_cliente(cliente, len(pedidos_visiveis))

    db.close()

    return jsonify(resposta)


@clientes_bp.route("/clientes/<int:id>/resumo", methods=["GET"])
@token_required
def buscar_resumo_cliente(id):
    db = SessionLocal()

    ensure_clientes_columns(db)

    cliente = db.execute(
        text(BUSCAR_CLIENTE_POR_ID),
        {"cliente_id": id}
    ).mappings().first()

    if not cliente:
        db.close()
        return jsonify({"erro": "Cliente nÃ£o encontrado"}), 404

    usuario, pedidos_visiveis = get_pedidos_visiveis_do_cliente(db, id)
    if not usuario:
        db.close()
        return jsonify({"erro": "UsuÃ¡rio nÃ£o encontrado"}), 404

    db.close()

    pedidos_serializados = [serialize_pedido_cliente(item) for item in pedidos_visiveis]
    total_comprado = sum(item["valor"] for item in pedidos_serializados)
    ultimo_pedido = pedidos_serializados[0] if pedidos_serializados else None

    return jsonify({
        "cliente": serialize_cliente(cliente, len(pedidos_serializados)),
        "total_pedidos": len(pedidos_serializados),
        "total_comprado": total_comprado,
        "ultimo_pedido": ultimo_pedido,
        "pedidos": pedidos_serializados[:5],
    })


@clientes_bp.route("/clientes", methods=["POST"])
@token_required
def criar_cliente():
    db = SessionLocal()

    try:
        ensure_clientes_columns(db)
        dados = request.json

        resultado = db.execute(
            text(CRIAR_CLIENTE),
            {
                "nome": dados["nome"],
                "email": dados["email"],
                "telefone": dados["telefone"],
                "cpf_cnpj": encrypt_cpf(dados["cpf_cnpj"]),
                "hash_cpf": hash_cpf(dados["cpf_cnpj"]),
                "endereco": dados["endereco"],
                "observacoes": dados.get("observacoes")
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
        ensure_clientes_columns(db)
        dados = request.json

        cliente = db.execute(
            text(BUSCAR_CLIENTE_POR_ID),
            {"cliente_id": id}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente nÃ£o encontrado"}), 404

        db.execute(
            text(ATUALIZAR_CLIENTE),
            {
                "cliente_id": id,
                "nome": dados["nome"],
                "email": dados["email"],
                "telefone": dados["telefone"],
                "cpf_cnpj": encrypt_cpf(dados["cpf_cnpj"]),
                "hash_cpf": hash_cpf(dados["cpf_cnpj"]),
                "endereco": dados["endereco"],
                "observacoes": dados.get("observacoes")
            }
        )

        db.commit()
        db.close()

        return jsonify({"message": "Cliente atualizado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500
