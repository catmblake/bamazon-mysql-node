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
                //   code
                break;
            case "Add to Inventory":
                //   code
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
        inquirer.prompt([{
            name: "newTask",
            type: "confirm",
            message: "Would you like to perform another task?"
        }]).then(function (answer) {
            if (answer.newTask) {
                beginTasks();
            } else {
                connection.end();
            }
        })
    })
}
