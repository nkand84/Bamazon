CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products(
    -- item_id (unique id for each product)
    item_id INTEGER(10)NOT NULL AUTO_INCREMENT,
    -- product_name (Name of product)
    product_name VARCHAR(100),
    -- department_name
    department_name VARCHAR(100),
    -- price (cost to customer)
    price FLOAT,
    -- stock_quantity (how much of the product is available in stores)
    stock_quantity INTEGER(10),
    PRIMARY KEY(item_id)
);