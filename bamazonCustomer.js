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
  getCustomerOrder();
});

function getCustomerOrder() {
  connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0", function (err, results) {
    if (err) throw err;
    console.table(results);
    inquirer.prompt([{
      name: "shop",
      type: "confirm",
      message: "Would you like to start shopping"
    }]).then(function (answer) {
      if (answer.shop) {
        inquirer.prompt([{
          name: "order",
          type: "input",
          message: "What is the id of the product you wish to purchase?"
        },
        {
          name: "quantity",
          type: "input",
          message: "What quantity of this item would you like to purchase?"
        }]).then(function (answer) {
          for (var i = 0; i < results.length; i++) {
            var customerOrder = JSON.parse(answer.order);
            var orderQuantity = JSON.parse(answer.quantity);
            if (customerOrder === results[i].item_id) {
              var orderInfo = `${orderQuantity} of item ${results[i].item_id}: ${results[i].product_name}`;
              console.log(`You ordered ${orderInfo}`);
            }
          }
          connection.query(`SELECT price, stock_quantity FROM products WHERE item_id = ${customerOrder}`, function (err, results) {
            if (err) throw err;
            var remainingStock = results[0].stock_quantity - orderQuantity;
            if (remainingStock >= 0) {
              var orderPrice = (orderQuantity * results[0].price).toFixed(2);
              console.log(`Your order total is $${orderPrice}`);
              inquirer.prompt([{
                name: "checkout",
                type: "list",
                choices: ["Proceed to Checkout", "Cancel Order"],
                message: "Would you like to complete your order with us?"
              }]).then (function(answer){
                if (answer.checkout === "Proceed to Checkout") {
                  updateProductInventory(remainingStock, customerOrder);
                  console.log("Thank you for shopping at bamazon!");
                  connection.end();
                } else if (answer.checkout === "Cancel Order") {
                  console.log("We have saved this order in your cart. Please come back to bamazon when you are ready to complete your purchase")
                  connection.end();
                }
              })
            } else {
              console.log("We have insufficient stock to process your order at this time.")
              inquirer.prompt([{
                name: "continue",
                type: "list",
                choices: ["Find Something Else", "Quit Shopping"],
                message: "What would you like to do?"
              }]).then(function(answer){
                if (answer.continue === "Find Something Else"){
                  getCustomerOrder();
                } else {
                  console.log("Goodbye. Please check back again soon.");
                  connection.end();
                }
              })
            }
          })
        })
      } else {
        console.log("Thank you for visiting bamazon. Please come back soon!")
        connection.end();
      }
    })
  })
};

function updateProductInventory(remainingStock, customerOrder) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: remainingStock
      },
      {
        item_id: customerOrder
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log("Your order is complete!");
    }
  );
}