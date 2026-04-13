from database.models import Colaborador, Role


ROLE_ADMIN = 10
ROLE_GERENTE = 7
ROLE_VENDEDOR = 5


def get_usuario_contexto(db, user_id):
    return (
        db.query(
            Colaborador.id.label("id"),
            Colaborador.nome.label("nome"),
            Colaborador.role_id.label("role_id"),
            Role.nivel_acesso.label("nivel_acesso"),
        )
        .join(Role, Role.id == Colaborador.role_id)
        .filter(Colaborador.id == user_id)
        .first()
    )


def can_view_pedido(nivel_acesso, criador_id, user_id):
    if nivel_acesso >= ROLE_GERENTE:
        return True
    return criador_id == user_id


def can_edit_pedido(nivel_acesso, criador_id, user_id):
    if nivel_acesso >= ROLE_ADMIN:
        return True
    if nivel_acesso >= ROLE_GERENTE:
        return criador_id == user_id
    if nivel_acesso >= ROLE_VENDEDOR:
        return criador_id == user_id
    return False


def can_delete_pedido(nivel_acesso, criador_id, user_id):
    if nivel_acesso >= ROLE_ADMIN:
        return True
    if nivel_acesso >= ROLE_GERENTE:
        return criador_id == user_id
    return False
