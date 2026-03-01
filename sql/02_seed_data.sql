-- ============================================================
-- Dados de exemplo para testes
-- ============================================================

INSERT INTO raw_materials (name, stock_quantity) VALUES
    ('Aço Inox',        100.000),
    ('Alumínio',         80.000),
    ('Borracha',         50.000),
    ('Plástico ABS',    200.000),
    ('Cobre',            30.000);

INSERT INTO products (name, value) VALUES
    ('Produto Alpha',  150.00),
    ('Produto Beta',    80.00),
    ('Produto Gamma',  220.00);

-- Produto Alpha: precisa de 5 Aço Inox + 2 Alumínio
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
    (1, 1, 5.000),
    (1, 2, 2.000);

-- Produto Beta: precisa de 3 Borracha + 10 Plástico ABS
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
    (2, 3, 3.000),
    (2, 4, 10.000);

-- Produto Gamma: precisa de 8 Aço Inox + 5 Cobre
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
    (3, 1, 8.000),
    (3, 5, 5.000);
