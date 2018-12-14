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
    console.log("Supervisor Dashboard");
})

inquirer.prompt([{
    name: "task",
    type: "list",
    choices: ["View Products Sales by Department", "Add New Department"],
    message: "What would you like to do?"
}]).then(function (answer) {
    switch (answer.task) {
        case "View Products Sales by Department":
            displayProductSales();
            break;
        case "Add New Department":
            createDepartment();
            break;
    }
})
function displayProductSales() {
    // code this out
}
function createDepartment() {
    // code this out
}