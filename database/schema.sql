CREATE TABLE roles(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(50) NOT NULL,
	nivel_acesso INTEGER NOT NULL
);

CREATE TABLE colaboradores(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	senha VARCHAR(200) NOT NULL,
	telefone VARCHAR(20) NOT NULL,
	role_id INTEGER REFERENCES roles(id)
);

CREATE TABLE clientes(
	id SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100),
	telefone VARCHAR(20),
	cpf_cnpj VARCHAR(30) NOT NULL,
	endereco VARCHAR(100)
);

CREATE TABLE materiais(
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(50),
	cor VARCHAR(50),
	espessura VARCHAR(20),
	preco_m2 NUMERIC(10,2)
);



CREATE TABLE pedidos(
	id SERIAL PRIMARY KEY,
	colaborador_id INTEGER REFERENCES colaboradores(id),
	cliente_id INTEGER REFERENCES clientes(id),
	descricao TEXT,
	valor NUMERIC(10,2),
	data_entrada DATE,
	data_entrega DATE,
	status_pedido VARCHAR(20)
);

CREATE TABLE pedido_materiais(
	id SERIAL PRIMARY KEY,
	pedido_id INTEGER REFERENCES pedidos(id),
	material_id INTEGER REFERENCES materiais(id),
	quantidade INTEGER
);

CREATE TABLE pagamentos(
	id SERIAL PRIMARY KEY,
	pedido_id INTEGER REFERENCES pedidos(id),
	forma_pagamento VARCHAR(20),
	status_pagamento VARCHAR(20),
	valor_pago NUMERIC(10,2),
	data_pagamento DATE
);