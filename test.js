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
    // console.log("connected as id " + connection.threadId + "\n");
    readProducts();

});
// read table data
function readProducts() {
    console.log("================================================================================");
    console.log("                     WELCOME TO BAMAZON...ENJOY YOUR SHOPPING");
    console.log("================================================================================");
    var finalTable = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        var data = ['ProductId', 'ProductName', 'DepartmentName', 'Price($)', 'StockQuantity'];
        finalTable.push(data);
        for (var i = 0; i < res.length; i++) {
            data = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
           finalTable.push(data);
        }
         output = table(finalTable);
        console.log(color.green(output));
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
                if (value.toUpperCase() == "Q") {
                    connection.end();
                    process.exit(1);
                }
                return true;
            }
        },
        {
            type: "input",
            message: "how many would you like [Quit with Q]?",
            name: "question2",
            validate: function (value) {
                if (value.toUpperCase() == "Q") {
                    connection.end();
                    process.exit(1);
                }
                return true;
            }
        }
    ]).then(function (answer) {
        var userSelection = answer.question1;
        var userSelectionQty = answer.question2;
        var query = "SELECT stock_quantity,product_name,price FROM products WHERE ?";
        connection.query(query, { item_id: answer.question1 }, function (err, res) {
            if (userSelectionQty > res[0].stock_quantity) {
                // if the item is out of stock
                console.log("================================================================================");
                console.log("Insufficent quantity! Please select something else..");
                askQuestions(res);
            }
            else {
                // get the stock qty of that particular item
                var newStockQty = res[0].stock_quantity - userSelectionQty;
                // update the table with the new updated value
                updateStockValue(userSelection, newStockQty,userSelectionQty,res);
            }
        });
    });

}
// update table data
function updateStockValue(userSelection, newStockQty,userSelectionQty,res) {
    console.log("================================================================================");
    console.log("    Successfully purchased "+ userSelectionQty +" of "+ res[0].product_name+" for a purchase price of $"+(userSelectionQty*res[0].price).toFixed(2));
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
            // reading products again
            readProducts();
           
        }
    )
}

