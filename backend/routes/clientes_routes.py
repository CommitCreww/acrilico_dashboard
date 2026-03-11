from flask import Blueprint, jsonify
from database.connection import SessionLocal
from database.models import Cliente
from flask import Blueprint, jsonify, request
from database.connection import SessionLocal
from database.models import Cliente
from utils.auth_middleware import token_required

clientes_bp = Blueprint("clientes", __name__)



@clientes_bp.route("/clientes", methods=["GET"])
@token_required
def listar_clientes():

    db = SessionLocal()

    clientes = db.query(Cliente).all()

    resultado = []

    for cliente in clientes:
        resultado.append({
            "id": cliente.id,
            "nome": cliente.nome,
            "email": cliente.email
        })

    db.close()

    return jsonify(resultado)


@clientes_bp.route("/clientes", methods=["POST"])
@token_required
def criar_cliente():

    db = SessionLocal()

    dados = request.json

    novo_cliente = Cliente(
        nome=dados["nome"],
        email=dados["email"],
        telefone=dados["telefone"],
        cpf_cnpj=dados["cpf_cnpj"],
        endereco=dados["endereco"]
    )

    db.add(novo_cliente)
    db.commit()

    db.close()

    return jsonify({"mensagem": "Cliente criado com sucesso"})


@clientes_bp.route("/clientes/<int:id>", methods=["PUT"])
@token_required
def atualizar_cliente(id):

    db = SessionLocal()

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        db.close()
        return jsonify({"erro": "Cliente não encontrado"}), 404

    dados = request.json

    cliente.nome = dados.get("nome", cliente.nome)
    cliente.email = dados.get("email", cliente.email)
    cliente.telefone = dados.get("telefone", cliente.telefone)
    cliente.cpf_cnpj = dados.get("cpf_cnpj", cliente.cpf_cnpj)
    cliente.endereco = dados.get("endereco", cliente.endereco)

    db.commit()
    db.close()

    return jsonify({"mensagem": "Cliente atualizado"})

@clientes_bp.route("/clientes/<int:id>", methods=["DELETE"])
@token_required
def deletar_cliente(id):

    db = SessionLocal()

    cliente = db.query(Cliente).filter(Cliente.id == id).first()

    if not cliente:
        db.close()
        return jsonify({"erro": "Cliente não encontrado"}), 404

    db.delete(cliente)
    db.commit()
    db.close()

    return jsonify({"mensagem": "Cliente deletado"})