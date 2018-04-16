var inquirer = require('inquirer');
var mysql = require('mysql');
var { table } = require('table');
var color = require('bash-color');
const cTable = require('console.table');

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
                "View Product Sales by Department",
                "Create New Department",
                "Exit"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                viewSalesByDept();
                break;

            case "Create New Department":
                addNewDept();
                break;

            case "Exit":
                exitApp();
                break;
        }

    });
}

// view sales by dept
function viewSalesByDept() {
    var query = "SELECT departments.department_id,departments.department_name,departments.over_head_costs,round(sum(products.product_sales),2)AS product_sales,round((departments.over_head_costs - products.product_sales),2)AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(color.green(table));
        listOptions();
    });
}

// create new department
function addNewDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the Department name",
            name: "addDeptName"
        },
        {
            type: "input",
            message: "Enter the over head costs",
            name: "addOverHeadCosts"
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO departments SET ?", {
            department_name: answer.addDeptName,
            over_head_costs: answer.addOverHeadCosts
        }, function (err, res) {
            console.log("==================================================================================");
            console.log(" Succesfully added new department by name " + answer.addDeptName + " with " + answer.addOverHeadCosts + " over head costs.");
            console.log("==================================================================================");
            // display the table again
            showAllDeptInfo();
        });
    });

}
// display depts info
function showAllDeptInfo(){
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        const table = cTable.getTable(res);
        console.log(table);
        listOptions();
    });
}

// Exit App
function exitApp() {
    connection.end();
    process.exit();
}