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
const cTable = require('console.table');

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
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                readAvailableProducts();
                break;

            case "View Low Inventory":
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
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// available product means stock value greater than 0!!
function readAvailableProducts() {
    console.log("Displaying available products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity > 0",function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        // connection.end();
        listOptions();
    });
}

// it should list all items with an inventory count lower than five
function showLowInventory() {
    // if stock qty less than five then show low inventory
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        listOptions();
        // connection.end();
    });
}

