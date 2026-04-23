from flask import Blueprint, g, jsonify, request
from sqlalchemy.exc import IntegrityError

from database.connection import SessionLocal
from database.models import Colaborador, Role
from utils.auth_middleware import token_required
from utils.crypto import hash_password
from utils.permissions import ROLE_ADMIN, get_usuario_contexto


colaboradores_bp = Blueprint("colaboradores", __name__)


def require_admin(db):
    usuario = get_usuario_contexto(db, g.user_id)
    if not usuario:
        return None, (jsonify({"erro": "Usuario nao encontrado"}), 404)

    if usuario.nivel_acesso < ROLE_ADMIN:
        return None, (jsonify({"erro": "Apenas administradores podem gerenciar colaboradores"}), 403)

    return usuario, None


def serialize_colaborador(colaborador):
    role = colaborador.role

    return {
        "id": colaborador.id,
        "nome": colaborador.nome,
        "email": colaborador.email,
        "telefone": colaborador.telefone,
        "role_id": colaborador.role_id,
        "role": role.nome if role else None,
        "nivel_acesso": role.nivel_acesso if role else 0,
    }


@colaboradores_bp.route("/colaboradores", methods=["GET"])
@token_required
def listar_colaboradores():
    db = SessionLocal()

    try:
        _, error = require_admin(db)
        if error:
            return error

        colaboradores = (
            db.query(Colaborador)
            .join(Role, Role.id == Colaborador.role_id)
            .order_by(Colaborador.id.asc())
            .all()
        )

        return jsonify([serialize_colaborador(colaborador) for colaborador in colaboradores])
    finally:
        db.close()


@colaboradores_bp.route("/colaboradores/roles", methods=["GET"])
@token_required
def listar_roles():
    db = SessionLocal()

    try:
        _, error = require_admin(db)
        if error:
            return error

        roles = db.query(Role).order_by(Role.nivel_acesso.desc()).all()
        return jsonify([
            {
                "id": role.id,
                "nome": role.nome,
                "nivel_acesso": role.nivel_acesso,
            }
            for role in roles
        ])
    finally:
        db.close()


@colaboradores_bp.route("/colaboradores", methods=["POST"])
@token_required
def criar_colaborador():
    db = SessionLocal()

    try:
        _, error = require_admin(db)
        if error:
            return error

        dados = request.get_json(silent=True) or {}
        nome = (dados.get("nome") or "").strip()
        email = (dados.get("email") or "").strip().lower()
        senha = dados.get("senha") or ""
        telefone = (dados.get("telefone") or "").strip()
        role_id = dados.get("role_id")

        if not nome or not email or not senha or not telefone or not role_id:
            return jsonify({"erro": "nome, email, senha, telefone e role_id sao obrigatorios"}), 400

        if len(senha) < 10:
            return jsonify({"erro": "A senha deve ter pelo menos 10 caracteres"}), 400

        role = db.query(Role).filter(Role.id == role_id).first()
        if not role:
            return jsonify({"erro": "Role nao encontrada"}), 404

        colaborador = Colaborador(
            nome=nome,
            email=email,
            senha=hash_password(senha),
            telefone=telefone,
            role_id=role.id,
        )

        db.add(colaborador)
        db.commit()
        db.refresh(colaborador)

        return jsonify({
            "message": "Colaborador criado com sucesso",
            "colaborador": serialize_colaborador(colaborador),
        }), 201
    except IntegrityError:
        db.rollback()
        return jsonify({"erro": "Ja existe um colaborador com esse email"}), 409
    except Exception as exc:
        db.rollback()
        return jsonify({"erro": str(exc)}), 500
    finally:
        db.close()
