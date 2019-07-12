# Bamazon
Bamazon - a node application that uses a MySQL database to simulate making transactions on online stores like Amazon
Video demo: https://youtu.be/lFj998ibiv0

# How it works
Bamazon has two "views", so to speak: One for customers, and one for employees/managers. To access the customer view:<br/>
````
$ node bamazonCustomer.js
````
This leads to a listing of products, which prompts the user to select a product and quantity to buy
````
$ node bamazonManager.js
````
This is the manager view, which lets the user add products or stock as well as view the current inventory of products and which ones have low inventory.

# Technology Used

Node.js
MySQL
Inquirer
