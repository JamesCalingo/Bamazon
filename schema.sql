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
