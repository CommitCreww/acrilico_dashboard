from functools import wraps
from flask import request, jsonify, g
import jwt

SECRET_KEY = "secret_key_pika"

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"erro": "Token não fornecido"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            # salva dados do usuário
            g.user_id = data["user_id"]
            g.email = data["email"]

        except:
            return jsonify({"erro": "Token inválido"}), 401

        return f(*args, **kwargs)

    return decorated