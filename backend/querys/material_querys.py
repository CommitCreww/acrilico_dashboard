LISTAR_MATERIAIS = """
SELECT
    id,
    tipo,
    cor,
    espessura,
    altura,
    largura,
    preco_m2
FROM materiais
ORDER BY id;
"""

BUSCAR_MATERIAL_POR_ID = """
SELECT
    id,
    tipo,
    cor,
    espessura,
    altura,
    largura,
    preco_m2
FROM materiais
WHERE id = :material_id;
"""

CRIAR_MATERIAL = """
INSERT INTO materiais (tipo, cor, espessura, altura, largura, preco_m2)
VALUES (:tipo, :cor, :espessura, :altura, :largura, :preco_m2)
RETURNING id;
"""

ATUALIZAR_MATERIAL = """
UPDATE materiais
SET
    tipo = :tipo,
    cor = :cor,
    espessura = :espessura,
    altura = :altura,
    largura = :largura,
    preco_m2 = :preco_m2
WHERE id = :material_id;
"""

DELETAR_MATERIAL = """
DELETE FROM materiais
WHERE id = :material_id;
"""
