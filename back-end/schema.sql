CREATE DATABASE dindin;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(70) UNIQUE NOT NULL,
    password TEXT NOT NULL
);


DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    description TEXT
);


DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    description TEXT,
    value DECIMAL NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    category_id INT REFERENCES categories(id),
    user_id INT REFERENCES users(id),
    type TEXT
);

INSERT INTO categories(description)
VALUES
('Comida'),
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
('Outro rendimento'),
('Outras despesas');
