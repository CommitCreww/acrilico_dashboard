from config import IS_PRODUCTION
from database.connection import Base, SessionLocal, engine
from database.models import Cliente, Colaborador, Material, Pagamento, Pedido, PedidoMaterial, Role
import os


DEFAULT_ROLES = [
    {"nome": "ADMIN", "nivel_acesso": 10},
    {"nome": "GERENTE", "nivel_acesso": 7},
    {"nome": "VENDEDOR", "nivel_acesso": 5},
]


def create_tables() -> None:
    # Importing models above registers every table in Base.metadata.
    Base.metadata.create_all(bind=engine)


def seed_roles(db) -> None:
    for role_data in DEFAULT_ROLES:
        role = db.query(Role).filter(Role.nome == role_data["nome"]).first()

        if role:
            role.nivel_acesso = role_data["nivel_acesso"]
            continue

        db.add(Role(**role_data))


def seed_admin(db) -> None:
    email = os.getenv("ADMIN_EMAIL", "admin@local.dev").strip().lower()
    password = os.getenv("ADMIN_PASSWORD")
    name = os.getenv("ADMIN_NAME", "Admin").strip() or "Admin"
    phone = os.getenv("ADMIN_PHONE", "00000000000").strip() or "00000000000"

    if IS_PRODUCTION and not password:
        raise RuntimeError("ADMIN_PASSWORD is required when initializing the database in production.")

    password = password or "admin123"

    admin_role = db.query(Role).filter(Role.nome == "ADMIN").first()
    if not admin_role:
        raise RuntimeError("ADMIN role was not created.")

    existing_admin = db.query(Colaborador).filter(Colaborador.email == email).first()
    if existing_admin:
        return

    db.add(
        Colaborador(
            nome=name,
            email=email,
            senha=password,
            telefone=phone,
            role_id=admin_role.id,
        )
    )


def init_database() -> None:
    create_tables()

    db = SessionLocal()
    try:
        seed_roles(db)
        db.commit()

        seed_admin(db)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
    print("Database initialized successfully.")
