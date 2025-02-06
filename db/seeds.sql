INSERT INTO department (name) VALUES 
('HR'),
('Engineering'),
('Finance');

INSERT INTO role (title, salary, department_id) VALUES 
('HR Assistant', 60000, 1),
('HR Manager', 100000, 1),
('Software Engineer', 120000, 2),
('Senior Software Engineer', 140000, 2),
('Accountant', 90000, 3),
('Accountant Manager', 120000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Jane', 'Doe', 2, NULL),
('John', 'Doe', 1, 1),
('Alice', 'Smith', 4, NULL),
('Bob', 'Billy', 3, 3),
('Charlie', 'Brown', 6, NULL),
('David', 'Adams', 5, 5);   