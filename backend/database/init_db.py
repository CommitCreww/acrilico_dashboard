from config import IS_PRODUCTION
from database.connection import Base, SessionLocal, engine
from database.models import Cliente, Colaborador, Material, Pagamento, Pedido, PedidoMaterial, Role
from utils.crypto import encrypt_cpf, hash_cpf, hash_password, is_encrypted_cpf, is_password_hash
from sqlalchemy import text
import os


DEFAULT_ROLES = [
    {"nome": "ADMIN", "nivel_acesso": 10},
    {"nome": "GERENTE", "nivel_acesso": 7},
    {"nome": "VENDEDOR", "nivel_acesso": 5},
]


def create_tables() -> None:
    # Importing models above registers every table in Base.metadata.
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE clientes ALTER COLUMN cpf_cnpj TYPE TEXT;"))
        conn.execute(text("ALTER TABLE clientes ADD COLUMN IF NOT EXISTS hash_cpf VARCHAR(64);"))


def migrate_clientes_cpf(db) -> None:
    clientes = db.query(Cliente).all()

    for cliente in clientes:
        if not cliente.cpf_cnpj:
            continue

        plain_cpf = cliente.cpf_cnpj

        if is_encrypted_cpf(cliente.cpf_cnpj):
            # The current key can decrypt this value. hash_cpf accepts the plaintext.
            from utils.crypto import decrypt_cpf

            plain_cpf = decrypt_cpf(cliente.cpf_cnpj)
        else:
            cliente.cpf_cnpj = encrypt_cpf(plain_cpf)

        cliente.hash_cpf = hash_cpf(plain_cpf)

    db.commit()


def migrate_colaboradores_passwords(db) -> None:
    colaboradores = db.query(Colaborador).all()

    for colaborador in colaboradores:
        if colaborador.senha and not is_password_hash(colaborador.senha):
            colaborador.senha = hash_password(colaborador.senha)

    db.commit()


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
    force_password_update = os.getenv("ADMIN_FORCE_PASSWORD_UPDATE", "").strip().lower() in {"1", "true", "yes", "on"}
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
        existing_admin.role_id = admin_role.id
        existing_admin.nome = name
        existing_admin.telefone = phone

        if force_password_update:
            if not password:
                raise RuntimeError("ADMIN_PASSWORD is required when ADMIN_FORCE_PASSWORD_UPDATE is enabled.")
            existing_admin.senha = hash_password(password)

        return

    db.add(
        Colaborador(
            nome=name,
            email=email,
            senha=hash_password(password),
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

        migrate_colaboradores_passwords(db)
        migrate_clientes_cpf(db)

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
    print("Database initialized successfully.")
