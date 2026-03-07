INSERT INTO roles (nome, nivel_acesso) VALUES ('Admin',3);
INSERT INTO roles (nome, nivel_acesso) VALUES ('Gerente',2);
INSERT INTO roles (nome, nivel_acesso) VALUES ('Vendedor',1);


INSERT INTO colaboradores
(nome,email,senha,telefone,role_id)
VALUES
('Lucas','lucas@email.com','123456','11999999999',1);

INSERT INTO clientes
(nome,email,cpf_cnpj,endereco,telefone)
VALUES
('Marcinho ZIKA','marcinho@email.com','50050050055','Rua Sinistro 666','11999999999');

INSERT INTO materiais
(tipo,cor,espessura,preco_m2)
VALUES
('Acrilico','Cristal','3mm',380.00);

INSERT INTO pedidos
(colaborador_id,cliente_id,material_id,descricao,quantidade,valor,data_entrada,data_entrega,status_pedido)
VALUES
(1,1,1,'Placa acrilica fachada',2,300.00,'2026-03-06','2026-03-15','Em Produção');

INSERT INTO pagamentos
(pedido_id,forma_pagamento,status_pagamento,valor_pago,data_pagamento)
VALUES
(1,'PIX','PAGO',300.00,'2026-03-06')