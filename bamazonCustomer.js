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
  connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
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
      connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
        if (err) throw err;
      connection.query(`SELECT * FROM products WHERE item_id = ${userOrder}`, function (err, results){
        if (err) throw err; 
        console.log(results);
        console.log(results[0].stock_quantity);
        var remainder = results[0].stock_quantity - userOrderQuantity;
        console.log(remainder);
        if (remainder >= 0) {
          console.log(results[0].price);
          var orderTotal = userOrderQuantity*results[0].price;
          console.log(`Your order total is ${orderTotal}`)
        }
      })
      })
    });
  });
}
