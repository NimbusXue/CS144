CREATE TABLE Actors(name VARCHAR(40), movie VARCHAR(80), year INT, role VARCHAR(40));
LOAD DATA LOCAL INFILE './actors.csv' INTO TABLE Actors
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';
select name from Actors where movie='Die Another Day';