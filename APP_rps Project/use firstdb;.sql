use firstdb;
create table accounts(
accountid int primary key,
name varchar(50) not null,
pass varchar(50) not null,
winstreak int,
noofpayments int default 0
);
create table winstreak(
streak int primary key,
foreign key (streak) references accounts(accountid)
);
create table paymentid(
id int not null,
cost int not null
);