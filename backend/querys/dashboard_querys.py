RESUMO_DASHBOARD = """
SELECT
    id,
    colaborador_id,
    valor,
    data_entrega,
    horario_entrega,
    status_pedido
FROM pedidos;
"""

PEDIDOS_STATUS = """
SELECT
    colaborador_id,
    data_entrega,
    horario_entrega,
    status_pedido
FROM pedidos;
"""

FATURAMENTO_MENSAL = """
SELECT
    EXTRACT(MONTH FROM data_entrada) AS mes,
    COALESCE(SUM(valor), 0) AS total
FROM pedidos
GROUP BY EXTRACT(MONTH FROM data_entrada)
ORDER BY mes;
"""

MATERIAIS_MAIS_USADOS = """
SELECT
    CONCAT(m.tipo, ' ', m.cor) AS material,
    SUM(pm.quantidade) AS quantidade
FROM pedido_materiais pm
JOIN materiais m ON m.id = pm.material_id
GROUP BY m.tipo, m.cor
ORDER BY quantidade DESC;
"""

PEDIDOS_RECENTES = """
SELECT
    p.id,
    p.colaborador_id,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido AS status
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
ORDER BY p.data_entrada DESC
"""

PEDIDOS_ENTREGA_HOJE = """
SELECT
    p.id,
    p.colaborador_id,
    c.nome AS cliente,
    col.nome AS colaborador,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
JOIN colaboradores col ON col.id = p.colaborador_id
WHERE p.data_entrega = CURRENT_DATE
ORDER BY p.horario_entrega NULLS LAST, p.id DESC;
"""

FATURAMENTO_POR_CLIENTE = """
SELECT
    c.nome AS cliente,
    COALESCE(SUM(p.valor), 0) AS faturamento
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
GROUP BY c.nome
ORDER BY faturamento DESC;
"""
