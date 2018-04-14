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
    connection.query("SELECT * FROM products WHERE stock_quantity > 0", function (err, res) {
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
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        listOptions();
        // connection.end();
    });
}

// If a manager selects Add to Inventory
function addToInventory() {
    // display a prompt that will let the manager "add more" of any item currently in the store.
    var managerSelection;
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the product name",
            name: "additem",
            validate: function (value) {

            console.log(value);
            connection.query("SELECT * FROM products WHERE product_name='" + value + "'", function (err, res) {
                    // console.log(res);
                    // if (res.length > 0) {
                    //     console.log(answer.addstock);
                    //     // if item already exists then add the stock to the existing item
                    //     var updatedStockQty = parseFloat(res[0].stock_quantity) + parseFloat(answer.addstock);
                    //     console.log(updatedStockQty);
                    //     console.log("The product you are trying to add already exists!!, updating the product...");
                    //     connection.query(
                    //         "UPDATE products SET ? WHERE ?",
                    //         [
                    //             {
                    //                 stock_quantity: updatedStockQty
                    //             },
                    //             {
                    //                 product_name: answer.additem
                    //             }
                    //         ], function (error) {
                    //             if (error) throw err;
                    //             console.log("Succesfully Updated Product!");
                    //             // display updated list
                    //             readAvailableProducts();
                    //             // and start the questions again
                    //         });
                    // }

                

                });
            
        },
        {
            type: "input",
            message: "Enter the Department Name for this product",
            name: "adddept"
        },
        {
            type: "input",
            message: "Enter the price of the product",
            name: "addprice"
        },
        {
            type: "input",
            message: "Enter the stock quantity of the product",
            name: "addstock"
        }

    ]).then(function (answer) {

        // if product name is same as db product name then add the stock price only
        connection.query("SELECT * FROM products WHERE product_name='" + answer.additem + "'", function (err, res) {
            // console.log(res);
            if (res.length > 0) {
                console.log(answer.addstock);
                // if item already exists then add the stock to the existing item
                var updatedStockQty = parseFloat(res[0].stock_quantity) + parseFloat(answer.addstock);
                console.log(updatedStockQty);
                console.log("The product you are trying to add already exists!!, updating the product...");
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedStockQty
                        },
                        {
                            product_name: answer.additem
                        }
                    ], function (error) {
                        if (error) throw err;
                        console.log("Succesfully Updated Product!");
                        // display updated list
                        readAvailableProducts();
                        // and start the questions again
                    });
            }

            else {
                // if product doesnt exist then insert into the db
                var query = "INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('" + answer.additem + "'," + "'" + answer.adddept + "'," + "'" + answer.addprice + "'," + "'" + answer.addstock + "')";
                connection.query(query, function (err, res) {
                    console.log("Succesfully added item tot the inventory");
                    // display the table again
                    readAvailableProducts();
                    //     console.log(res);

                });
            }
        });

    });
    // 
    // console.log(answer.additem, answer.adddept, answer.addprice, answer.addstock);
    // addToInventory();
    // INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('God of War','Video Games',29.95,40);
    // var query = "INSERT INTO products(product_name,department_name,price,stock_quantity)VALUES('" + answer.additem + "'," + "'" + answer.adddept + "'," + "'" + answer.addprice + "'," + "'" + answer.addstock + "')";
    // connection.query(query, function (err, res) {
    //     console.log("Succesfully added item tot the inventory");
    //     console.log(res);

    // });
}