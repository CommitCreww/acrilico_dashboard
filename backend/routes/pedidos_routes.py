from flask import Blueprint, request, jsonify, g, send_file
from database.connection import SessionLocal
from database.models import Pedido, PedidoMaterial, Pagamento
from utils.auth_middleware import token_required
from datetime import datetime, date, time
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from utils.pedidos_status import compute_status_pedido, normalize_status_pedido
from utils.crypto import decrypt_cpf
from utils.permissions import (
    can_delete_pedido,
    can_edit_pedido,
    can_view_pedido,
    get_usuario_contexto,
)
from sqlalchemy import text

from querys.pedidos_querys import (
    LISTAR_PEDIDOS,
    LISTAR_PEDIDOS_POR_CLIENTE,
    BUSCAR_PEDIDO_POR_ID,
    BUSCAR_MATERIAIS_DO_PEDIDO,
    BUSCAR_PAGAMENTOS_DO_PEDIDO,
    DELETAR_PAGAMENTOS_DO_PEDIDO,
    DELETAR_PEDIDO,
    BUSCAR_CLIENTE_EXISTENTE,
    BUSCAR_MATERIAL_EXISTENTE,
    DELETAR_MATERIAIS_DO_PEDIDO,
)


pedidos_bp = Blueprint("pedidos", __name__)


def resolve_valor_pago(valor_total, valor_pago, status_pagamento):
    valor_pago_normalizado = float(valor_pago) if valor_pago is not None else 0

    if status_pagamento == "PAGO" and valor_pago_normalizado <= 0:
        return valor_total

    return valor_pago_normalizado


def serialize_pedido_list_item(item, nivel_acesso, user_id):
    horario_entrega = item["horario_entrega"]
    if horario_entrega is not None:
        horario_entrega = (
            horario_entrega.strftime("%H:%M")
            if isinstance(horario_entrega, time)
            else str(horario_entrega)
        )

    return {
        "id": item["id"],
        "cliente": item["cliente"],
        "descricao": item["descricao"],
        "valor": float(item["valor"]) if item["valor"] is not None else 0,
        "data_entrada": str(item["data_entrada"]) if item["data_entrada"] else None,
        "data_entrega": str(item["data_entrega"]) if item["data_entrega"] else None,
        "horario_entrega": horario_entrega,
        "status_pedido": compute_status_pedido(
            item["status_pedido"],
            item["data_entrega"],
            item["horario_entrega"],
        ),
        "can_edit": can_edit_pedido(nivel_acesso, item["colaborador_id"], user_id),
        "can_delete": can_delete_pedido(nivel_acesso, item["colaborador_id"], user_id),
    }


def gerar_pdf_recibo(pedido, materiais, pagamentos):
    buffer = BytesIO()
    page_width, page_height = A4
    margin = 20 * mm
    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.setTitle(f"Recibo Pedido {pedido['id']}")

    def draw_heading(text, x, y):
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(x, y, text)

    def format_field(value):
        if isinstance(value, (datetime, date)):
            return value.strftime("%d/%m/%Y")
        return str(value) if value is not None else "-"

    def draw_label_value(label, value, x, y, label_size=9, value_size=10):
        pdf.setFont("Helvetica-Bold", label_size)
        pdf.drawString(x, y, label)
        pdf.setFont("Helvetica", value_size)
        pdf.drawString(x + 80, y, format_field(value))

    y = page_height - margin
    draw_heading("Recibo de Venda", margin, y)
    pdf.setFont("Helvetica", 10)
    pdf.drawRightString(page_width - margin, y, datetime.now().strftime("%d/%m/%Y"))
    y -= 24

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(margin, y, "LUDARTE ACRÍLICOS")
    pdf.setFont("Helvetica", 9)
    pdf.drawString(margin, y - 14, "Rua do Gasômetro, 522 - Bras")
    pdf.drawString(margin, y - 26, "Email: contato@ludarteacrilicos.com")
    pdf.drawString(margin, y - 38, "Telefone: (27) 99999-9999")
    pdf.setStrokeColorRGB(0.7, 0.7, 0.7)
    pdf.setLineWidth(0.8)
    pdf.line(margin, y - 48, page_width - margin, y - 48)
    y -= 64

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(margin, y, "Pedido")
    pdf.drawString(page_width / 2 + 10, y, "Cliente")
    y -= 16
    pdf.setFont("Helvetica", 10)
    pdf.drawString(margin, y, f"Pedido #{pedido['id']}")
    pdf.drawString(page_width / 2 + 10, y, pedido['cliente'])
    y -= 14
    pdf.drawString(margin, y, f"Vendedor: {pedido['colaborador']}")
    pdf.drawString(page_width / 2 + 10, y, pedido.get('cliente_email') or '-')
    y -= 14
    pdf.drawString(margin, y, f"Status: {pedido['status_pedido'].replace('_', ' ')}")
    pdf.drawString(page_width / 2 + 10, y, pedido.get('cliente_telefone') or '-')
    y -= 14
    pdf.drawString(margin, y, f"Entrega: {format_field(pedido.get('data_entrega'))}")
    pdf.drawString(page_width / 2 + 10, y, f"CPF/CNPJ: {decrypt_cpf(pedido.get('cliente_cpf_cnpj')) or '-'}")
    y -= 14
    pdf.drawString(margin, y, f"Descrição: {pedido.get('descricao') or '-'}")
    pdf.drawRightString(page_width - margin, y, f"Total Pedido: R$ {float(pedido['valor'] or 0):.2f}")
    y -= 26

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Materiais")
    y -= 16
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(margin, y, "Descrição")
    pdf.drawRightString(page_width - margin - 180, y, "Qtd")
    pdf.drawRightString(page_width - margin - 100, y, "Preço Unit.")
    pdf.drawRightString(page_width - margin, y, "Subtotal")
    y -= 10
    pdf.setLineWidth(0.5)
    pdf.line(margin, y, page_width - margin, y)
    y -= 14
    pdf.setFont("Helvetica", 10)

    total_geral = 0.0
    for item in materiais:
        if y < margin + 80:
            pdf.showPage()
            y = page_height - margin
            pdf.setFont("Helvetica", 10)

        medidas = f"{float(item.get('largura') or 0):.2f} x {float(item.get('altura') or 0):.2f}m"
        descricao = f"{item['tipo']} {item['cor']} {item['espessura']} - {medidas}"
        quantidade = item.get('quantidade') or 0
        area = float(item.get('largura') or 0) * float(item.get('altura') or 0)
        preco = float(item.get('preco_m2') or 0)
        subtotal = float(quantidade) * (area if area > 0 else 1) * preco
        total_geral += subtotal

        pdf.drawString(margin, y, descricao[:52])
        pdf.drawRightString(page_width - margin - 180, y, str(quantidade))
        pdf.drawRightString(page_width - margin - 100, y, f"R$ {preco:.2f}")
        pdf.drawRightString(page_width - margin, y, f"R$ {subtotal:.2f}")
        y -= 14

    y -= 8
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawRightString(page_width - margin, y, f"Total materiais: R$ {total_geral:.2f}")
    y -= 22

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Pagamentos")
    y -= 16
    pdf.setFont("Helvetica", 10)

    if pagamentos:
        pago = 0.0
        for pagamento in pagamentos:
            status = pagamento['status_pagamento'].replace('_', ' ')
            valor_pago = float(pagamento.get('valor_pago') or 0)
            pago += valor_pago
            pdf.drawString(margin, y, f"{status}")
            pdf.drawString(page_width / 2 - 20, y, f"{pagamento.get('forma_pagamento') or '-'}")
            pdf.drawRightString(page_width - margin - 100, y, f"R$ {valor_pago:.2f}")
            pdf.drawRightString(page_width - margin, y, format_field(pagamento.get('data_pagamento')))
            y -= 14
            if y < margin + 80:
                pdf.showPage()
                y = page_height - margin
                pdf.setFont("Helvetica", 10)

        y -= 8
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(margin, y, f"Total pago: R$ {pago:.2f}")
        pdf.drawRightString(page_width - margin, y, f"Saldo: R$ {float(pedido['valor'] or 0) - pago:.2f}")
        y -= 18
    else:
        pdf.drawString(margin, y, "Nenhum pagamento registrado.")
        y -= 18

    pdf.setFillColorRGB(0.2, 0.2, 0.2)
    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawString(margin, y, "Agradecemos pela preferência. Este recibo comprova a operação de venda e pode ser usado para fins fiscais e de entrega.")
    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer


@pedidos_bp.route("/pedidos/<int:id>/recibo", methods=["GET"])
@token_required
def download_pedido_recibo(id):
    db = SessionLocal()

    try:
        usuario = get_usuario_contexto(db, g.user_id)
        if not usuario:
            db.close()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        pedido = db.execute(
            text(BUSCAR_PEDIDO_POR_ID),
            {"pedido_id": id}
        ).mappings().first()

        if not pedido:
            db.close()
            return jsonify({"erro": "Pedido não encontrado"}), 404

        if not can_view_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id):
            db.close()
            return jsonify({"erro": "Você não tem permissão para visualizar este pedido"}), 403

        materiais = db.execute(
            text(BUSCAR_MATERIAIS_DO_PEDIDO),
            {"pedido_id": id}
        ).mappings().all()

        pagamentos = db.execute(
            text(BUSCAR_PAGAMENTOS_DO_PEDIDO),
            {"pedido_id": id}
        ).mappings().all()

        pdf_buffer = gerar_pdf_recibo(pedido, materiais, pagamentos)
        db.close()

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"recibo_pedido_{id}.pdf"
        )
    except Exception as e:
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos", methods=["GET"])
@token_required
def listar_pedidos():
    db = SessionLocal()

    try:
        usuario = get_usuario_contexto(db, g.user_id)
        if not usuario:
            db.close()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        try:
            page = max(int(request.args.get("page", 1)), 1)
        except ValueError:
            page = 1

        try:
            limit = max(min(int(request.args.get("limit", 5)), 50), 1)
        except ValueError:
            limit = 5

        search = (request.args.get("search", "") or "").strip()
        status_filter = (request.args.get("status", "") or "").strip().upper()

        if search:
            search_param = f"%{search.lower()}%"
            resultados = db.execute(
                text(LISTAR_PEDIDOS_POR_CLIENTE),
                {"search": search_param},
            ).mappings().all()
        else:
            resultados = db.execute(text(LISTAR_PEDIDOS)).mappings().all()

        pedidos_visiveis = [
            item
            for item in resultados
            if can_view_pedido(usuario.nivel_acesso, item["colaborador_id"], g.user_id)
        ]

        if status_filter:
            pedidos_visiveis = [
                item
                for item in pedidos_visiveis
                if compute_status_pedido(
                    item["status_pedido"],
                    item["data_entrega"],
                    item["horario_entrega"],
                ) == status_filter
            ]

        total = len(pedidos_visiveis)
        pages = (total + limit - 1) // limit if total > 0 else 0
        offset = (page - 1) * limit
        pagina_atual = pedidos_visiveis[offset:offset + limit]

        resposta = [
            serialize_pedido_list_item(item, usuario.nivel_acesso, g.user_id)
            for item in pagina_atual
        ]

        db.close()

        return jsonify({
            "pedidos": resposta,
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages,
        })
    except Exception as e:
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos/<int:id>", methods=["GET"])
@token_required
def buscar_pedido(id):
    db = SessionLocal()

    usuario = get_usuario_contexto(db, g.user_id)
    if not usuario:
        db.close()
        return jsonify({"erro": "Usuário não encontrado"}), 404

    pedido = db.execute(
        text(BUSCAR_PEDIDO_POR_ID),
        {"pedido_id": id}
    ).mappings().first()

    if not pedido:
        db.close()
        return jsonify({"erro": "Pedido não encontrado"}), 404

    if not can_view_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id):
        db.close()
        return jsonify({"erro": "Você não tem permissão para visualizar este pedido"}), 403

    materiais = db.execute(
        text(BUSCAR_MATERIAIS_DO_PEDIDO),
        {"pedido_id": id}
    ).mappings().all()

    pagamentos = db.execute(
        text(BUSCAR_PAGAMENTOS_DO_PEDIDO),
        {"pedido_id": id}
    ).mappings().all()

    db.close()

    resposta_materiais = []

    for item in materiais:
        resposta_materiais.append({
            "material_id": item["material_id"],
            "tipo": item["tipo"],
            "cor": item["cor"],
            "espessura": item["espessura"],
            "altura": float(item["altura"]) if item["altura"] is not None else 0,
            "largura": float(item["largura"]) if item["largura"] is not None else 0,
            "quantidade": item["quantidade"],
            "preco_m2": float(item["preco_m2"]) if item["preco_m2"] is not None else 0
        })

    resposta_pagamentos = []

    for item in pagamentos:
        resposta_pagamentos.append({
            "id": item["id"],
            "forma_pagamento": item["forma_pagamento"],
            "status_pagamento": item["status_pagamento"],
            "valor_pago": float(item["valor_pago"]) if item["valor_pago"] is not None else 0,
            "data_pagamento": str(item["data_pagamento"]) if item["data_pagamento"] else None,
        })

    horario_entrega = pedido["horario_entrega"]
    if horario_entrega is not None:
        horario_entrega = horario_entrega.strftime("%H:%M") if isinstance(horario_entrega, time) else str(horario_entrega)

    resultado = {
        "id": pedido["id"],
        "cliente": pedido["cliente"],
        "descricao": pedido["descricao"],
        "valor": float(pedido["valor"]) if pedido["valor"] is not None else 0,
        "data_entrada": str(pedido["data_entrada"]) if pedido["data_entrada"] else None,
        "data_entrega": str(pedido["data_entrega"]) if pedido["data_entrega"] else None,
        "horario_entrega": horario_entrega,
        "status_pedido": compute_status_pedido(pedido["status_pedido"], pedido["data_entrega"], pedido["horario_entrega"]),
        "can_edit": can_edit_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id),
        "can_delete": can_delete_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id),
        "materiais": resposta_materiais,
        "pagamentos": resposta_pagamentos
    }

    return jsonify(resultado)


@pedidos_bp.route("/pedidos", methods=["POST"])
@token_required
def criar_pedido():
    db = SessionLocal()

    try:
        dados = request.json

        cliente = db.execute(
            text(BUSCAR_CLIENTE_EXISTENTE),
            {"cliente_id": dados["cliente_id"]}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente não encontrado"}), 404

        data_entrada = datetime.strptime(dados["data_entrada"], "%Y-%m-%d").date()
        data_entrega = datetime.strptime(dados["data_entrega"], "%Y-%m-%d").date()
        horario_entrega = None
        horario_value = dados.get("horario_entrega")
        if horario_value:
            horario_entrega = datetime.strptime(horario_value, "%H:%M").time()

        status_pedido = normalize_status_pedido(dados.get("status_pedido", "PENDENTE"))

        novo_pedido = Pedido(
            colaborador_id=g.user_id,
            cliente_id=dados["cliente_id"],
            descricao=dados["descricao"],
            valor=dados["valor"],
            data_entrada=data_entrada,
            data_entrega=data_entrega,
            horario_entrega=horario_entrega,
            status_pedido=status_pedido
        )

        db.add(novo_pedido)
        db.commit()
        db.refresh(novo_pedido)

        pedido_id = novo_pedido.id

        for item in dados["materiais"]:
            material = db.execute(
                text(BUSCAR_MATERIAL_EXISTENTE),
                {"material_id": item["material_id"]}
            ).mappings().first()

            if not material:
                db.rollback()
                db.close()
                return jsonify({"erro": f"Material {item['material_id']} não encontrado"}), 404

            pedido_material = PedidoMaterial(
                pedido_id=pedido_id,
                material_id=item["material_id"],
                quantidade=item["quantidade"]
            )

            db.add(pedido_material)

        valor_pago = dados.get("valor_pago")
        forma_pagamento = dados.get("forma_pagamento")
        status_pagamento = dados.get("status_pagamento")
        data_pagamento = dados.get("data_pagamento")
        valor_pago_resolvido = resolve_valor_pago(
            dados["valor"],
            valor_pago,
            status_pagamento,
        )

        if valor_pago is not None or status_pagamento:
            novo_pagamento = Pagamento(
                pedido_id=pedido_id,
                forma_pagamento=forma_pagamento,
                status_pagamento=status_pagamento,
                valor_pago=valor_pago_resolvido,
                data_pagamento=datetime.strptime(data_pagamento, "%Y-%m-%d").date() if data_pagamento else None,
            )
            db.add(novo_pagamento)

        db.commit()
        db.close()

        return jsonify({
            "message": "Pedido criado com sucesso",
            "pedido_id": pedido_id
        }), 201

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos/<int:id>", methods=["PUT"])
@token_required
def atualizar_pedido(id):
    db = SessionLocal()

    try:
        dados = request.json

        usuario = get_usuario_contexto(db, g.user_id)
        if not usuario:
            db.close()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        pedido_existente = db.execute(
            text(BUSCAR_PEDIDO_POR_ID),
            {"pedido_id": id}
        ).mappings().first()

        if not pedido_existente:
            db.close()
            return jsonify({"erro": "Pedido não encontrado"}), 404

        if not can_edit_pedido(usuario.nivel_acesso, pedido_existente["colaborador_id"], g.user_id):
            db.close()
            return jsonify({"erro": "Você não tem permissão para editar este pedido"}), 403

        cliente = db.execute(
            text(BUSCAR_CLIENTE_EXISTENTE),
            {"cliente_id": dados["cliente_id"]}
        ).mappings().first()

        if not cliente:
            db.close()
            return jsonify({"erro": "Cliente não encontrado"}), 404

        pedido = db.query(Pedido).filter(Pedido.id == id).first()

        pedido.cliente_id = dados["cliente_id"]
        pedido.descricao = dados["descricao"]
        pedido.valor = dados["valor"]
        pedido.data_entrada = datetime.strptime(dados["data_entrada"], "%Y-%m-%d").date()
        pedido.data_entrega = datetime.strptime(dados["data_entrega"], "%Y-%m-%d").date()
        horario_entrega = None
        horario_value = dados.get("horario_entrega")
        if horario_value:
            horario_entrega = datetime.strptime(horario_value, "%H:%M").time()
        pedido.horario_entrega = horario_entrega
        pedido.status_pedido = normalize_status_pedido(
            dados.get("status_pedido"),
            fallback=pedido_existente["status_pedido"]
        )

        db.execute(
            text(DELETAR_MATERIAIS_DO_PEDIDO),
            {"pedido_id": id}
        )

        for item in dados["materiais"]:
            material = db.execute(
                text(BUSCAR_MATERIAL_EXISTENTE),
                {"material_id": item["material_id"]}
            ).mappings().first()

            if not material:
                db.rollback()
                db.close()
                return jsonify({"erro": f"Material {item['material_id']} não encontrado"}), 404

            novo_item = PedidoMaterial(
                pedido_id=id,
                material_id=item["material_id"],
                quantidade=item["quantidade"]
            )

            db.add(novo_item)

        db.execute(
            text(DELETAR_PAGAMENTOS_DO_PEDIDO),
            {"pedido_id": id}
        )

        valor_pago = dados.get("valor_pago")
        forma_pagamento = dados.get("forma_pagamento")
        status_pagamento = dados.get("status_pagamento")
        data_pagamento = dados.get("data_pagamento")
        valor_pago_resolvido = resolve_valor_pago(
            dados["valor"],
            valor_pago,
            status_pagamento,
        )

        if valor_pago is not None or status_pagamento:
            novo_pagamento = Pagamento(
                pedido_id=id,
                forma_pagamento=forma_pagamento,
                status_pagamento=status_pagamento,
                valor_pago=valor_pago_resolvido,
                data_pagamento=datetime.strptime(data_pagamento, "%Y-%m-%d").date() if data_pagamento else None,
            )
            db.add(novo_pagamento)

        db.commit()
        db.close()

        return jsonify({"message": "Pedido atualizado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500


@pedidos_bp.route("/pedidos/<int:id>", methods=["DELETE"])
@token_required
def deletar_pedido(id):
    db = SessionLocal()

    try:
        usuario = get_usuario_contexto(db, g.user_id)
        if not usuario:
            db.close()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        pedido = db.execute(
            text(BUSCAR_PEDIDO_POR_ID),
            {"pedido_id": id}
        ).mappings().first()

        if not pedido:
            db.close()
            return jsonify({"erro": "Pedido não encontrado"}), 404

        if not can_delete_pedido(usuario.nivel_acesso, pedido["colaborador_id"], g.user_id):
            db.close()
            return jsonify({"erro": "Você não tem permissão para excluir este pedido"}), 403

        db.execute(
            text(DELETAR_MATERIAIS_DO_PEDIDO),
            {"pedido_id": id}
        )

        db.execute(
            text(DELETAR_PAGAMENTOS_DO_PEDIDO),
            {"pedido_id": id}
        )

        db.execute(
            text(DELETAR_PEDIDO),
            {"pedido_id": id}
        )

        db.commit()
        db.close()

        return jsonify({"message": "Pedido deletado com sucesso"}), 200

    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"erro": str(e)}), 500
