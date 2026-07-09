O MecanicaPro é um aplicativo mobile criado para gestão de oficinas mecânicas, registrando e administrando ordens de serviço, clientes, mecânicos e veículos.

-- QUERYS PARA CONFIGURAÇÃO DO BANCO DE DADOS:

-- Ativa a extensão para geração de UUIDs automáticos (caso use PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criação da tabela de Usuários (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT
);

-- 2. Criação da tabela de Clientes (clients)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    document TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    status TEXT
);

-- 3. Criação da tabela de Mecânicos (mechanics)
CREATE TABLE mechanics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    specialty TEXT,
    phone TEXT,
    availability TEXT
);

-- 4. Criação da tabela de Veículos (vehicles)
-- Depende da tabela 'clients' devido à chave estrangeira client_id
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    plate TEXT NOT NULL UNIQUE,
    brand TEXT,
    model TEXT,
    year TEXT,
    color TEXT,
    type TEXT,
    mileage TEXT,
    CONSTRAINT fk_vehicle_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 5. Criação da tabela de Ordens de Serviço (service_orders)
-- Depende das tabelas 'vehicles' e 'mechanics' devido às chaves estrangeiras
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    vehicle_id UUID NOT NULL,
    mechanic_id UUID,
    services TEXT,
    estimated_value NUMERIC(10, 2),
    notes TEXT,
    status TEXT,
    entry_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_so_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_so_mechanic FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE SET NULL
);

--6. Insert do Usuário Administrador de testes da demo
INSERT INTO users (name, email, password, phone) 
VALUES ('Admin Oficina', 'admin@mecanicapro.com', 'e10adc3949ba59abbe56e057f20f883e', '(11) 99999-0000');

