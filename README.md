# bamazon-mysql-node
### Overview
This 'Bamazon' application is an Amazon-like storefront that runs in the command line. There are three levels in this application which the user can choose:
1. **Customer Level**: By running the bamazonCustomer.js the user can shop at the bamazon store. They can view all items that are currently on sale and choose which product they would like to purchase, in what quantity. If the item is in stock the user's order is processed and they are shown the total price of their purchase. The stock levels are then updated in the mysql database to reflect this transaction. If there is not enough inventory to fulfill the user's order, they are notified that bamazon cannot fulfill this order and given the option to choose something else or quit shopping.
2. **Manager Level**: By running the bamazonManager.js the user can act as a manager of the store. Here they can perform a variety of tasks including:
* View all current products for sale
  - This option displays all products currently in Bamazon inventory. 
* View all low inventory items
  - This option displays all products qith stock levels lower than 5 units.
* Update current products inventory levels
  - This option allows the manager to add stock to any item currently in the products table.
* Add new products to the store
  - This option allows the manager to add a new product to an existing department of the Bamazon store.
3. **Supervisor Level**: By running the bamazonSupervisor.js the user can oversee the store's department operations. Here they can add new departments and view all sales by department.
### How Bamazon Works
Bamazon uses MySQL as the database management system where all data is stored. 
The app also uses the following node package managers:
* Inquirer
  - This prompts the user with questions and retreives the users answers to form queries to the Bamazon database
* MySql
  - This package enables the app to communicate with the database.
* Console.table
  - This package allows the app to display information from the database as tables in the command line.

Before using Bamazon you must first install all or the required dependencies listed above. You also need to run the schema script to set up the store database and the seeds script to populate it with departments and inventory.

### Bamazon In Action
This video walks through the features of Bamazon from the perspective of each of it's three users: Customer, Manager and Supervisor - https://drive.google.com/file/d/1_bzjZbdayYPauKTrl8S-ycj8d32ceXeA/view.

![Customer View](https://github.com/catmblake/bamazon-mysql-node/blob/master/images/customerview.png)
![Manager View](https://github.com/catmblake/bamazon-mysql-node/blob/master/images/manager-view.png)
![Supervisor View](https://github.com/catmblake/bamazon-mysql-node/blob/master/images/supervisor-view.png)
