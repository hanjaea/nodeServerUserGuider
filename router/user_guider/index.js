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

router.get('/list', function(req,res) {
	var id = req.user; 
	if(!id) res.render('login.ejs');
	res.render('user_guider.ejs');
})

// 모바일 폰에서 계속적으로 호출 하는 부분 상태값을 읽어 와 msg 및 이미지를 띄워주어야 함
router.get('/mlist', function(req,res) {
	var responseData = {};
	var state = 1

	/*
	var query = connection.query('select * from user_guider where state = ?', [state], function (err, rows) {
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
		conn.query("select * from user_guider where state = ?", [state], (err, rows) => {
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
router.get('/', function(req,res) {
	var responseData = {};

	/*
	var query = connection.query('select id, sno, gno, order_no, state, msg, img_nm from user_guider order by sno, order_no', function (err, rows) {
		if(err) throw err;
		if(rows.length) {
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
		conn.query("select id, sno, gno, order_no, state, msg, img_nm from user_guider order by sno, order_no", (err, rows) => {
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

// 2. /movie , POST
router.post('/', function(req,res){
	/*
	var title = req.body.title;
	var type = req.body.type;
	var grade = req.body.grade;
	var actor = req.body.actor;

	var sql = {title,type,grade,actor};
	var query = connection.query('insert into movie set ?', sql, function(err,rows) {
		if(err) throw err
		return res.json({'result' : 1});
	})
	*/

	var sno = req.body.sno;
	var gno = req.body.gno;
	var order_no = req.body.order_no;
	var state = req.body.state;
	var msg = req.body.msg;
	var img_nm = req.body.img_nm;

	console.log('post call', ' sno:' + sno + ' gno:' + gno + ' order_no:' + order_no + ' order_no:' + order_no + ' state : ' + state + ' msg:' + msg + ' img_nm : '+ img_nm);
	var sql = {
		sno,
		//gno,
		order_no,
		state,
		msg,
		img_nm
	};
	
	/*
	var query = connection.query('insert into user_guider set ?', sql, function (err, rows) {
		if (err) throw err
		return res.json({
			'result': 1
		});
	})
	*/

	let mydb = new Mydb(pool);
	mydb.executeTx(conn => {
		conn.query("insert into user_guider set ?'", sql, (err, ret) => {
			if (err) {
				conn.rollback();
				throw err;
			}

			conn.commit();
			return res.json({
				'result': 1
			});
		});
	})
	
})

router.put('/', function(req,res){
	var id = req.body.id;
	var sno = req.body.sno;
	var gno = req.body.gno;
	var order_no = req.body.order_no;
	var state = req.body.state;
	var msg = req.body.msg;
	var img_nm = req.body.img_nm;

	var sql_all = "UPDATE user_guider SET state = 0 ";
	//var query_all = connection.query(sql_all, function (err, rows) {
	//	if (err) throw err
		//return res.json({
		//	'result': 1
		//});
	//})

	var sql = "UPDATE user_guider SET sno = '"+ sno +"', gno = '" + gno + "', order_no = " + order_no + " , state = " + state + ", msg = '" + msg + "', img_nm = '" + img_nm +"' WHERE id = " + id;
	console.log(sql);
	console.log('put call', 'id:' + id + ' sno:' + sno + ' gno:' + gno + ' order_no:' + order_no + ' order_no:' + order_no + ' msg:' + msg + ' state : ' + state + ' img_nm : ' + img_nm);
	/*
	var query = connection.query(sql, function (err, rows) {
		if (err) throw err
		return res.json({
			'result': 1
		});
	})
	*/

	let mydb = new Mydb(pool);
	mydb.executeTx(conn => {
		conn.query(sql, (err, ret) => {
			if (err) {
				conn.rollback();
				throw err;
			}

			//res.json(ret.affectedRows);
			conn.commit();
			return res.json({
				'result': 1
			});
		});
	});

})


// 3. /movie/:title , GET
router.get('/:id', function(req,res) {
	var id = req.params.id;

	var responseData = {};

	/*
	var query = connection.query('select * from user_guider where id =?', [id], function (err, rows) {
		if(err) throw err;
		if(rows[0]) {
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
		conn.query("select * from user_guider where id =?", [id], (err, rows) => {
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


// 4. /movie/:title , DELETE
router.delete('/', function(req,res) {
	var id = req.body.id;

	console.log('delete call', 'id:' + id );
	
	var responseData = {};

	/*
	var query = connection.query('delete from user_guider where id =?', [id], function (err, rows) {
		if(err) throw err;
		return res.json({
			'result': 1
		});
	})
	*/


	let mydb = new Mydb(pool);
	mydb.executeTx(conn => {
		conn.query("delete from user_guider where id =?", [id], (err, ret) => {
			if (err) {
				conn.rollback();
				throw err;
			}

			conn.commit();
			return res.json({
				'result': 1
			});
		});
	})

	
})


module.exports = router;
