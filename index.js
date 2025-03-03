const inquirer = require('inquirer');
const {pool} = require('./db/connection.js');

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

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the new department:',
        }
    ]).then((answer) => {
        pool.query('INSERT INTO department (name) VALUES ($1)', [answer.departmentName], (err, res) => {
            if (err) throw err;
            console.log(`Department "${answer.departmentName}" added successfully!`);
            startApp(); 
        });
    });
}


function addRole() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        const departmentChoices = res.rows.map(dept => ({
            name: dept.name,
            value: dept.id
        }));

        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Enter the title of the new role:',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Enter the salary for this role:',
                validate: (input) => !isNaN(input) ? true : "Please enter a valid number."
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Select the department for this role:',
                choices: departmentChoices
            }
        ]).then((answers) => {
            pool.query(
                'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
                [answers.roleTitle, answers.roleSalary, answers.departmentId],
                (err, res) => {
                    if (err) throw err;
                    console.log(`Role "${answers.roleTitle}" added successfully!`);
                    startApp(); 
                }
            );
        });
    });
}

function addEmployee() {
    pool.query('SELECT * FROM role', (err, roleRes) => {
        if (err) throw err;

        const roleChoices = roleRes.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        pool.query('SELECT * FROM employee', (err, empRes) => {
            if (err) throw err;

            const managerChoices = empRes.rows.map(emp => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id
            }));
            managerChoices.unshift({ name: "None", value: null }); 

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter the employee's first name:",
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter the employee's last name:",
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: "Select the employee's role:",
                    choices: roleChoices
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: "Select the employee's manager (if any):",
                    choices: managerChoices
                }
            ]).then((answers) => {
                pool.query(
                    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                    [answers.firstName, answers.lastName, answers.roleId, answers.managerId],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Employee "${answers.firstName} ${answers.lastName}" added successfully!`);
                        startApp(); 
                    }
                );
            });
        });
    });
}

function updateEmployeeRole() {
    pool.query('SELECT * FROM employee', (err, empRes) => {
        if (err) throw err;

        const employeeChoices = empRes.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));

        pool.query('SELECT * FROM role', (err, roleRes) => {
            if (err) throw err;

            const roleChoices = roleRes.rows.map(role => ({
                name: role.title,
                value: role.id
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: "Select the employee whose role you want to update:",
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'newRoleId',
                    message: "Select the employee's new role:",
                    choices: roleChoices
                }
            ]).then((answers) => {
                pool.query(
                    'UPDATE employee SET role_id = $1 WHERE id = $2',
                    [answers.newRoleId, answers.employeeId],
                    (err, res) => {
                        if (err) throw err;
                        console.log("Employee role updated successfully!");
                        startApp(); 
                    }
                );
            });
        });
    });
}

startApp();
