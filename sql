DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT
);

INSERT INTO department (id, name)
VALUES (1, "Sales"),
       (2, "Engineering"),
       (3, "Accounting"),
       (4, "Legal");

INSERT INTO role (id, department_id, title, salary)
VALUES (1, 1, "Sales", 20000),
       (2, 1, "Sales Manager", 40000),
       (3, 2, "Software Engineer", 30000),
       (4, 2, "Engineering Manager", 50000),
       (5, 3, "Accountant", 20000),
       (6, 3, "Accounting Manager", 50000),
       (7, 4, "Lawyer", 60000),
       (8, 4, "Legal Manager", 80000);

INSERT INTO employee (id, role_id, manager_id, first_name, last_name)
VALUES (1, 1, 3, "Edward", "Newgate"),
       (2, 1, 3, "Teach", "Marshal"),
       (3, 2, null, "Garp", "Monkey"),
       (4, 3, 6, "Law", "Trafalgar"),
       (5, 3, 6, "Shanks", "Figarland"),
       (6, 4, null, "Robin", "Nico"),
       (7, 5, 9, "Rocks", "Xebec"),
       (8, 5, 9, "Saturn", "Jay Garcia"),
       (9, 6, null, "Doflamingo", "Donquixote"),
       (10, 7, 12, "Hancock", "Boa"),
       (11, 7, 12, "Ace", "Portgas"),
       (12, 8, null, "Edward", "Newgate");