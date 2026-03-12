from flask import Blueprint, request, jsonify
from services.auth_service import login_usuario

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():

    dados = request.json

    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return jsonify({"erro": "email e senha são obrigatórios"}), 400

    usuario = login_usuario(email, senha)

    if not usuario:
        return jsonify({"erro": "dados inválidos"}), 401

    return jsonify(usuario)