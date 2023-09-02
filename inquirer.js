const log = new (require('./util.js'))();
const { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, getEmployeesByManagerId, getEmployeesByDepartmentId } = require("./database.js");
var inquirer = require('inquirer');

const choices = [];
choices.push({
  name: 'View all Departments',
  value: 'get departments'
});
choices.push({
  name: 'View all Roles',
  value: 'view roles'
});
choices.push({
  name: 'View all Employees',
  value: 'view employees'
});
choices.push({
  name: 'Add a Department',
  value: 'add department'
});
choices.push({
  name: 'Add a Role',
  value: 'add role'
});
choices.push({
  name: 'Add an Employee',
  value: 'add employee'
});
choices.push({
  name: 'Update Employee Role',
  value: 'update employee role'
});
choices.push({
  name: 'Update Employee Manager',
  value: 'update employee manager'
});
choices.push({
  name: 'View by Manager',
  value: 'view by manager'
});
choices.push({
  name: 'View by Department',
  value: 'view by department'
});
choices.push({
  name: 'Quit',
  value: 'quit'
});

(function inquireMain() {
  inquirer.prompt([
    {
      type: 'list',
      loop: true,
      name: 'prompt',
      message: "What would you like to do?",
      choices,
    }
  ]).then(async (answers) => {
    try {
      switch (answers.prompt) {
        case "get departments": {
          let departmentData = (await getDepartments())[0];
          await displayList(departmentData, Object.keys(departmentData[0]));
          return inquireMain();
        } break;
        case "view roles": {
          let departmentData = (await getDepartments())[0];
          let roleData = (await getRoles())[0];
          roleData.forEach(r => {
            r.department = departmentData.find(d => d.id == r.department_id).name;
            delete r.department_id;
          });
          await displayList(roleData, Object.keys(roleData[0]));
          return inquireMain();
        } break;
        case "view employees": {
          let employeeData = (await getEmployees())[0];
          let roleData = (await getRoles())[0];
          employeeData.forEach(e => {
            e.role = roleData.find(r => r.id == e.role_id).title;
            if (e.manager_id !== null) {
              let manager = employeeData.find(r => r.id == e.manager_id);
              if (manager === undefined) e.manager = undefined;
              else e.manager = manager.first_name + " " + manager.last_name;
            } else e.manager = null;
            delete e.role_id;
            delete e.manager_id;
          });
          await displayList(employeeData, Object.keys(employeeData[0]));
          return inquireMain();
        } break;
        case "add department": {
          let name = await inquireStringInput("Department Name");
          let data = (await addDepartment(name))[0];
          data = `Added ${name} to the database`;
          log(data);
        } break;
        case "add role": {
          let title = await inquireStringInput("Role Title");
          let salary = await inquireIntegerInput("Role Salary");
          let departmentData = (await getDepartments())[0];
          let choices = [];
          for (let i = 0; i < departmentData.length; i++) {
            choices.push({
              name: departmentData[i].name,
              value: departmentData[i].id
            });
          }
          let department_id = await inquireChoices("Pick a Department", choices);
          let data = (await addRole([title, salary, department_id]))[0];
          data = `Added ${title} to the database with salary of ${salary}`;
          log(data);
        } break;
        case "add employee": {
          let first_name = await inquireStringInput("Employee First Name");
          let last_name = await inquireStringInput("Employee Last Name");
          let roleData = (await getRoles())[0];
          let choices = [];
          for (let i = 0; i < roleData.length; i++) {
            choices.push({
              name: roleData[i].title,
              value: roleData[i].id
            });
          }
          let role_id = await inquireChoices("Pick a Role", choices);
          let employeeData = (await getEmployees())[0];
          choices = [
            {
              name: "None",
              value: null
            }
          ];
          for (let i = 0; i < employeeData.length; i++) {
            choices.push({
              name: employeeData[i].first_name + " " + employeeData[i].last_name,
              value: employeeData[i].id
            });
          }
          let manager_id = await inquireChoices("Pick The Manager", choices);
          let data = (await addEmployee([first_name, last_name, role_id, manager_id]))[0];
          data = `Added ${first_name + " " + last_name} to the database`;
          log(data);
        } break;
        case "update employee role": {
          let employeeData = (await getEmployees())[0];
          let choices = [];
          for (let i = 0; i < employeeData.length; i++) {
            choices.push({
              name: employeeData[i].first_name + " " + employeeData[i].last_name,
              value: employeeData[i]
            });
          }
          let employee = await inquireChoices("Pick The Employee", choices);
          let roleData = (await getRoles())[0];
          choices = [];
          for (let i = 0; i < roleData.length; i++) {
            choices.push({
              name: roleData[i].title,
              value: roleData[i].id
            });
          }
          let role_id = await inquireChoices("Pick a Role", choices);
          let data = (await updateEmployeeRole(employee.id, role_id))[0];
          data = `Updated ${employee.first_name + " " + employee.last_name} role`;
          log(data);
        } break;
        case "update employee manager": {
          let employeeData = (await getEmployees())[0];
          let choices = [];
          for (let i = 0; i < employeeData.length; i++) {
            choices.push({
              name: employeeData[i].first_name + " " + employeeData[i].last_name,
              value: employeeData[i]
            });
          }
          let employee = await inquireChoices("Pick The Employee", choices);
          choices.unshift({
            name: "None",
            value: null
          });
          let manager = await inquireChoices("Pick a Manager", choices);
          let data = (await updateEmployeeManager(employee.id, manager.id))[0];
          data = `Updated ${employee.first_name + " " + employee.last_name} manager`;
          log(data);
        } break;
        case "view by manager": {
          let employeeData = (await getEmployees())[0];
          let roleData = (await getRoles())[0];
          let managerList = new Set();
          employeeData.forEach(e => {
            if (e.manager_id !== null) managerList.add(e.manager_id);
          });
          let choices = [];
          managerList.forEach(m => {
            let e = employeeData.find(r => r.id == m);
            choices.push({
              name: e.first_name + " " + e.last_name,
              value: e.id
            });
          })
          let manager_id = await inquireChoices("Pick The Manager", choices);
          let data = (await getEmployeesByManagerId(manager_id))[0];
          data.forEach(e => {
            e.role = roleData.find(r => r.id == e.role_id).title;
            delete e.role_id;
            delete e.manager_id;
          });
          await displayList(data, Object.keys(data[0]));
          return inquireMain();
        } break;
        case "view by department": {
          let employeeData = (await getEmployees())[0];
          let roleData = (await getRoles())[0];
          let departmentData = (await getDepartments())[0];
          let choices = [];
          for (let i = 0; i < departmentData.length; i++) {
            choices.push({
              name: departmentData[i].name,
              value: departmentData[i].id
            });
          }
          let department_id = await inquireChoices("Pick The Department", choices);
          let data = (await getEmployeesByDepartmentId(department_id))[0];
          data.forEach(e => {
            e.role = roleData.find(r => r.id == e.role_id).title;
            if (e.manager_id !== null) {
              let manager = employeeData.find(r => r.id == e.manager_id);
              if (manager === undefined) e.manager = undefined;
              else e.manager = manager.first_name + " " + manager.last_name;
            } else e.manager = null;
            delete e.role_id;
            delete e.manager_id;
          });
          await displayList(data, Object.keys(data[0]));
          return inquireMain();
        } break;
        case "quit": {
          return process.exit();
        } break;
      }
      return inquireMain();
    } catch (error) {
      console.log(error);
    }
  }).catch(error => log("bright red", error));
})();

async function inquireStringInput(message, allowNull = false) {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'string',
        message,
        validate(value) {
          return allowNull || !!(value.length);
        }
      }
    ]).then((answers) => resolve(answers.string));
  });
}

async function inquireIntegerInput(message, allowNull = false) {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'integer',
        message,
        validate(value) {
          return allowNull || value.match(/^(\d)+$/) ? true : 'Please enter a valid number';
        }
      }
    ]).then((answers) => resolve(answers.integer));
  });
}

async function inquireChoices(message, choices) {
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'list',
        loop: true,
        name: 'prompt',
        message,
        choices,
      }
    ]).then((answers) => {
      resolve(answers.prompt);
    });
  });
}

async function displayList(array, headers) {
  let table = new Array(array.length + 2).fill().map(() => new Array(headers.length));
  for (let i = 0; i < headers.length; i++) {
    let h_fixed = headers[i].split("_").filter(x => x).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(' ');
    table[0][i] = h_fixed;
    for (let j = 0; j < array.length; j++) {
      let d = array[j][headers[i]];
      table[2 + j][i] = String(d);
    }
    let mCount = 0;
    for (let j = 0; j < table.length; j++) {
      if (j == 1) continue;
      mCount = Math.max(mCount, table[j][i].length);
    }
    table[1][i] = ("").padEnd(mCount, "-");
    for (let j = 0; j < table.length; j++) {
      if (j == 1) continue;
      table[j][i] = table[j][i].padEnd(mCount, " ");
    }
  }
  table.map(pirate => pirate.join("  "));
  log("");
  for (let i = 0; i < table.length; i++) {
    if (i == 0) log("bright blue", table[i]);
    else if (i == 1) log("bright white", table[i]);
    else log("bright green", table[i]);
  }
  log("");
  return;
}