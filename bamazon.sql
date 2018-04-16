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
DROP TABLE departments;
CREATE TABLE departments(
department_id INT(10) NOT NULL AUTO_INCREMENT,
department_name VARCHAR(100) NOT NULL,
over_head_costs FLOAT,
PRIMARY KEY(department_id)
);
INSERT INTO departments(department_name,over_head_costs)VALUES('Video Games',3000);
INSERT INTO departments(department_name,over_head_costs)VALUES('Home Supplies',4000.35);
INSERT INTO departments(department_name,over_head_costs)VALUES('Apparel',5000.75);
INSERT INTO departments(department_name,over_head_costs)VALUES('Board games',10000);
INSERT INTO departments(department_name,over_head_costs)VALUES('Films',20000);
DELETE FROM departments WHERE department_id = 4;
SELECT * FROM departments;
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
UPDATE products SET stock_quantity = 0 WHERE department_name="Films";
UPDATE products SET stock_quantity = 4 WHERE item_id=7;
ALTER TABLE products DROP product_sales;
ALTER TABLE products ADD product_sales FLOAT;
SELECT * FROM products;
DELETE FROM products where item_id=17;
-- join products and departments
SELECT departments.department_id,departments.department_name,departments.over_head_costs,products.product_sales,(departments.over_head_costs - products.product_sales)AS total_profit
FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name DESC;

-- GROUP BY departments.department_name