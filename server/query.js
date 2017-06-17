// do the query to the db

var sendResponse = function (db, req, res) {

	let columnNames = ''
	let columnValues = ''

	let body = req.body
	let keys = Object.keys(body)

	for (let i = 0; i < keys.length; i++) {
		columnNames = columnNames + keys[i] + ','
		columnValues = `${columnValues} '${body[keys[i]]}',`
	}
	columnNames = ` ( ${columnNames.replace(/,\s*$/, '')} ) `
	columnValues = ` ( ${columnValues.replace(/,\s*$/, '')} ) `


	let sqlQuery = `INSERT INTO searchedData ${columnNames} VALUES ${columnValues}
		ON DUPLICATE KEY UPDATE userId = userId;
		`

	console.log('Query from query file: ', sqlQuery)
	return new Promise((resolve, reject) => {
		db.query(sqlQuery)
			.then((data) => {
				
				// send the res
				res.json('data inserted')
			}, (error) => {
				console.log(error)
			})
	})

}

module.exports.sendResponse = sendResponse