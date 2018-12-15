// requiring dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");
// creating connection variable with db object
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
    SupervisorFunctions();
});
// function that asks the user what task they would like to perform
function SupervisorFunctions() {
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
        };
    })
};
// function that displays product sales by department using an alias and inner join between two db tables
function displayProductSales() {
    var aliasTableQuery = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, COALESCE(SUM(products.product_sales), 0) AS product_sales, COALESCE(SUM(products.product_sales), 0) - departments.over_head_costs AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id ORDER BY departments.department_id"
    connection.query(aliasTableQuery, function (err, res) {
        if (err) throw err;
        console.table(res);
        askForFunction();
    })
};
// function that prompts user to create a new department in the database
function createDepartment() {
    inquirer.prompt([{
        name: "deptName",
        type: "input",
        message: "What is the name of the new department?"
    }]).then(function (answer) {
        var exists = false;
        var newDept = (answer.deptName).toLowerCase();
        connection.query("SELECT department_name FROM departments", function (err, results) {
            // checking if the department already exists in the database
            for (var i = 0; i < results.length; i++) {
                if (newDept === results[i].department_name) {
                    exists = true;
                    console.log("This department already exists in our database");
                    askForFunction();
                } // once we determine the department doesn't already exist we allow the user to proceed
                if ((i + 1) === results.length && exists === false) {
                    inquirer.prompt([{
                        name: "overhead",
                        type: "input",
                        message: "What is the fixed overhead of the new department?",
                        validate: function (value) {
                            return !isNaN(value);
                        }
                    }]).then(function (answer) {
                        var deptOverhead = JSON.parse(answer.overhead).toFixed(2);
                        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", [newDept, deptOverhead], function (err, res) {
                            if (err) throw err;
                            console.log(`The ${newDept} department has been added to the bamazon database`);
                            askForFunction();
                        })
                    })
                }
            }
        })
    })
};
// function that asks the user if they would like to perform another function or quit
function askForFunction() {
    inquirer.prompt([{
        name: "newFunction",
        type: "confirm",
        message: "Would you like to perform another function?"
    }]).then(function (answer) {
        if (answer.newFunction) {
            SupervisorFunctions();
        } else {
            console.log("Exiting Supervisor Dashboard");
            connection.end();
        }
    })
};