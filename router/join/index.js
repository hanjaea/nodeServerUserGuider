var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
const Pool = require('../../pool');
var pool = new Pool();
const Mydb = require('../../mydb');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var DB = require('../../components/dataBaseConnectionPool');

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
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'han1024',
	database: 'subwaypop'
})
*/
//connection.connect()

router.get('/', function(req,res) {
	var msg;
	var errMsg = req.flash('error')
	if(errMsg) msg = errMsg;
	res.render('join.ejs', {'message' : msg});
})


//passport.serialize
passport.serializeUser(function(user, done) {
	console.log('passport session save : ', user.id)
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
	console.log('passport session get id: ', id)
	done(null, id);
})

passport.use('local-join', new LocalStrategy({
		usernameField: 'email',
	  passwordField: 'password',
	  passReqToCallback : true
	}, function(req, email, password, done) {

		let mydb = new Mydb(pool);
		mydb.execute(conn => {
			conn.query("select * from user where email=?", [email],(err, rows) => {
				if(err) return done(err);

				if(rows.length) {
					console.log('existed user')
					return done(null, {'email' : email, 'id' : rows[0].UID})
				} else {
					var sql = {email: email, pw:password};
					
					//let idb = new Mydb(pool);
					mydb.executeTx(conn => {
						conn.query("insert into user set ?", sql, (err, rows) => {
							if (err) {
								conn.rollback();
								throw err;
							}

							conn.commit();
							//return res.json({
							//	'result': 1
							//});
							return done(null, {'email' : email, 'id' : rows.insertId});
						});
					})
					  
					//return done(null, false, {'message' : 'Incorrect email or password'})
				}
			});
		});


	}
));

router.post('/', passport.authenticate('local-join', {
				successRedirect: '/main',
				failureRedirect: '/join',
				failureFlash: true })
)


// router.post('/', function(req,res){
// 	var body = req.body;
// 	var email = body.email;
// 	var name = body.name;
// 	var passwd = body.password;

// 	var sql = {email : email, name : name, pw : passwd};
// 	var query = connection.query('insert into user set ?' , sql,  function(err,rows) {
// 		 if(err) throw err
// 		 else res.render('welcome.ejs', {'name' : name, 'id':rows.insertId})
// 	})
// })

module.exports = router;
