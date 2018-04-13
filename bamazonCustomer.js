// npm packages
var inquirer = require('inquirer');
var mysql = require('mysql');
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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        askQuestions(res);
        
    });
}
function askQuestions(res) {
    inquirer.prompt([
        {
            /* Pass your questions in here */
            // questions are displayed 
            // "what is the id of the item you would like to purchase? [Quit with Q]"

            type: "input",
            message: "what is the id of the item you would like to purchase? [Quit with Q]",
            name: "question1"
        },
        {
            // how many would you like [Quit with Q]? 
            type: "input",
            message: "how many would you like [Quit with Q]?",
            name: "question2"
        }
    ])
        .then(function (answer) {
            // console.log(answer.question1);
            // loop through the array of objects
            var userSelection = answer.question1;
            var userSelectionQty = answer.question2;
            console.log(userSelection);
            console.log(userSelectionQty);
            for (var i = 0; i < res.length; i++) {
                // console.log("id found " + res[i].item_id);
                if (userSelection == res[i].item_id) {
                    // console.log("you got it ");
                    // get the stock qty of that particular item
                    var newStockQty = res[i].stock_quantity - userSelectionQty;
                    console.log(newStockQty);
                    // update the table with the new updated value
                    updateStockValue(userSelection,newStockQty);
                    
                }
            }
        });
}

function updateStockValue(userSelection,newStockQty) {
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
            // reading products again
            readProducts();
            
        }
    )
}
// show the questions again
// if the item is out of stock(if user enters more than the given stock qty)
// message is displayed "Insufficient quantity!!"
// display table of items again
// app starts again with prompt of questions 