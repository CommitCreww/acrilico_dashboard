LISTAR_PEDIDOS = """
SELECT
    p.id,
    p.colaborador_id,
    col.nome AS colaborador,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido
FROM pedidos p
JOIN colaboradores col ON col.id = p.colaborador_id
JOIN clientes c ON c.id = p.cliente_id
ORDER BY p.id DESC;
"""

LISTAR_PEDIDOS_POR_CLIENTE = """
SELECT
    p.id,
    p.colaborador_id,
    col.nome AS colaborador,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido
FROM pedidos p
JOIN colaboradores col ON col.id = p.colaborador_id
JOIN clientes c ON c.id = p.cliente_id
WHERE LOWER(c.nome) LIKE :search
ORDER BY p.id DESC;
"""

CONTAR_PEDIDOS = """
SELECT COUNT(*) AS total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;
"""

CONTAR_PEDIDOS_POR_CLIENTE = """
SELECT COUNT(*) AS total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
WHERE LOWER(c.nome) LIKE :search;
"""

BUSCAR_PEDIDO_POR_ID = """
SELECT
    p.id,
    p.colaborador_id,
    col.nome AS colaborador,
    c.nome AS cliente,
    c.email AS cliente_email,
    c.telefone AS cliente_telefone,
    c.cpf_cnpj AS cliente_cpf_cnpj,
    c.endereco AS cliente_endereco,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido
FROM pedidos p
JOIN colaboradores col ON col.id = p.colaborador_id
JOIN clientes c ON c.id = p.cliente_id
WHERE p.id = :pedido_id;
"""

BUSCAR_MATERIAIS_DO_PEDIDO = """
SELECT
    pm.material_id,
    m.tipo,
    m.cor,
    m.espessura,
    m.altura,
    m.largura,
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

BUSCAR_PAGAMENTOS_DO_PEDIDO = """
SELECT
    id,
    forma_pagamento,
    status_pagamento,
    valor_pago,
    data_pagamento
FROM pagamentos
WHERE pedido_id = :pedido_id
ORDER BY id;
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
