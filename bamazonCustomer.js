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
    connection.end();
});
// table should be displayed when the app starts
// read table data
function readProducts() {
    console.log("Dsiplaying all products...\n");
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
            // console.log(answer);
            // loop through the array of objects
            for (var i = 0; i < res.length; i++) {
                console.log("id found " + res[i].item_id);
                if (answer.question1 === res[i].item_id) {
                    // table is displayed again with the updated stock price of that item
                }
            }
        });
}

// show the questions again
// if the item is out of stock(if user enters more than the given stock qty)
// message is displayed "Insufficient quantity!!"
// display table of items again
// app starts again with prompt of questions 