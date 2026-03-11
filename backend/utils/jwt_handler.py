import jwt
import datetime

SECRET_KEY = "secret_key_pika"


def gerar_token(usuario):

    payload = {
        "user_id": usuario.id,
        "email": usuario.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return token