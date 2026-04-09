from flask import Blueprint, request, jsonify, g
from database.connection import SessionLocal
from database.models import Pedido, PedidoMaterial
from utils.auth_middleware import token_required
from datetime import datetime
from sqlalchemy import text

from querys.pedidos_querys import LISTAR_PEDIDOS, BUSCAR_PEDIDO_POR_ID, BUSCAR_MATERIAIS_DO_PEDIDO , DELETAR_PAGAMENTOS_DO_PEDIDO, DELETAR_PEDIDO, BUSCAR_CLIENTE_EXISTENTE, BUSCAR_MATERIAL_EXISTENTE, DELETAR_MATERIAIS_DO_PEDIDO


pedidos_bp = Blueprint("pedidos", __name__)


@pedidos_bp.route("/pedidos", methods=["GET"])
@token_required
def listar_pedidos():
    db = SessionLocal()

    resultados = db.execute(text(LISTAR_PEDIDOS)).mappings().all()

    db.close()

    resposta = []

    for item in resultados:
        resposta.append({
            "id": item["id"],
            "cliente": item["cliente"],
            "descricao": item["descricao"],
            "valor": float(item["valor"]) if item["valor"] is not None else 0,
            "data_entrada": str(item["data_entrada"]) if item["data_entrada"] else None,
            "data_entrega": str(item["data_entrega"]) if item["data_entrega"] else None,
            "status_pedido": item["status_pedido"]
        })

    return jsonify(resposta)


@pedidos_bp.route("/pedidos/<int:id>", methods=["GET"])
@token_required
def buscar_pedido(id):
    db = SessionLocal()

    pedido = db.execute(
        text(BUSCAR_PEDIDO_POR_ID),
        {"pedido_id": id}
    ).mappings().first()

    if not pedido:
        db.close()
        return jsonify({"erro": "Pedido não encontrado"}), 404

    materiais = db.execute(
        text(BUSCAR_MATERIAIS_DO_PEDIDO),
        {"pedido_id": id}
    ).mappings().all()

    db.close()

    resposta_materiais = []

    for item in materiais:
        resposta_materiais.append({
            "material_id": item["material_id"],
            "tipo": item["tipo"],
            "cor": item["cor"],
            "espessura": item["espessura"],
            "quantidade": item["quantidade"],
            "preco_m2": float(item["preco_m2"]) if item["preco_m2"] is not None else 0
        })

    resultado = {
        "id": pedido["id"],
        "cliente": pedido["cliente"],
        "descricao": pedido["descricao"],
        "valor": float(pedido["valor"]) if pedido["valor"] is not None else 0,
        "data_entrada": str(pedido["data_entrada"]) if pedido["data_entrada"] else None,
        "data_entrega": str(pedido["data_entrega"]) if pedido["data_entrega"] else None,
        "status_pedido": pedido["status_pedido"],
        "materiais": resposta_materiais
    }

    return jsonify(resultado)


@pedidos_bp.route("/pedidos", methods=["POST"])
@token_required
def criar_pedido():
    db = SessionLocal()

    try:
        dados = request.json

        cliente = db.execute(
            text(BUSCAR_CLIENTE_EXISTENTE),
            {"cliente_id": dados["cliente_id"]}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente não encontrado"}), 404

        novo_pedido = Pedido(
            colaborador_id=g.user_id,
            cliente_id=dados["cliente_id"],
            descricao=dados["descricao"],
            valor=dados["valor"],
            data_entrada=datetime.strptime(dados["data_entrada"], "%Y-%m-%d").date(),
            data_entrega=datetime.strptime(dados["data_entrega"], "%Y-%m-%d").date(),
            status_pedido=dados["status_pedido"]
        )

        db.add(novo_pedido)
        db.commit()
        db.refresh(novo_pedido)

        pedido_id = novo_pedido.id

        for item in dados["materiais"]:
            material = db.execute(
                text(BUSCAR_MATERIAL_EXISTENTE),
                {"material_id": item["material_id"]}
            ).mappings().first()

            if not material:
                db.rollback()
                db.close()
                return jsonify({"erro": f"Material {item['material_id']} não encontrado"}), 404

            pedido_material = PedidoMaterial(
                pedido_id=pedido_id,
                material_id=item["material_id"],
                quantidade=item["quantidade"]
            )

            db.add(pedido_material)

        db.commit()
        db.close()

        return jsonify({
            "message": "Pedido criado com sucesso",
            "pedido_id": pedido_id
        }), 201

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos/<int:id>", methods=["PUT"])
@token_required
def atualizar_pedido(id):
    db = SessionLocal()

    try:
        dados = request.json

        pedido_existente = db.execute(
            text(BUSCAR_PEDIDO_POR_ID),
            {"pedido_id": id}
        ).mappings().first()

        if not pedido_existente:
            db.close()
            return jsonify({"erro": "Pedido não encontrado"}), 404

        cliente = db.execute(
            text(BUSCAR_CLIENTE_EXISTENTE),
            {"cliente_id": dados["cliente_id"]}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente não encontrado"}), 404

        pedido = db.query(Pedido).filter(Pedido.id == id).first()

        pedido.cliente_id = dados["cliente_id"]
        pedido.descricao = dados["descricao"]
        pedido.valor = dados["valor"]
        pedido.data_entrada = datetime.strptime(dados["data_entrada"], "%Y-%m-%d").date()
        pedido.data_entrega = datetime.strptime(dados["data_entrega"], "%Y-%m-%d").date()
        pedido.status_pedido = dados["status_pedido"]

        db.execute(
            text(DELETAR_MATERIAIS_DO_PEDIDO),
            {"pedido_id": id}
        )

        for item in dados["materiais"]:
            material = db.execute(
                text(BUSCAR_MATERIAL_EXISTENTE),
                {"material_id": item["material_id"]}
            ).mappings().first()

            if not material:
                db.rollback()
                db.close()
                return jsonify({"erro": f"Material {item['material_id']} não encontrado"}), 404

            novo_item = PedidoMaterial(
                pedido_id=id,
                material_id=item["material_id"],
                quantidade=item["quantidade"]
            )

            db.add(novo_item)

        db.commit()
        db.close()

        return jsonify({"message": "Pedido atualizado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos/<int:id>", methods=["DELETE"])
@token_required
def deletar_pedido(id):
    db = SessionLocal()

    try:
        pedido = db.execute(
            text(BUSCAR_PEDIDO_POR_ID),
            {"pedido_id": id}
        ).mappings().first()

        if not pedido:
            db.close()
            return jsonify({"erro": "Pedido não encontrado"}), 404

        db.execute(
            text(DELETAR_MATERIAIS_DO_PEDIDO),
            {"pedido_id": id}
        )

        db.execute(
            text(DELETAR_PAGAMENTOS_DO_PEDIDO),
            {"pedido_id": id}
        )

        db.execute(
            text(DELETAR_PEDIDO),
            {"pedido_id": id}
        )

        db.commit()
        db.close()

        return jsonify({"message": "Pedido deletado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500