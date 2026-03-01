-- ============================================================
-- Sistema de Controle de Estoque de Insumos
-- Script de criação das tabelas - PostgreSQL
-- ============================================================

CREATE TABLE products (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    value      NUMERIC(15,2) NOT NULL CHECK (value >= 0),
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE raw_materials (
    id             BIGSERIAL     PRIMARY KEY,
    name           VARCHAR(200)  NOT NULL,
    stock_quantity NUMERIC(15,3) NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE product_raw_materials (
    product_id        BIGINT        NOT NULL REFERENCES products(id)      ON DELETE CASCADE,
    raw_material_id   BIGINT        NOT NULL REFERENCES raw_materials(id) ON DELETE RESTRICT,
    required_quantity NUMERIC(15,3) NOT NULL CHECK (required_quantity > 0),
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (product_id, raw_material_id)
);

-- Índices auxiliares
CREATE INDEX idx_product_raw_materials_raw_material ON product_raw_materials(raw_material_id);
