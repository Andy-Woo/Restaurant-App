// imports dependencies
let express = require('express')
let app = express()
let bodyParser = require('body-parser')

var jwt = require('jsonwebtoken')

let constants = require('./constants')
// db dependencies
var db = require('mysql-promise')();

db.configure({
	"host": "localhost",
	"user": "root",
	"password": "root123",
	"database": "student",
	"multipleStatements": true
});

var query = require('./query')
var users = require('./users.json')

app.use(bodyParser.json())
app.use(express.static('../public'))

// serve the home page
app.get('/', function (req, res) {
	res.send('index.html')
})

// simplified using JSON for users, no password 
app.get('/find/:user', (req, res) => {

	var user = req.params['user'].toLowerCase()
	var output = (users[user]) ? users[user] : users['user']

	// sign with JWT
	let token = jwt.sign(output, 'SuPerSkR', { expiresIn: "10m" })
	res.header({ "token": token })
	res.json(output)
})

// store and get data api
app.post('/store', (req, res) => {

	// set the userId field corresponding to the username
	let username = req.body['userId'].toLowerCase()
	
	// if no user is found a default user will be shown
	req.body['userId'] = (users[username]) ? users[username]['userId'] : users['user']['userId']

	// send the response
	query.sendResponse(db, req, res)

})

// middleware to check JWT for every request
app.use(jwtVerify)

app.get('/findall/:user', (req, res) => {
	console.log(req.params['user'])
	var sqlquery = `SELECT place, latitude, longitude FROM searchedData WHERE userId = ${req.params['user']}`
	console.log('sqlquery is -> ', sqlquery)
	db.query(sqlquery)
		.then((data) => {
			res.json(data[0])
		}, (err) => {
			console.log(err)
		})
})

// function to verify JWT token
function jwtVerify(req, res, next) {

	if (req.headers['authorization']) {
		let token = req.headers['authorization'].substr(req.headers['authorization'].indexOf(' ') + 1)

		// verify the token
		jwt.verify(token, 'SuPerSkR', (err, data) => {
			if (err) {
				console.log('err in the JWT ', err)

				// forbidden if token can't be verified
				res.sendStatus(403)
			}
			else {
				// continue to the routing
				next()
			}
		})
	} else {
		// if no token is provided send 'FORBIDDEN'
		res.sendStatus(403)
	}
}

app.listen(3000, function () {
	console.log('Server is running')
})