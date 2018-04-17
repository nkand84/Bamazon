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
                "Add New Product",
                "Exit"
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

            case "Exit":
                exitApp();
                break;

        }

    });
}

function readAvailableProducts() {
    console.log("Available products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(color.green(table));
        listOptions();
    });
}

// Low Inventory should list all items with an inventory count lower than five
function showLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        listOptions();
    });
}

// Add to Inventory
function addToInventory() {
    // display a prompt that will let the manager "add more" of any item currently in the store.
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the product id",
            name: "addItem"
        },
        {
            type: "input",
            message: "Enter the stock quantity of the product",
            name: "addStock"
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE item_id='" + answer.addItem + "'", function (err, res) {
            if (res.length > 0) {
                var updatedStockQty = parseFloat(res[0].stock_quantity) + parseFloat(answer.addStock);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedStockQty
                        },
                        {
                            item_id: answer.addItem
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("===========================================================================");
                        console.log("Succesfully Updated product of id " + answer.addItem + " with a stock quantity " + answer.addStock);
                        console.log("===========================================================================");
                        // display updated list
                        readAvailableProducts();
                    });
            }
        });
    });
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Product name",
            name: "addItemName"
        },
        {
            type: "input",
            message: "Enter the Department Name",
            name: "addDept"
        },
        {
            type: "input",
            message: "Enter the price",
            name: "addPrice"
        },
        {
            type: "input",
            message: "Enter the stock quantity",
            name: "addStock"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.addItemName,
            department_name: answer.addDept,
            price: answer.addPrice,
            stock_quantity: answer.addStock
        }, function (err, res) {
            console.log("=============================================");
            console.log(" Succesfully added "+ answer.addItemName + " for a price of " + answer.addPrice + " and stocked "+ answer.addStock +" number of units");
            console.log("=============================================");
            // display the table again
            readAvailableProducts();
        });

    });
}

// Exit App
function exitApp(){
    connection.end();
    
}