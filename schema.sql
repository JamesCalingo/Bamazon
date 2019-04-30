DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(200) NOT NULL,
  department VARCHAR(100),
  price DECIMAL (10, 2) NOT NULL,
  stockQuantity INT(10)
);

INSERT INTO products (productName, department, price, stockQuantity)
VALUES
("Atari Jaguar", "Electronics", 99.99, 75),
("Blank t-shirt", "Clothing", 10.00, 10000),
("Cat Catan", "Toys and Games", 49.99, 3000),
("Official Super Smash Bros. Beastball", "Sports", 19.99, 2500),
("Laundry Basket", "Misc", 23.00, 2500),
("I Am America (And So Can You!)", "Books", 19.99, 500),
("Potato Salad", "Food", 5.99, 250000)
("A Sports Team", "Sports", 5000000.00, 3);