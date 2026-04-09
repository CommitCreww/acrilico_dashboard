LISTAR_PEDIDOS = """
SELECT
    p.id,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.status_pedido
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
ORDER BY p.id;
"""

BUSCAR_PEDIDO_POR_ID = """
SELECT
    p.id,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.status_pedido
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
WHERE p.id = :pedido_id;
"""

BUSCAR_MATERIAIS_DO_PEDIDO = """
SELECT
    pm.material_id,
    m.tipo,
    m.cor,
    m.espessura,
    pm.quantidade,
    m.preco_m2
FROM pedido_materiais pm
JOIN materiais m ON m.id = pm.material_id
WHERE pm.pedido_id = :pedido_id
ORDER BY pm.id;
"""

DELETAR_MATERIAIS_DO_PEDIDO = """
DELETE FROM pedido_materiais
WHERE pedido_id = :pedido_id;
"""

DELETAR_PAGAMENTOS_DO_PEDIDO = """
DELETE FROM pagamentos
WHERE pedido_id = :pedido_id;
"""

DELETAR_PEDIDO = """
DELETE FROM pedidos
WHERE id = :pedido_id;
"""

BUSCAR_CLIENTE_EXISTENTE = """
SELECT id
FROM clientes
WHERE id = :cliente_id;
"""

BUSCAR_MATERIAL_EXISTENTE = """
SELECT id
FROM materiais
WHERE id = :material_id;
"""