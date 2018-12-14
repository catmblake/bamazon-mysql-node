var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_DB"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Manager Dashboard");
    beginTasks();
})

function beginTasks() {
    inquirer.prompt([{
        name: "task",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        message: "What would you like to do?"
    }]).then(function (answer) {
        switch (answer.task) {
            case "View Products for Sale":
                displayProductsForSale();
                break;
            case "View Low Inventory":
                displayLowInventory();
                break;
            case "Add to Inventory":
                replenishInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
        }
    })
}

function displayProductsForSale() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        console.table(response);
        performNewTask();
    })
}

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, response) {
        if (err) throw err;
        console.table(response);
        performNewTask();
    })
}

function replenishInventory() {
    inquirer.prompt([{
        name: "updateItem",
        type: "input",
        message: "What is the id of the product you wish to update",
        validate: function (value) {
            return !isNaN(value);
        }
    }]).then(function (answer) {
        var correct = false;
        var updateItem = JSON.parse(answer.updateItem);
        connection.query("SELECT item_id FROM products", function (err, results) {
            for (var i = 0; i < results.length; i++) {
                if (updateItem === results[i].item_id) {
                    correct = true;
                    inquirer.prompt([{
                        name: "addStock",
                        type: "input",
                        message: "How many units of stock are you adding to this item?",
                        validate: function (value) {
                            return !isNaN(value);
                        }
                    }]).then(function (answer) {
                        var addStock = JSON.parse(answer.addStock);
                        connection.query(`SELECT stock_quantity FROM products WHERE item_id = ${updateItem}`, function (err, res) {
                            if (err) throw err;
                            var currentQuantity = res[0].stock_quantity;
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: (currentQuantity + addStock)
                                    },
                                    {
                                        item_id: updateItem
                                    }
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                    console.log("Product inventory has been updated!");
                                    performNewTask();
                                }
                            );
                        })
                    })
                } 
                if ((i+1) === results.length && correct === false) {
                    console.log("Invalid product selection.");
                    performNewTask();
                }
            }
        })
    })
}

function addNewProduct() {
    inquirer.prompt([{
        name: "productName",
        type: "input",
        message: "What is the product Name?"
    },
    {
        name: "productDept",
        type: "input",
        message: "What department does the product belong to?"
    },
    {
        name: "salePrice",
        type: "input",
        message: "What is the retail price for this product?",
        validate: function (value) {
            return !isNaN(value);
        }
    },
    {
        name: "initialQuantity",
        type: "input",
        message: "How many stock units of this product are you adding?",
        validate: function (value) {
            return !isNaN(value);
        }
    }]).then(function (answer) {
        console.log(answer);
        var productName = (answer.productName).toLowerCase();
        var productDept = (answer.productDept).toLowerCase();
        var salePrice = (answer.salePrice).toFixed(2);
        var initialQuantity = answer.initialQuantity;
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [productName, productDept, salePrice, initialQuantity], function (err, res) {
            if (err) throw err;
            console.log("Your product has been added.");
            performNewTask();
        })
    })
}
function performNewTask() {
    inquirer.prompt([{
        name: "newTask",
        type: "confirm",
        message: "Would you like to perform another task?"
    }]).then(function (answer) {
        if (answer.newTask) {
            beginTasks();
        } else {
            console.log("Exiting Manager Dashboard");
            connection.end();
        }
    })
}