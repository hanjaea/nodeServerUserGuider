var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const rest = require('./rest');
const Pool = require('./pool');
const pool = new Pool();
const Mydb = require('./mydb');
var router = require('./router/index')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash')
var methodOverride = require('method-override');

app.listen(3000, function() {
	console.log("start, express server on port 3000");
});

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}))


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
})


app.use(bodyParser.json({
    limit: '10mb'
}))

app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
 
app.use(router)

























