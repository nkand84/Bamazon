// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

// npm packages
var inquirer = require('inquirer');
var mysql = require('mysql');
var { table } = require('table');
var color = require('bash-color');

let data, output;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    listOptions();

});

function listOptions() {
    inquirer.prompt([
        {
            /* Pass questions in here */
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
              "View Products for Sale",
              "View Low Inventory",
              "Add to Inventory",
              "Add New Product"
            ]
                    
        }
    ]).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
              readProducts();
              break;
      
            case  "View Low Inventory":
              showLowInventory();
              break;
      
            case "Add to Inventory":
              addToInventory();
              break;
      
            case "Add New Product":
              addNewProduct();
              break;
            }

    });
}

function readProducts() {
    console.log("Displaying all products...\n");
    var finalTable = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res);
        var data = ['ProductId', 'ProductName', 'DepartmentName', 'Price($)', 'StockQuantity'];
        finalTable.push(data);
        for (var i = 0; i < res.length; i++) {
            data = [color.white(res[i].item_id), color.white(res[i].product_name), color.white(res[i].department_name), color.white(res[i].price), color.white(res[i].stock_quantity)];
            // console.log(data);
            finalTable.push(data);
        }
        // console.log(finalTable);
        output = table(finalTable);
        console.log(color.green(output));
        connection.end();
        
    });
}

// it should list all items with an inventory count lower than five
function showLowInventory(res) {
// if stock qty less than five then show low inventory

}