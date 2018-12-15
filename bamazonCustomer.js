// requiring all dependencies used in this application
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");
// declaring connection variable and storing mysql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_DB"
});
// declaring divider variable to use for console display
var divider = ("\n---------------------------------------------\n\n")
// connecting to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log(`${divider}Welcome to bamazon, the leading command line retailer.\n\n`)
  console.log(`The items listed below are on sale now!${divider}`);
  displayAvailableInventory()
});
// displaying product list and asking if customer wishes to start shopping
function displayAvailableInventory() {
  connection.query("SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0", function (err, results) {
    if (err) throw err;
    console.table(results);
    inquirer.prompt([{
      name: "shop",
      type: "confirm",
      message: "Would you like to start shopping"
    }]).then(function (answer) {
      if (answer.shop) {
        getCustomerOrder(results);
      } else {
        console.log(`${divider}Thank you for visiting bamazon. Please come back soon!${divider}`)
        connection.end();
      }
    })
  })
};
// getting customer order, checking availability & displaying price
function getCustomerOrder(results) {
  inquirer.prompt([{
    name: "order",
    type: "input",
    message: "What is the id of the product you wish to purchase?",
    validate: function (value) {
      return !isNaN(value);
    }
  }]).then(function (answer) {
    var customerOrder = JSON.parse(answer.order);
    // checking against database to determine if product exists
    var correct = false;
    for (var i = 0; i < results.length; i++) {
      if (customerOrder === results[i].item_id) {
        correct = true;
        inquirer.prompt([{
          name: "quantity",
          type: "input",
          message: "What quantity of this item would you like to purchase?",
          validate: function (value) {
            return !isNaN(value);
          }
        }]).then(function (answer) {
          var orderQuantity = JSON.parse(answer.quantity);
          connection.query(`SELECT * FROM products WHERE item_id = ${customerOrder}`, function (err, results) {
            if (err) throw err;
            var orderInfo = `${orderQuantity} of item ${results[0].item_id}: ${results[0].product_name}`;
            console.log(`${divider}You ordered ${orderInfo}`);
            // checking against database to determine enough inventory to fulfill current order
            var remainingStock = results[0].stock_quantity - orderQuantity;
            if (remainingStock >= 0) {
              var orderPrice = (orderQuantity * results[0].price).toFixed(2);
              var productSales = results[0].product_sales + parseFloat(orderPrice);
              console.log(`Your order total is $${orderPrice}${divider}`);
              inquirer.prompt([{
                name: "checkout",
                type: "list",
                choices: ["Proceed to Checkout", "Cancel Order"],
                message: "Would you like to complete your order with us?"
              }]).then(function (answer) {
                if (answer.checkout === "Proceed to Checkout") {
                  updateProductInventory(remainingStock, customerOrder);
                  updateProductSales(productSales, customerOrder);
                  console.log(`${divider}Thank you for shopping at bamazon!`);
                  connection.end();
                } else if (answer.checkout === "Cancel Order") {
                  console.log(`${divider}We have saved this order in your cart. Please come back to bamazon when you are ready to complete your purchase${divider}`)
                  connection.end();
                }
              })
            } else {
              console.log(`${divider}We have insufficient stock to process your order at this time.${divider}`)
              continueOrQuit(results);
            }
          })
        })
      } //if the product does not exist prompting the user to either try again or quit
      if ((i + 1) === results.length && correct === false) {
        console.log(`${divider}Invalid product selection.${divider}`)
        continueOrQuit(results);
      }
    }
  })
}
// function to update inventory levels in the db when customer checks out
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
    function (err, result) {
      if (err) throw err;
      console.log(`Your order is complete!${divider}`);
    }
  );
}
// function to update product sales in the db when customer checks out
function updateProductSales(productSales, customerOrder) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        product_sales: productSales
      },
      {
        item_id: customerOrder
      }
    ],
    function (err, result) {
      if (err) throw err;
      console.log(`We have received your payment!${divider}`);
    }
  );
}
// function asking customer if they want to checkout or cancel
function continueOrQuit(results) {
  inquirer.prompt([{
    name: "continue",
    type: "list",
    choices: ["Find Something Else", "Quit Shopping"],
    message: "What would you like to do?"
  }]).then(function (answer) {
    if (answer.continue === "Find Something Else") {
      getCustomerOrder(results);
    } else {
      console.log(`${divider}Goodbye. Please check back again soon.${divider}`);
      connection.end();
    }
  })
}