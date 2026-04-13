from database.connection import SessionLocal
from database.models import Colaborador
from utils.jwt_handler import gerar_token


def login_usuario(email, senha):

    db = SessionLocal()

    usuario = db.query(Colaborador).filter(
        Colaborador.email == email
    ).first()

    if not usuario:
        return None

    if usuario.senha != senha:
        return None

    token = gerar_token(usuario)

    return {
        "token": token,
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "role_id": usuario.role_id
        }
    }