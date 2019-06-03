var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
const Pool = require('../../pool');
const pool = new Pool();
const Mydb = require('../../mydb');
//const mybatisMapper = require('mybatis-mapper');

// DATABASE SETTING
/*
var connection = mysql.createConnection({
	host: 'nodejs.cwqzngnparry.ap-northeast-2.rds.amazonaws.com',
	port: 3306,
	user: 'root',
	password: 'gkswodk1017311',
	database: 'nodejs'
})
*/

/*
var connection = mysql.createConnection({
	host: 'remotemysql.com',
	port : 3306,
	user: 'eNL1jzzPUp',
	password: 'j2aHzyhilr',
	database: 'eNL1jzzPUp'
})
*/

/*
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'han1024',
	database: 'subwaypop'
})
*/

//connection.connect()
/*
// create the myBatisMapper from xml file
mybatisMapper.createMapper('../../query/query.xml');

/*
// SQL Parameters
var param = {
    category : 'apple',
    price : 100
}

// Get SQL Statement
var format = {language: 'sql', indent: '  '};
var query = mybatisMapper.getStatement('fruit', 'testBasic', param, format);

// Do it!
connection.query(query, function(err, results, fields) {
  console.log(results);
  console.log(fields);
});
*/


//Router !!
router.post('/form', function(req,res) {
	res.render('email.ejs', {'email' : req.body.email})
})

router.post('/ajax', function(req, res){
	var email = req.body.email;
	var param = {
	    email : email
	}
	var responseData = {};
/*
	// Get SQL Statement
	var format = {language: 'sql', indent: '  '};
	var query = mybatisMapper.getStatement('query', 'testQuery', param, format);

	// Do it!
	connection.query(query, function(err, results, fields) {
	  console.log(results);
	  console.log(fields);
	});
*/

/*
	var query = connection.query('select name from user where email=?"' ,[email], function (err, rows) {
		if(err) throw err;
		if(rows[0]) {
			console.log(rows);
			responseData.result = "ok";
			responseData.name= rows[0].name;
		} else {
			responseData.result = "none";
			responseData.name= "";
		}
		res.json(responseData)
	})
	*/

	let mydb = new Mydb(pool);
	mydb.execute(conn => {
		conn.query("select name from user where email  = ?", [email], (err, rows) => {
			//res.json(ret);
			if (err) throw err;
			if (rows[0]) {
				console.log(rows);
				responseData.result = "ok";
				responseData.name = rows[0].name;
			} else {
				responseData.result = "none";
				responseData.name = "";
			}
			res.json(responseData)
		});
	});
 
})

module.exports = router;
