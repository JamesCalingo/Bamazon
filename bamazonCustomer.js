require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.password,
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  showProducts();
});

function showProducts(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    function storeFront() {
      var choiceArray = [];
      for (var i = 0; i < results.length; i++) {
        var obj = {};
        obj["name"] = (results[i].productName);
        obj["price"] = (results[i].price)
        choiceArray.push(obj)
        console.log(`${choiceArray[i].name} for $${choiceArray[i].price}`)
      }
     
      ;
    }
  
    console.log("\nHi! Welcome to Bamazon - where you can find anything you want without the guilt of supporting greedy corporate overlords! Well...that's what we'd like to say, but unfortunately due to some...issues, this is all we have in stock right now:\n")
    storeFront()
    console.log("\n")
inquirer.prompt([
  {
    type: "list",
    name: "productList",
    message: "What would you like to purchase?",
    choices: function() {
      var productArray = [];
      for (var i = 0; i < results.length; i++) {
        productArray.push(results[i].productName);
      }
      return productArray;
    }
  },
  {type: "input",
name: "quantityRequest",
message: "And how many of those would you like today?",
validate: function(value) {
  if (isNaN(value) === false && value) {
    return true;
  }
  console.log("\nYou either did not put a quantity at all or you put something that's not a number. Please put in a number.")
  return false;
}
}
])
.then(function(answers){
  var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].productName === answers.productList) {
            chosenItem = results[i];
          }
        }
if(parseInt(answers.quantityRequest) > chosenItem.stockQuantity){
  console.log("We don't have enough of those to fill your order. Sorry...")
  connection.end()
}
else{
  var cost = (parseInt(answers.quantityRequest) * chosenItem.price).toFixed(2);
  var newQuantity = chosenItem.stockQuantity -= answers.quantityRequest
  console.log("\nYour total comes out to be $" + cost + "\nHave a good day!\n")
  connection.query(
  "UPDATE products SET ? WHERE ?",
  [
    {
      stockQuantity: newQuantity
    },
    {
      id: chosenItem.id
    }
  ],
  function(error) {
    if (error) throw error;

    connection.end()
  }
  ) 
}
})
})
}
