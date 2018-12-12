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
  displayInventory();
});

function displayInventory() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.table(results);
    inquirer.prompt([{
      name: "orderItem",
      type: "input",
      message: "What is the item_id of the product you wish to purchase?"
    },
    {
      name: "orderQuantity",
      type: "input",
      message: "What quantity of this item would you like to purchase?"
    }
    ]).then(function (inquirerResponse) {

      for (var i = 0; i < results.length; i++) {
        var userOrder = JSON.parse(inquirerResponse.orderItem);
        var userOrderQuantity = JSON.parse(inquirerResponse.orderQuantity);
        if (userOrder === results[i].item_id) {
          console.log(`You ordered ${userOrderQuantity} of item no.${results[i].item_id} - ${results[i].product_name}`);
        }

      }
    });
  });
}
