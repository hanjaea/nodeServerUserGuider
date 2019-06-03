var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
const Pool = require('../../pool');
const pool = new Pool();
const Mydb = require('../../mydb');

// DATABASE SETTING
/*
const connection = mysql.createConnection({
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
	port: 3306,
	user: 'bJFYkTuF1D',
	password: 'WjQ3wFjgJG',
	database: 'bJFYkTuF1D'
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

/*
var connection = mysql.createConnection({
	host: '121.254.168.70',
	port: 3306,
	user: 'jobtest',
	password: 'jobtest1234!',
	database: 'jobdb'
})
*/

//connection.connect()

router.get('/list', function(req,res) {
	res.render('beacon.ejs');
})

// 모바일 폰에서 계속적으로 호출 하는 부분 상태값을 읽어 와 msg 및 이미지를 띄워주어야 함
router.get('/mlist', function(req,res) {
	var responseData = {};
	var state = 1

	//var query = connection.query('select * from beacon_list where state = ?', [state], function (err, rows) {
	/*
	var query = connection.query('select * from beacon_list', function (err, rows) {
		if (err) throw err;
		if (rows[0]) {
			responseData.result = 1;
			responseData.data = rows;
		} else {
			responseData.result = 0;
		}
		res.json(responseData)
	})
	*/

	let mydb = new Mydb(pool);
	mydb.execute(conn => {
		conn.query("select * from beacon_list",  (err, rows) => {
			//res.json(ret);
			if (err) throw err;
			if (rows[0]) {
				responseData.result = 1;
				responseData.data = rows;
			} else {
				responseData.result = 0;
			}
			res.json(responseData)
		});
	});
})


// 1. /movie , GET
router.get('/', function (req, res) {
	var responseData = {};

	var sql = "select id, " +
					" CASE WHEN user_type = 0 THEN '일반인' " + 
					" 	   WHEN user_type = 1 THEN '지체장애' " +
					"      WHEN user_type = 2 THEN '시각장애' " +
					"      WHEN user_type = 3 THEN '청각장애' " +
					"      WHEN user_type = 4 THEN '언어장애' " +
					" ELSE '일반인' END AS user_type ," +
					"user_key, " + 
					"major, " +
					"minor, " +
					"rssi, " +
					"DATE_FORMAT(up_dt,'%Y-%m-%d %H:%i:%s') as up_dt " +
				"from beacon_list order by id desc ";

	let mydb = new Mydb(pool);
	mydb.execute(conn => {
		conn.query(sql, (err, rows) => {
			if (err) throw err;
			if (rows[0]) {
				responseData.result = 1;
				responseData.data = rows;
			} else {
				responseData.result = 0;
			}
			res.json(responseData)
		});
	});
})

// 실제 안드로이드 폰에서 던졌을 때 받는 부분 
router.get('/senddata', function (req, res) {
	//console.log("~~~ /senddata jsonStr");

	//req.query.id
	//console.log(req.query.jsonStr);
	var jsonStr = req.query.jsonStr;
	var jsonObj = JSON.parse(jsonStr);
	
	var user_type = jsonObj.user_type;
	var user_key = jsonObj.user_key;
	var beaconStr = jsonObj.beacon_data;

	var beaconObj = JSON.parse(beaconStr);
	var major = beaconObj.major;
	var minor = beaconObj.minor;
	var rssi = beaconObj.rssi;
	var created = new Date();

	//console.log('senddata call', ' user_type:' + user_type + ' user_key:' + user_key + ' major:' + major + ' minor:' + minor + ' rssi : ' + rssi);
	var sql = {
		user_type,
		user_key,
		major,
		minor,
		rssi
	};

	/*
	var query = connection.query('insert into beacon_list set ?', sql, function (err, rows) {
		if (err) {
			return res.json({
				'result': 0
			});
		}else{
			return res.json({
				'result': 1
			});
		}
	})
	*/

	let mydb = new Mydb(pool);
	mydb.executeTx(conn => {
		conn.query("insert into beacon_list set ?'", sql, (err, rows) => {
			if (err) {
				conn.rollback();
				return res.json({
					'result': 0
				});
			}

			conn.commit();
			return res.json({
				'result': 1
			});
		});
	})
})



module.exports = router;
