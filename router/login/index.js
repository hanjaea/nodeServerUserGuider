var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')
var path = require('path')
const Pool = require('../../pool');
var pool = new Pool();
const Mydb = require('../../mydb');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
//var DB = require('../../components/dataBaseConnectionPool');
//var pool = require('../../components/dataBaseConnectionPool');

/*
var pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'han1024',
	database: 'subwaypop',
	multipleStatements: true,
	connectionLimit: 5,
	waitForConnections: false
});
*/

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

/*
var pool  = mysql.createPool({
  host: 'remotemysql.com',
  user: 'eNL1jzzPUp',
  password: 'j2aHzyhilr',
  database: 'eNL1jzzPUp'
});
*/

router.get('/', function(req,res) {
	var msg;
	var errMsg = req.flash('error')
	if(errMsg) msg = errMsg;
	res.render('login.ejs', {'message' : msg});
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

passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
	  passwordField: 'password',
	  passReqToCallback : true
	}, function(req, email, password, done) {

		let mydb = new Mydb(pool);
		mydb.execute(conn => {
			conn.query("select * from user where email=?", [email],(err, rows) => {
				if(err) return done(err);

				if(rows.length) {
					return done(null, {'email' : email, 'id' : rows[0].UID})
				} else {
						return done(null, false, {'message' : 'Incorrect email or password'})
				}
			});
		});

	}
));


router.post('/', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if(err) res.status(500).json(err);
		if (!user) return res.status(401).json(info.message);

		req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
    });

	})(req, res, next);
})


module.exports = router;
