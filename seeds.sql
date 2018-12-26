-- Populating initial product inventory
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
-- populating initial departments
INSERT INTO departments (department_name, over_head_costs) VALUES ("pets", 1020.88);
INSERT INTO departments (department_name, over_head_costs) VALUES ("kids", 4630.75);
INSERT INTO departments (department_name, over_head_costs) VALUES ("apparel", 2348.89);
INSERT INTO departments (department_name, over_head_costs) VALUES ("homeware", 2376.93);
INSERT INTO departments (department_name, over_head_costs) VALUES ("health and beauty", 3476.43);
INSERT INTO departments (department_name, over_head_costs) VALUES ("sports equipment", 4533.73);
-- Query to generate sales by department table
SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
COALESCE(SUM(products.product_sales), 0) AS product_sales, 
COALESCE(SUM(products.product_sales), 0) - departments.over_head_costs AS total_profit 
FROM departments 
LEFT JOIN products ON departments.department_name = products.department_name 
GROUP BY departments.department_id
ORDER BY departments.department_id;