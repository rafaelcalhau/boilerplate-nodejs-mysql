-- create databases
CREATE DATABASE IF NOT EXISTS `db_production`;
CREATE DATABASE IF NOT EXISTS `db_test`;

-- create root user and grant rights
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'admin';
GRANT ALL ON *.* TO 'root'@'%';