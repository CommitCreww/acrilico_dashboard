from pathlib import Path
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class ConfigError(RuntimeError):
    pass


def _get_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default

    try:
        return int(value)
    except ValueError as exc:
        raise ConfigError(f"{name} must be an integer.") from exc


def _get_required_in_production(name: str, development_default: str) -> str:
    value = os.getenv(name)
    if value:
        return value

    if APP_ENV == "production":
        raise ConfigError(f"{name} is required in production.")

    return development_default


def _normalize_database_url(value: str) -> str:
    if value.startswith("postgres://"):
        return value.replace("postgres://", "postgresql+psycopg2://", 1)

    if value.startswith("postgresql://"):
        return value.replace("postgresql://", "postgresql+psycopg2://", 1)

    return value


APP_ENV = os.getenv("APP_ENV", os.getenv("FLASK_ENV", "development")).strip().lower()
IS_PRODUCTION = APP_ENV == "production"

DATABASE_URL = _normalize_database_url(
    _get_required_in_production(
        "DATABASE_URL",
        "postgresql+psycopg2://admin:admin@localhost:5432/acrilico",
    )
)

JWT_SECRET_KEY = _get_required_in_production(
    "JWT_SECRET_KEY",
    "dev-only-change-me-before-deploy",
)
JWT_EXPIRATION_HOURS = _get_int("JWT_EXPIRATION_HOURS", 8)

if IS_PRODUCTION and len(JWT_SECRET_KEY) < 32:
    raise ConfigError("JWT_SECRET_KEY must have at least 32 characters in production.")

SECRET_KEY = _get_required_in_production("SECRET_KEY", JWT_SECRET_KEY)

_cors_default = "http://localhost:5173,http://127.0.0.1:5173"
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _cors_default).split(",")
    if origin.strip()
]

if IS_PRODUCTION and not CORS_ORIGINS:
    raise ConfigError("CORS_ORIGINS is required in production.")

if IS_PRODUCTION and "*" in CORS_ORIGINS:
    raise ConfigError("CORS_ORIGINS cannot use '*' in production.")

DEBUG = _get_bool("FLASK_DEBUG", False) and not IS_PRODUCTION
HOST = os.getenv("HOST", "0.0.0.0")
PORT = _get_int("PORT", 5000)
