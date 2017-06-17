// create the schema for the database

// imports dependencies
var constants = require('./constants')

// db dependencies
var db = require('mysql-promise')()

db.configure({
	"host": "localhost",
	"user": "root",
	"password": "root123",
	"database": "student",
	"multipleStatements": true
})


var schemaCreate = function () {
	var sqlQuery = `DROP TABLE IF EXISTS searchedData;
		CREATE table searchedData (
		userId varchar(40) not null,
		place varchar(255) not null,
		latitude DECIMAL(10, 8) NOT NULL,
		longitude DECIMAL(11, 8) NOT NULL,
		UNIQUE KEY searchitem (userId, place, latitude, longitude)
		) ENGINE=InnoDB AUTO_INCREMENT=1  CHARSET=utf8;

		`
	return new Promise((resolve, reject) => {
		db.query(sqlQuery)
			.then((success) => {
				console.log('table created successfully')
			})
	}).catch((error) => {
		console.log('unable to create table', error)
	})
}

schemaCreate()