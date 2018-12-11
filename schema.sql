DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("dog food", "pets", 24.99, 95);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("dog treats", "pets", 14.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("shampoo", "health and beauty", 6.95, 200);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("conditioner", "health and beauty", 7.95, 150);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("t-shirt", "apparel", 9.95, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("sweater", "apparel", 15.95, 500);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("table cloth", "homeware", 12.75, 25);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("curtains", "homeware", 27.95, 40);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("kettlebell weights", "sports equipment", 49.50, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("yoga mat", "sports equipment", 18.95, 30);

SELECT * FROM products;