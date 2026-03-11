from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from database.models import Material

materiais_bp = Blueprint("materiais", __name__)


# LISTAR MATERIAIS
@materiais_bp.route("/materiais", methods=["GET"])
def listar_materiais():
    db = SessionLocal()

    materiais = db.query(Material).all()

    resultado = []

    for m in materiais:
        resultado.append({
            "id": m.id,
            "tipo": m.tipo,
            "cor": m.cor,
            "espessura": m.espessura,
            "preco_m2": float(m.preco_m2)
        })

    db.close()

    return jsonify(resultado)

@materiais_bp.route("/materiais", methods=["POST"])
def criar_material():
    db = SessionLocal()

    dados = request.json

    novo_material = Material(
        tipo=dados["tipo"],
        cor=dados["cor"],
        espessura=dados["espessura"],
        preco_m2=dados["preco_m2"]
    )

    db.add(novo_material)
    db.commit()

    db.refresh(novo_material)

    db.close()

    return jsonify({
        "message": "Material criado com sucesso",
        "id": novo_material.id
    })

@materiais_bp.route("/materiais/<int:id>", methods=["PUT"])
def atualizar_material(id):
    db = SessionLocal()

    dados = request.json

    material = db.query(Material).filter(Material.id == id).first()

    if not material:
        db.close()
        return jsonify({"erro": "Material não encontrado"}), 404

    material.tipo = dados["tipo"]
    material.cor = dados["cor"]
    material.espessura = dados["espessura"]
    material.preco_m2 = dados["preco_m2"]

    db.commit()

    db.close()

    return jsonify({"message": "Material atualizado"})


@materiais_bp.route("/materiais/<int:id>", methods=["DELETE"])
def deletar_material(id):
    db = SessionLocal()

    material = db.query(Material).filter(Material.id == id).first()

    if not material:
        db.close()
        return jsonify({"erro": "Material não encontrado"}), 404

    db.delete(material)
    db.commit()

    db.close()

    return jsonify({"message": "Material deletado"})