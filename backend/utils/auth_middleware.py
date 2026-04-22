from functools import wraps

import jwt
from flask import g, jsonify, request

from config import JWT_SECRET_KEY


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split()

        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]

        if not token:
            return jsonify({"erro": "Token nao fornecido"}), 401

        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            g.user_id = data["user_id"]
            g.email = data["email"]
        except jwt.ExpiredSignatureError:
            return jsonify({"erro": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"erro": "Token invalido"}), 401

        return f(*args, **kwargs)

    return decorated
