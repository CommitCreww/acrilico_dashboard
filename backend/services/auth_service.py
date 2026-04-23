from database.connection import SessionLocal
from database.models import Colaborador, Role
from utils.jwt_handler import gerar_token
from utils.crypto import check_password, hash_password, is_password_hash


def login_usuario(email, senha):

    db = SessionLocal()

    usuario = db.query(Colaborador).filter(
        Colaborador.email == email
    ).first()

    if not usuario:
        return None

    if is_password_hash(usuario.senha):
        if not check_password(usuario.senha, senha):
            return None
    else:
        if usuario.senha != senha:
            return None

        usuario.senha = hash_password(senha)
        db.commit()

    role = db.query(Role).filter(Role.id == usuario.role_id).first()
    token = gerar_token(usuario)

    return {
        "token": token,
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "role_id": usuario.role_id,
            "role": role.nome if role else None,
            "nivel_acesso": role.nivel_acesso if role else 0,
        }
    }
