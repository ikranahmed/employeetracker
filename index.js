const inquirer = require('inquirer');
const pool = require('./db/connection');

function startApp() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                pool.end();
        }
    });
}

function viewDepartments() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewRoles() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

function viewEmployees() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

startApp();
