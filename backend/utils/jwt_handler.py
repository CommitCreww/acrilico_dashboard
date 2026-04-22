import jwt
import datetime
from config import JWT_EXPIRATION_HOURS, JWT_SECRET_KEY


def gerar_token(usuario):

    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "user_id": usuario.id,
        "email": usuario.email,
        "exp": now + datetime.timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": now,
    }

    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

    return token
