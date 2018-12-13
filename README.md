# bamazon-mysql-node
### Overview
This 'bamazon' application is an Amazon-like storefront that runs in the command line. There are three levels in this application which the user can choose:
1. **Customer Level**: By running the bamazonCustomer.js the user can shop at the bamazon store. They can view all items that are currently on sale and choose which product they would like to purchase, in what quantity. If the item is in stock the user's order is processed and they are shown the total price of their purchase. The stock levels are then updated in the mysql database to reflect this transaction. If there is not enough inventory to fulfill the user's order, they are notified that bamazon cannot fulfill this order and given the option to choose something else or quit shopping.
2. **Manager Level**: By running the bamazonManager.js the user can act as a manager of the store. Here they can perform a variety of tasks including:
* View all current products for sale.
* View all low inventory items.
* Update current products inventory levels.
* Add new products to the store.
3. **Supervisor Level**:
