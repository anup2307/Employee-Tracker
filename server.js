const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arun2307',
    database: 'employee_db'
})

function prompt(){
    inquirer.prompt([
    {
        type:'list',
        name:'action',
        message:'What would you like to do? ',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Roles',
            'Add Employee',
            'Update Employee Role'
        ]
    }
])
.then((answer) => {
    console.log(answer);
    switch (answer.action){
        case 'View All Employees':
            selectEmployee();
            break;
        case 'Add Employee':
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter Employee first name: '
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter Employee last name: '
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Enter Employee role : ',
                    choices:[
                        'Sales Lead',
                        'Salesperson',
                        'Lead Engineer',
                        'Software Engineer',
                        'Account Manager',
                        'Accountant',
                        'Legal Team Lead',
                        'Lawyer',
                        'HR Staff'
                    ]
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Enter Employee manager name: ',
                    choices : [
                        'None',
                        'Georgi Facello',
                        'Saniya Kalloufi',
                        'Divier Reistad',
                        'Arif Merlo',
                        'Bader Swan'
                    ]
                },
            ])
            .then(({first_name,last_name,role,manager}) => {
                addEmployee(first_name,last_name,role,manager);
            });
            break;
        case 'View All Roles':
            selectRole();
            break;
        case 'View All Departments':
            selectDepartment();
            break;
        case 'Add Roles':
            addRole();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        default:
            console.log('err');
            break;
    }         
    })
};

function getRoleid(role,callback){
    let roleId =0;
    console.log('role:',role);

    db.query('select id from role where title = ?',role, function(err,results) {
        if (err){
            console.log('error in roleid');
        }else{
            roleId = results[0].id;
            console.log('roleid:',roleId);  
            return callback(roleId)  
        }
        console.log('roleid1:',roleId);
    })
}

function selectEmployee(){
    console.log('in employee')
    db.query('select employee.id as Emp_Id, first_name as First_Name, last_name as Last_name, title as Job_Title, salary, dep_name as Department_name, m.emp_name as manager_name from employee, role, department, (select id,  concat(first_name," ", last_name) as emp_name from employee) M where employee.role_id=role.id and 	role.department_id=department.id    and	m.id=employee.manager_id   order by emp_id; ',
     function (err, results) {
        err ? console.log('error in viewing Employee table') :console.table(results);
        prompt();
    });
};

function selectDepartment(){
    db.query('select id as DEPT_Id, dep_name as DEPT_Name from department', function (err, results) {
        err ? console.log('error in viewing Department table') : console.table(results);
        prompt();
    });
}

function selectRole(){
    db.query('select role.id as Role_id, title as Roles, salary, dep_name as Department_name from role join department on role.department_id=department.id', function (err, results) {
        err ? console.log('error in viewing Roles table') : console.table(results);
        prompt();
    });
}

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'dep_name',
            message: 'Enter Department name: '
        }])
        .then(({dep_name}) => {
            db.query('insert into department (dep_name) values (?)',dep_name,function (err, results) {
                err ? console.log('error in viewing Department table') : prompt();})
        })
        
}

function addRole(){
    inquirer.prompt([
        {
            type:'input',
            name:'role_name',
            message: 'Enter the new Role: '
        },
        {
            type:'input',
            name:'salary',
            message: 'Enter the salary: '
        },
        {
            type:'list',
            name: 'dep_name',
            message:'choose the Department:',
            choices:[
                'Marketing',
                'Finance',
                'Human Resources',
                'Production',
                'Development',
                'Quality Management',
                'Legal',
                'Customer Service'
            ]
        }
    ])
    .then(({role_name,salary,dep_name})=>{
        console.log(role_name,salary,dep_name);
    })
}

function addEmployee(first_name,last_name,role,manager){
    const managerId = manager.split(' ');
    let managerid = 0;
    db.query('select id from employee where first_name = ? and  last_name=?',managerId, function (err, results) {
        if(err){ console.log('error in managerid');}
        else
        { 
            managerid = results[0].id;
            return managerid;
        }
    })
    
    let roleId = getRoleid(role,function(response){
                    return response;
                 });
    console.log('hiiii::',roleId);
    db.query('insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)',[first_name,last_name,roleId,managerid],function (err, results) {
        if(err){ console.log('error in adding employee',err);}});
    prompt();
}
prompt();