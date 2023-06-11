INSERT INTO department (dep_name) VALUES 
('Marketing'),
('Finance'),
('Human Resources'),
('Production'),
('Development'),
('Quality Management');

INSERT INTO role (title, salary, department_id) VALUES 
('Sales Lead',80000,1),
('Salesperson',74000,1),
('Lead Engineer',80000,5),
('Software Engineer',750000,5),
('Account Manager',85000,2),
('Accountant',68000,2),
('HR Staff',70000,4);



INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
 ('Georgi','Facello',1,null),
 ('Duangkaew','Piveteau',2,1),
 ('Saniya','Kalloufi',3,null),
 ('Parto','Bamford',4,3),
 ('Tzvetan','Zielinski',4,3),
 ('Prasadram','Heyers',4,3),
 ('Divier','Reistad',5,null),
 ('Elvis','Demeyer',6,7),
 ('Bezalel','Simmel',6,7),
 ('Jeong','Reistad',6,7),
 ('Arif','Merlo',3,null),
 ('Bader','Swan',7,null),
 ('Alain','Chappelet',7,12),
 ('Adamantios','Portugali',7,12);

