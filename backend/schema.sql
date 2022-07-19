CREATE DATABASE dindin;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY,
  	nome VARCHAR(50) NOT NULL,
  	email VARCHAR(70) UNIQUE NOT NULL,
  	senha TEXT NOT NULL
);


DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias(
	id SERIAL PRIMARY KEY,
  	descricao TEXT
);


DROP TABLE IF EXISTS transacoes;

CREATE TABLE transacoes(
	id SERIAL PRIMARY KEY,
  	descricao TEXT,
  	valor INT NOT NULL,
  	data TIMESTAMP NOT NULL,
  	categoria_id INT REFERENCES categorias(id),
  	usuario_id INT REFERENCES usuarios(id),
  	tipo TEXT
);

INSERT INTO categorias(descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');