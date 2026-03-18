RESUMO_DASHBOARD = """
SELECT
    COUNT(*) AS total_pedidos,
    COUNT(*) FILTER (WHERE status_pedido = 'PENDENTE') AS pedidos_pendentes,
    COUNT(*) FILTER (WHERE status_pedido = 'EM_PRODUCAO') AS pedidos_em_producao,
    COALESCE(SUM(valor), 0) AS faturamento_total
FROM pedidos;
"""

PEDIDOS_STATUS = """
SELECT
    status_pedido AS status,
    COUNT(*) AS quantidade
FROM pedidos
GROUP BY status_pedido
ORDER BY status_pedido;
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
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.status_pedido AS status
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
ORDER BY p.data_entrada DESC
LIMIT 5;
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