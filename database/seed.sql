INSERT INTO roles (nome, nivel_acesso) VALUES
('ADMIN', 10),
('GERENTE', 7),
('VENDEDOR', 5);

INSERT INTO colaboradores (nome, email, senha, telefone, role_id) VALUES
('Lucas Admin', 'lucas@email.com', '123456', '11999999999', 1),
('Felipe Gerente', 'felipe@email.com', '123456', '11988888888', 2),
('Claudia Vendas', 'claudia@email.com', '123456', '11977777777', 3);

INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco) VALUES
('Loja Central', 'contato@lojacentral.com', '1133334444', '12.345.678/0001-00', 'Rua das Flores 123'),
('Mercado Popular', 'mercado@email.com', '1144445555', '23.456.789/0001-11', 'Av Brasil 456'),
('Shopping Luz', 'shopping@email.com', '1155556666', '34.567.890/0001-22', 'Av Paulista 1000');


INSERT INTO materiais (tipo, cor, espessura, altura, largura, preco_m2) VALUES
('Acrilico', 'Transparente', '3mm', 2.00, 1.00, 380.00),
('Acrilico', 'Preto', '5mm', 2.00, 1.00, 580.00),
('Acrilico', 'Branco', '3mm', 2.00, 1.00, 420.00),
('Policarbonato', 'Transparente', '4mm', 3.00, 2.00, 180.00);

INSERT INTO pedidos (colaborador_id, cliente_id, descricao, valor, data_entrada, data_entrega, status_pedido) VALUES
(2, 1, 'Chapas para prateleira', 600.00, '2026-03-10', '2026-03-15', 'EM_PRODUCAO'),
(2, 2, 'Placas de Entrada', 450.00, '2026-03-11', '2026-03-18', 'PENDENTE'),
(12, 3, 'Placas de Saida', 400.00, '2026-03-11', '2026-03-18', 'PENDENTE');

INSERT INTO pedido_materiais (pedido_id, material_id, quantidade) VALUES

-- Pedido 3
(3, 1, 2),
(3, 2, 1),

-- Pedido 4
(4, 3, 3),

-- Pedido 5
(5, 1, 1),
(5, 4, 2);
