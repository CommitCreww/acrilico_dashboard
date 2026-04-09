LISTAR_CLIENTES = """
SELECT
    id,
    nome,
    email,
    telefone,
    cpf_cnpj,
    endereco
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
    endereco
FROM clientes
WHERE id = :cliente_id;
"""

CRIAR_CLIENTE = """
INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco)
VALUES (:nome, :email, :telefone, :cpf_cnpj, :endereco)
RETURNING id;
"""

ATUALIZAR_CLIENTE = """
UPDATE clientes
SET
    nome = :nome,
    email = :email,
    telefone = :telefone,
    cpf_cnpj = :cpf_cnpj,
    endereco = :endereco
WHERE id = :cliente_id;
"""