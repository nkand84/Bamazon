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
    readProducts();

});
// table should be displayed when the app starts
// read table data
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
        // connection.end();
        askQuestions(res);
    });
}
// inquirer prompt
function askQuestions(res) {
    inquirer.prompt([
        {
            /* Pass your questions in here */
            type: "input",
            message: "what is the id of the item you would like to purchase? [Quit with Q]",
            name: "question1",
            validate: function (value) {
                if (value.toUpperCase() === "Q") {
                    connection.end();
                    process.exit(1);
                }
                return true;
            }
        },
        {
            // how many would you like [Quit with Q]? 
            type: "input",
            message: "how many would you like [Quit with Q]?",
            name: "question2",
            validate: function (value) {
                if (value.toUpperCase() === "Q") {
                    connection.end();
                    process.exit(1);
                }
                return true; 
            }
        }
    ]).then(function (answer) {

        // loop through the array 
        var userSelection = answer.question1;
        var userSelectionQty = answer.question2;
        for (var j = 0; j < res.length; j++) {
            if (userSelection == res[j].item_id) {
                if (userSelectionQty > res[j].stock_quantity) {
                    // if the item is out of stock(if user enters more than the given stock qty)
                    // message is displayed "Insufficient quantity!!"
                    console.log("Insufficent quantity!");
                    askQuestions(res);
                }
                else {
                    // get the stock qty of that particular item
                    var newStockQty = res[j].stock_quantity - userSelectionQty;
                    // update the table with the new updated value
                    updateStockValue(userSelection, newStockQty);
                }
            }
        }

    });
}

// update stock function
function updateStockValue(userSelection, newStockQty) {
    console.log("Updating the stock quantity...\n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStockQty
            },
            {
                item_id: userSelection
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product stock updated!\n");
            // logs the actual query being run
            console.log(query.sql);
            // app starts again with prompt of questions 
            // reading products again
            readProducts();

        }
    )
}
