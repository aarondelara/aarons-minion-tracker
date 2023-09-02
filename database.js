// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);

function getDepartments() {
    return db.promise().query('SELECT * FROM department');
}

function getRoles() {
    return db.promise().query('SELECT * FROM role');
}

function getEmployees() {
    return db.promise().query('SELECT * FROM employee');
}

function addDepartment(name) {
    return db.promise().query('INSERT INTO department (name) VALUES (?)', name);
}

function addRole(args) {
    return db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', args);
}

function addEmployee(args) {
    return db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', args);
}

function updateEmployeeRole(employee_id, role_id) {
    return db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee_id]);
}

function updateEmployeeManager(employee_id, manager_id) {
    return db.promise().query('UPDATE employee SET manager_id = ? WHERE id = ?', [manager_id, employee_id]);
}

function getEmployeesByManagerId(manager_id) {
    return db.promise().query('SELECT * FROM employee WHERE manager_id = ?', [manager_id]);
}

async function getEmployeesByDepartmentId(department_id) {
    let roles = (await db.promise().query('SELECT * FROM role WHERE department_id = ?', [department_id]))[0];
    roles.forEach((e, i, a) => a[i] = e.id);
    return db.promise().query(`SELECT * FROM employee WHERE role_id IN (${roles.join(", ")})`);
}

module.exports = {
    db,
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    getEmployeesByManagerId,
    getEmployeesByDepartmentId
};