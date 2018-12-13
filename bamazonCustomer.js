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
  console.log("\nWelcome to bamazon, the leading bash terminal retailer.\nThe items listed below are on sale now!\n");
  displayInventory();
});

function displayInventory() {
  connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0", function (err, results) {
    if (err) throw err;
    console.table(results);
    getCustomerOrder();
  })
};

function getCustomerOrder() {
  inquirer.prompt([{
    name: "shop",
    type: "confirm",
    message: "Would you like to start shopping"
  }]).then(function (answer) {
    if (answer.shop) {
      inquirer.prompt([{
        name: "order",
        type: "input",
        message: "What is the item_id of the product you wish to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "What quantity of this item would you like to purchase?"
      }]).then(function (answer){
        console.log(answer);
      })
    } else {
      console.log("Thank you for visiting bamazon. Please come back soon!")
      connection.end();
    }
  })
}
