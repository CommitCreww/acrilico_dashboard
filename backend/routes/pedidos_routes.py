from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from database.models import Pedido, PedidoMaterial, Cliente, Material, Pagamento
from utils.auth_middleware import token_required
from flask import g
from datetime import datetime

pedidos_bp = Blueprint("pedidos", __name__)


@pedidos_bp.route("/pedidos", methods=["GET"])
@token_required
def listar_pedidos():
    db = SessionLocal()

    pedidos = db.query(Pedido).all()

    resultado = []

    for pedido in pedidos:
        resultado.append({
            "id": pedido.id,
            "cliente": pedido.cliente.nome if pedido.cliente else None,
            "descricao": pedido.descricao,
            "valor": float(pedido.valor) if pedido.valor is not None else 0,
            "data_entrada": str(pedido.data_entrada) if pedido.data_entrada else None,
            "data_entrega": str(pedido.data_entrega) if pedido.data_entrega else None,
            "status_pedido": pedido.status_pedido
        })

    db.close()

    return jsonify(resultado)


@pedidos_bp.route("/pedidos/<int:id>", methods=["GET"])
@token_required
def buscar_pedido(id):
    db = SessionLocal()

    pedido = db.query(Pedido).filter(Pedido.id == id).first()

    if not pedido:
        db.close()
        return jsonify({"erro": "Pedido não encontrado"}), 404

    materiais = []

    for item in pedido.materiais:
        materiais.append({
            "material_id": item.material.id,
            "tipo": item.material.tipo,
            "cor": item.material.cor,
            "espessura": item.material.espessura,
            "quantidade": item.quantidade,
            "preco_m2": float(item.material.preco_m2) if item.material.preco_m2 is not None else 0
        })

    resultado = {
        "id": pedido.id,
        "cliente": pedido.cliente.nome if pedido.cliente else None,
        "descricao": pedido.descricao,
        "valor": float(pedido.valor) if pedido.valor is not None else 0,
        "data_entrada": str(pedido.data_entrada) if pedido.data_entrada else None,
        "data_entrega": str(pedido.data_entrega) if pedido.data_entrega else None,
        "status_pedido": pedido.status_pedido,
        "materiais": materiais
    }

    db.close()

    return jsonify(resultado)


@pedidos_bp.route("/pedidos", methods=["POST"])
@token_required
def criar_pedido():
    db = SessionLocal()

    dados = request.json

    cliente = db.query(Cliente).filter(Cliente.id == dados["cliente_id"]).first()

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
        material = db.query(Material).filter(Material.id == item["material_id"]).first()

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

@pedidos_bp.route("/pedidos/<int:id>", methods=["PUT"])
@token_required
def atualizar_pedido(id):
    db = SessionLocal()

    dados = request.json

    pedido = db.query(Pedido).filter(Pedido.id == id).first()

    if not pedido:
        db.close()
        return jsonify({"erro": "Pedido não encontrado"}), 404

    cliente = db.query(Cliente).filter(Cliente.id == dados["cliente_id"]).first()
    if not cliente:
        db.close()
        return jsonify({"erro": "Cliente não encontrado"}), 404

    pedido.cliente_id = dados["cliente_id"]
    pedido.descricao = dados["descricao"]
    pedido.valor = dados["valor"]
    pedido.data_entrada = datetime.strptime(dados["data_entrada"], "%Y-%m-%d").date()
    pedido.data_entrega = datetime.strptime(dados["data_entrega"], "%Y-%m-%d").date()
    pedido.status_pedido = dados["status_pedido"]

    itens_antigos = db.query(PedidoMaterial).filter(PedidoMaterial.pedido_id == id).all()
    for item in itens_antigos:
        db.delete(item)

    for item in dados["materiais"]:
        material = db.query(Material).filter(Material.id == item["material_id"]).first()

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


@pedidos_bp.route("/pedidos/<int:id>", methods=["DELETE"])
@token_required
def deletar_pedido(id):
    db = SessionLocal()

    pedido = db.query(Pedido).filter(Pedido.id == id).first()

    if not pedido:
        db.close()
        return jsonify({"erro": "Pedido não encontrado"}), 404

    itens = db.query(PedidoMaterial).filter(PedidoMaterial.pedido_id == id).all()
    for item in itens:
        db.delete(item)

    pagamentos = db.query(Pagamento).filter(Pagamento.pedido_id == id).all()
    for pagamento in pagamentos:
        db.delete(pagamento)

    db.delete(pedido)
    db.commit()
    db.close()

    return jsonify({"message": "Pedido deletado com sucesso"}), 200