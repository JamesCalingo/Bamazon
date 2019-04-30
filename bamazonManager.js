require("dotenv").config();
const inquirer = require("inquirer")
const mysql = require("mysql")

  


const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.password,
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
      if (err) throw err;
      console.log("\n")
      inquirer
        .prompt({
          type: "list",
          name: "actions",
          message: "Welcome to Bamazon Manager Services!\n What would you like to do today?",
          choices: ["View Products", "Add New Product", "View Low Inventory", "Add Inventory", "Quit Bamazon Manager"]
        }).then(function (answer) {
            switch (answer.actions) {
              case "View Products":
                productView()
                break;

              case "Add New Product":
                addProduct()
                break;

              case "View Low Inventory":
                checkInv()
                break;

              case "Add Inventory":
                addInv()
                break;

              case "Quit Bamazon Manager":
                console.log("Have a good day!");
                connection.end()
                break;
            }

            function productView() {
              console.log("Here's what we have right now:")
              connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;

                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  var obj = {};
                  obj["id"] = (results[i].id);
                  obj["name"] = (results[i].productName);
                  obj["price"] = (results[i].price);
                  obj["department"] = (results[i].department);
                  obj["stock"] = results[i].stockQuantity

                  choiceArray.push(obj)
                  console.log(`\nID: ${choiceArray[i].id}\nPRODUCT: ${choiceArray[i].name}\nDEPARTMENT: ${choiceArray[i].department}\nCURRENT STOCK: ${choiceArray[i].stock}`)
                };
              });
              connection.end()
            }

            function addProduct() {
              inquirer.prompt([{
                  type: "input",
                  name: "newProduct",
                  message: "What would you like to add?",
                  validate: function (value) {
                    if (value) {
                      return true;
                    }
                    console.log("\nPlease input SOMETHING. No one is going to buy 'null', y'know!")
                    return false;
                  }
                },
                {
                  type: "input",
                  name: "newCategory",
                  message: "What department would you like to add this product under?",
                  validate: function (value) {
                    if (value) {
                      return true;
                    }
                    console.log("\nPlease input SOMETHING. No one is going to buy 'null', y'know!")
                    return false;
                  }
                },

                {
                  type: "input",
                  name: "newQuantity",
                  message: "How many of this product are you adding?",
                  validate: function (value) {
                    if (isNaN(value) === false && value) {
                      return true;
                    }
                    console.log("\nYou either did not put a quantity at all or you put something that's not a number. Please put in a number.")
                    return false;
                  }
                },

                {
                  type: "input",
                  name: "newPrice",
                  message: "What is the price of this new item?",
                  validate: function (value) {
                    if (isNaN(value) === false && value) {
                      return true;
                    }
                    console.log("\nYou either did not put a quantity at all or you put something that's not a number. Please put in a number.")
                    return false;
                  }
                }
              ]).then(function (answers) {
                connection.query(
                    "INSERT INTO products SET ?", {
                      productName: answers.newProduct,
                      department: answers.newCategory,
                      price: answers.newPrice,
                      stockQuantity: answers.newQuantity || 0
                    }
                  ),
                  function (err) {
                    if (err) throw err
                  }
                console.log("Your item was successfully added to the store. Have a good day!")
                connection.end()
              })
            }

            function checkInv() {
              console.log("Here are all of the items which we have less than ten of. Might be time to order some more soon!")
              connection.query("SELECT * FROM products WHERE stockQuantity <= 10", function (err, results) {
                if (err) reject(err);

                var lowQuant = [];
                for (var i = 0; i < results.length; i++) {
                  lowQuant.push(results[i].productName);
                  console.log(lowQuant[i])
                }
              })
              connection.end()
            }

            async function addInv() {
                function chooseProduct(type) {
                  return new Promise((resolve, reject) => {
                    connection.query("SELECT * FROM products", function (err, results) {
                      if (err) reject(err);

                      // if successful, send to .then
                      if (type === "product name") {
                         resolve(results.map(product => product.productName));
                      }
                      else {
                        resolve(results);
                      }
                    })
                  })
                };
                inquirer.prompt(
                    [
                      {
                        type: "list",
                        name: "addProductChoice",
                        message: "Which product would you like to add inventory for?",
                        choices: await chooseProduct("product name")
                      },
                      {
                        type: "input",
                        name: "addProductQuantity",
                        message: "And how many of those are you adding?",
                        validate: function (value) {
                          if (isNaN(value) === false && value) {
                            return true;
                          }
                          console.log("\nYou either did not put a quantity at all or you put something that's not a number. Please put in a number.")
                          return false;
                        }
                      }
                    ])
                    .then(async function (answers) {
                      var chosenItem;
                      connection.query("SELECT * FROM products")
                      const results = await chooseProduct();
                      for (var i = 0; i < results.length; i++) {
                        if (results[i].productName === answers.addProductChoice) {
                          chosenItem = results[i];
                        }
                      }
                      var newQuant = parseInt(answers.addProductQuantity) + chosenItem.stockQuantity;
                      connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stockQuantity: newQuant
                          },
                          {
                            id: chosenItem.id
                          }
                        ],

                        function (err) {
                          if (err) throw err;

                          console.log("Stock updated. Hope you added enough to meet demand!")
                          connection.end()
                        }
                      )
                    })
            }
        
          })
        })