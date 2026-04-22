from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from utils.auth_middleware import token_required
from sqlalchemy import text

from querys.material_querys import (
    LISTAR_MATERIAIS,
    BUSCAR_MATERIAL_POR_ID,
    CRIAR_MATERIAL,
    ATUALIZAR_MATERIAL,
    DELETAR_MATERIAL
)

materiais_bp = Blueprint("materiais", __name__)


def serialize_material(item):
    return {
        "id": item["id"],
        "tipo": item["tipo"],
        "cor": item["cor"],
        "espessura": item["espessura"],
        "altura": float(item["altura"]) if item["altura"] is not None else 0,
        "largura": float(item["largura"]) if item["largura"] is not None else 0,
        "preco_m2": float(item["preco_m2"]) if item["preco_m2"] is not None else 0
    }


@materiais_bp.route("/materiais", methods=["GET"])
@token_required
def listar_materiais():
    db = SessionLocal()

    resultados = db.execute(text(LISTAR_MATERIAIS)).mappings().all()

    db.close()

    resposta = [serialize_material(item) for item in resultados]

    return jsonify(resposta)


@materiais_bp.route("/materiais/<int:id>", methods=["GET"])
@token_required
def buscar_material(id):
    db = SessionLocal()

    material = db.execute(
        text(BUSCAR_MATERIAL_POR_ID),
        {"material_id": id}
    ).mappings().first()

    db.close()

    if not material:
        return jsonify({"erro": "Material não encontrado"}), 404

    return jsonify(serialize_material(material))


@materiais_bp.route("/materiais", methods=["POST"])
@token_required
def criar_material():
    db = SessionLocal()

    try:
        dados = request.json

        resultado = db.execute(
            text(CRIAR_MATERIAL),
            {
                "tipo": dados["tipo"],
                "cor": dados["cor"],
                "espessura": dados["espessura"],
                "altura": dados.get("altura", 0),
                "largura": dados.get("largura", 0),
                "preco_m2": dados["preco_m2"]
            }
        ).mappings().first()

        db.commit()
        db.close()

        return jsonify({
            "message": "Material criado com sucesso",
            "id": resultado["id"]
        }), 201

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@materiais_bp.route("/materiais/<int:id>", methods=["PUT"])
@token_required
def atualizar_material(id):
    db = SessionLocal()

    try:
        dados = request.json

        material = db.execute(
            text(BUSCAR_MATERIAL_POR_ID),
            {"material_id": id}
        ).mappings().first()

        if not material:
            db.close()
            return jsonify({"erro": "Material não encontrado"}), 404

        db.execute(
            text(ATUALIZAR_MATERIAL),
            {
                "material_id": id,
                "tipo": dados["tipo"],
                "cor": dados["cor"],
                "espessura": dados["espessura"],
                "altura": dados.get("altura", 0),
                "largura": dados.get("largura", 0),
                "preco_m2": dados["preco_m2"]
            }
        )

        db.commit()
        db.close()

        return jsonify({"message": "Material atualizado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@materiais_bp.route("/materiais/<int:id>", methods=["DELETE"])
@token_required
def deletar_material(id):
    db = SessionLocal()

    try:
        material = db.execute(
            text(BUSCAR_MATERIAL_POR_ID),
            {"material_id": id}
        ).mappings().first()

        if not material:
            db.close()
            return jsonify({"erro": "Material não encontrado"}), 404

        db.execute(
            text(DELETAR_MATERIAL),
            {"material_id": id}
        )

        db.commit()
        db.close()

        return jsonify({"message": "Material deletado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500
