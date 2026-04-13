from datetime import datetime


STATUS_PEDIDOS_BASE = {"PENDENTE", "EM_PRODUCAO", "CONCLUIDO"}


def normalize_status_pedido(status_pedido, fallback="PENDENTE"):
    if status_pedido in STATUS_PEDIDOS_BASE:
        return status_pedido
    return fallback


def compute_status_pedido(status_pedido, data_entrega, horario_entrega):
    status_base = normalize_status_pedido(status_pedido, fallback=status_pedido)

    if status_base == "CONCLUIDO":
        return status_base

    if not data_entrega:
        return status_base

    agora = datetime.now()
    if horario_entrega:
        entrega_at = datetime.combine(data_entrega, horario_entrega)
        if agora > entrega_at:
            return "ATRASADO"
        return status_base

    if agora.date() > data_entrega:
        return "ATRASADO"

    return status_base
