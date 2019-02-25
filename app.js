const express = require('express');
const app = express();
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressValidator = require('express-validator');
const flash = require('express-flash');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config');
const users = require('./routes/users');

app.use(expressMongoDb(config.database.url));
app.set('view engine', 'ejs');
app.use(expressValidator());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(methodOverride( function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		const method = req.body._method 
		delete req.body._method 
		return method
	}
}))
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUnintialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash());
app.use('/', users);
app.use('/users', users);
app.listen(9000, function () {
	console.log('berjalan di port 9000');
});