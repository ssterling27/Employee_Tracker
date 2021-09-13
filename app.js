const mysql = require('mysql2')
const { prompt } = require('inquirer')
const cTable = require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/employees_db')

const buildDepartment = () => {
  prompt({
    type: 'input',
    name: 'name',
    message: 'Input Department Name'
  })
  .then(({ name }) => {
    let departmentName = {
      name: name
    }
    db.query('INSERT INTO departments SET ?', departmentName, err => {
      if (err) {console.log(err)}
    })
    console.log('Department created!')
    menu()
  })
}

const buildRole = () => {
  prompt([{
    type: 'input',
    name: 'title',
    message: 'Input Role Title'
  },
  {
    type: 'number',
    name: 'salary',
    message: 'Input salary'
  },
  {
    type: 'number',
    name: 'department',
    message: 'Input Department ID'
  }
])
  .then(( { title, salary, department }) => {
    let role = {
      title: title,
      salary: salary,
      department_id: department
    }
    db.query('INSERT INTO roles SET ?', role, err => {
      if (err) { console.log(err) }
    })
    console.log('Role created!')
    menu()
  })
}

const buildEmployee = () => {
  prompt([{
    type: 'input',
    name: 'firstName',
    message: 'Input first name'
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'Input last name'
  },
  {
    type: 'number',
    name: 'role',
    message: 'Input role ID'
  },
  {
    type: 'input',
    name: 'manager',
    message: 'Input manager ID'
  }])
  .then(( { firstName, lastName, role, manager }) => {
    let employee = {
      first_name: firstName,
      last_name: lastName,
      role_id: role,
      manager_id: manager
    }
    db.query('INSERT INTO employees SET ?', employee, err => {
      if (err) { console.log(err) }
    })
    console.log('Employee created!')
    menu()
  })
}

const view = () => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'Select what to view',
    choices: ['Departments', 'Roles', 'Employees', 'Back', 'Exit']
  })
  .then(({ action }) => {
    switch (action) {
      case 'Departments':
        db.query('SELECT * FROM departments', (err, departments) => {
          if (err) { console.log(err) }
          console.table(departments)
          process.exit(0)
        })
        break
      case 'Roles':
        db.query(`SELECT roles.id, roles.title AS role, roles.salary, departments.name AS department
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`, (err, roles) => {
          if (err) { console.log(err) }
          console.table(roles)
          process.exit(0)
        })
        break
      case 'Employees':
        db.query(`Select CONCAT(employees.first_name, ' ', employees.last_name) AS name, roles.title AS role, departments.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        LEFT JOIN roles
        on employees.role_id = roles.id
        LEFT JOIN departments
        ON roles.department_id = departments.id
        LEFT JOIN employees manager
        ON manager.id = employees.manager_id`, (err, employees) => {
          if (err) { console.log(err) }
          console.table(employees)
          process.exit(0)
        })
        break
      case 'Back':
        menu()
        break
      case 'Exit':
        console.log('Goodbye!')
        process.exit(0)
        break
    }
  })
}

const menu = () => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['Create new department', 'Create new role', 'Create new employee', 'View']
  })
  .then(({ action }) => {
    switch (action) {
      case 'Create new department':
        buildDepartment()
        break
      case 'Create new role':
        buildRole()
        break
      case 'Create new employee':
        buildEmployee()
        break
      case 'View':
        view()
        break
    }
  })
}

menu()