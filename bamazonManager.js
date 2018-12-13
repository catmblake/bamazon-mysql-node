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
                //   code
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
        message: "What is the id of the product you wish to update"
    },
    {
        name: "addStock",
        type: "input",
        message: "How many units of stock are you adding to this item?"
    }]).then(function (answer) {
        var updateItem = JSON.parse(answer.updateItem);
        var addStock = JSON.parse(answer.addStock);
        connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: addStock
            },
            {
                item_id: updateItem
            }
        ],
            function (err, res) {
                if (err) throw err;
                console.log("Product inventory has been updated!");
                performNewTask ();
            }
        );
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
            console.log("Exiting Manager Dashboard")
            connection.end();
        }
    })
}