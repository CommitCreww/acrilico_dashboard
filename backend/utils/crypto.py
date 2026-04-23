import hashlib
import hmac
from cryptography.fernet import Fernet
from cryptography.fernet import InvalidToken
from werkzeug.security import generate_password_hash, check_password_hash
from config import CPF_HASH_KEY, FERNET_KEY

fernet = Fernet(FERNET_KEY.encode())


def normalize_document(value: str | None) -> str:
    if not value:
        return ""

    return "".join(character for character in value if character.isalnum()).upper()


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def check_password(hashed_password: str, password: str) -> bool:
    try:
        return check_password_hash(hashed_password, password)
    except ValueError:
        return False


def is_password_hash(value: str | None) -> bool:
    if not value:
        return False

    return value.startswith(("scrypt:", "pbkdf2:", "argon2:"))


def encrypt_cpf(cpf: str) -> str:
    return fernet.encrypt(cpf.encode("utf-8")).decode("utf-8")


def decrypt_cpf(encrypted_cpf: str) -> str:
    if not encrypted_cpf:
        return ""

    try:
        return fernet.decrypt(encrypted_cpf.encode("utf-8")).decode("utf-8")
    except (InvalidToken, ValueError):
        # Backward compatibility for local/plaintext legacy data before encryption.
        return encrypted_cpf


def hash_cpf(cpf: str) -> str:
    normalized = normalize_document(cpf)
    return hmac.new(
        CPF_HASH_KEY.encode("utf-8"),
        normalized.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def is_encrypted_cpf(value: str | None) -> bool:
    if not value:
        return False

    try:
        fernet.decrypt(value.encode("utf-8"))
        return True
    except (InvalidToken, ValueError):
        return False
