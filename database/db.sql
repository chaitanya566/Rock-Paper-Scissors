
CREATE DATABASE IF NOT EXISTS firstdb;
USE firstdb;


CREATE TABLE IF NOT EXISTS userinfo1 (
  username VARCHAR(50),
  password VARCHAR(50),
  winstreak INT DEFAULT 0
);

SELECT * FROM userinfo1;
