LISTAR_CLIENTES = """
SELECT
    id,
    nome,
    email,
    telefone,
    cpf_cnpj,
    endereco,
    observacoes
FROM clientes
ORDER BY id;
"""

BUSCAR_CLIENTE_POR_ID = """
SELECT
    id,
    nome,
    email,
    telefone,
    cpf_cnpj,
    endereco,
    observacoes
FROM clientes
WHERE id = :cliente_id;
"""

CRIAR_CLIENTE = """
INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco, observacoes)
VALUES (:nome, :email, :telefone, :cpf_cnpj, :endereco, :observacoes)
RETURNING id;
"""

ATUALIZAR_CLIENTE = """
UPDATE clientes
SET
    nome = :nome,
    email = :email,
    telefone = :telefone,
    cpf_cnpj = :cpf_cnpj,
    endereco = :endereco,
    observacoes = :observacoes
WHERE id = :cliente_id;
"""

LISTAR_PEDIDOS_DO_CLIENTE = """
SELECT
    p.id,
    p.colaborador_id,
    c.nome AS cliente,
    p.descricao,
    p.valor,
    p.data_entrada,
    p.data_entrega,
    p.horario_entrega,
    p.status_pedido
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
WHERE p.cliente_id = :cliente_id
ORDER BY p.data_entrada DESC NULLS LAST, p.id DESC;
"""
