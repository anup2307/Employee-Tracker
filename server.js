const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'arun2307',
    database: 'employee_db'
})

function questions(){
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
            'Update Employee Role',
            'Exit'
        ]
    }
])
.then((answer) => {
    console.log(answer);
    switch (answer.action){        
        case 'View All Departments':
            selectDepartment();
            break;
        case 'View All Roles':
            selectRole();
            break;
        case 'View All Employees':
            selectEmployee();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Roles':
            addRole();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'Exit':
            db.end();
            break;
    }         
    })
};

var roleArr = [];
function getRoles() {
  db.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push({value:res[i].id, name: res[i].title});
    }
  })
  return roleArr;
}

var managerlist=[{name: 'None',value:''}];
function getManagerlist(){
    db.query('select id,concat(first_name," ",last_name) as managerName from employee where manager_id is NULL', function(err,res){
        if(err) throw err
        for (var i=0; i<res.length; i++){
            managerlist.push({name:res[i].managerName,value:res[i].id})
        }
    }) 
    return managerlist;
}

function getEmployeelist(){
     return db.promise().query('select id as value,concat(first_name," ",last_name) as name from employee')
     .then(([rows,fields])=>{
        return rows;
     })
    .catch((err)=> console.log(err))
}

var departmentArr= [];
function getDepartmentlist(){
    db.query('select * from department', function(err,res){
        if(err) throw err
        for (var i=0; i<res.length; i++){
            departmentArr.push({name:res[i].dep_name,value:res[i].id})
        }
    }) 
    return departmentArr;
}

function selectDepartment(){
    db.query('select id as DEPT_Id, dep_name as DEPT_Name from department', function (err, results) {
        if (err){console.log('Error viewing table')} 
        else{ console.table(results);
              questions();
        }
    });
}

function selectRole(){
    db.query('select role.id as Role_id, title as Roles, salary, dep_name as Department_name from role join department on role.department_id=department.id', function (err, results) {
        if (err){console.log('Error viewing table')} 
        else{ console.table(results);
              questions();
        }
    });
}

function selectEmployee(){
    console.log('in employee')
    db.query('select employee.id as Emp_Id, first_name as First_Name, last_name as Last_name, title as Job_Title, salary, dep_name as Department_name, m.emp_name as manager_name from employee, role, department, (select id,  concat(first_name," ", last_name) as emp_name from employee) M where employee.role_id=role.id and role.department_id=department.id and m.id=employee.manager_id order by emp_id; ',
     function (err, results) {
        if (err){console.log('Error viewing table')} 
        else{ console.table(results);
              questions();
        }
    });
};

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'dep_name',
            message: 'Enter Department name: '
        }])
        .then(({dep_name}) => {
            db.query('insert into department (dep_name) values (?)', dep_name, function (err, results) {
                if (err) {console.log('Error in adding Department')}
                else{
                   console.log('Department details added Successfully'); 
                   questions();
                }})
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
            name: 'dep_id',
            message:'choose the Department:',
            choices: getDepartmentlist()
        }
    ])
    .then(({role_name,salary,dep_id})=>{
        db.query('insert into role (title, salary, department_id) values(?,?,?)',[role_name, salary, dep_id], function(err,res){
            if (err) {console.log('Error in adding Role')}
                else{
                   console.log('Added Successfully'); 
                   questions();
                }
        })             
    })
}

function addEmployee(){
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
            choices: getRoles()
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Enter Employee manager name: ',
            choices : getManagerlist()
        },
    ])
    .then(({first_name,last_name,role,manager}) => {
        if(manager.length=== 0){ 
            db.query('insert into employee (first_name, last_name, role_id,manager_id) values (?,?,?,null)',[first_name,last_name,role],function (err, results) {
                if (err) {console.log('Error in adding employee')}
                else{
                   console.log('Employee details added Successfully'); 
                   questions();}})
        }else{
            db.query('insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)',[first_name,last_name,role,manager],function (err, results) {
             if (err) {console.log('Error in adding employee')}
             else{
                console.log('Employee details added Successfully'); 
                questions();}
            });  
        }
    });   
}

function updateRole(){
    getEmployeelist()
    .then((choices) => {   
        inquirer.prompt([
            {
                type: 'list',
                name:'employee_id',
                message: "Which employee's role do you want to update? ",
                choices: choices
            },
            {
                type:'list',
                name:'role',
                message: 'Which role do you want to assign to the selected employee? ',
                choices: getRoles()
            }
        ])
        .then(({employee_id,role}) => {
            db.query('update employee set role_id =? where id = ?',[role,employee_id], function(err,res){
                if (err){ console.log('Error in Updating employee role')}
                else{ 
                    console.log('Updated Employee role');
                    questions();
                }
            })
        })
    })
}

questions();