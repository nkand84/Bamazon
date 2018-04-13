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

INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('God of War','Video Games',29.95,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Uncharted','Video Games',29.95,30);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Dish Soap','Home Supplies',2.95,100);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Kitchen Paper Towels','Home Supplies',10.95,120);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Monopoly','Board Games',19.95,35);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Chess','Board Games',14.95,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Sequence','Board Games',9.95,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Titanic','Films',15,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Despicable Me','Films',14.99,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Ray Ban Sunglasses','Apparel',102.95,40);
INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('Worn Denim Jeans','Apparel',55.25,40);
UPDATE products SET stock_quantity = 55 WHERE department_name="Films";
UPDATE products SET stock_quantity = 45 WHERE item_id=1;
SELECT * FROM products;