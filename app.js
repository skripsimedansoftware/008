require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const async = require('async');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const app = express();

global.CONSTANTS = {
	BASE_PATH: __dirname,
	PUBLIC_PATH: __dirname+'/public/'
}

global.Config = require(__dirname+'/app/config');
global.Helpers = require(__dirname+'/app/helpers');
global.Libraries = require(__dirname+'/app/libraries');
global.Middlewares = require(__dirname+'/app/middlewares');

function initDB() {
	return new Promise((resolve, reject) => {
		var DATABASE = require(__dirname+'/database.json');
		var ACTIVE_DATABASE = DATABASE[process.env.ACTIVE_DATABASE];
		if (ACTIVE_DATABASE.dbdriver.toLowerCase().match(/(mongo|mongodb)/)) {
			const MongoDB = require('mongodb').MongoClient;
			if (ACTIVE_DATABASE.dsn !== '') {
				const DBConfig = new MongoDB(ACTIVE_DATABASE.dsn, { useUnifiedTopology: true });
				DBConfig.connect().then(connection => resolve({active_database: ACTIVE_DATABASE, connection: connection}), error => reject(error));
			} else {
				const DBConfig = new MongoDB('mongodb://'+ACTIVE_DATABASE.host+':'+ACTIVE_DATABASE.port, { useUnifiedTopology: true });
				DBConfig.connect().then(connection => resolve({active_database: ACTIVE_DATABASE, connection: connection}), error => reject(error));
			}
		}
	});
}

async.waterfall([
	function (callback) {
		initDB().then(connection => callback(null, connection), error => callback(error)); // Initialize database config
	},
	function(params, callback) {
		callback(null, {database: params.connection.db(params.active_database.database)}); // Activation current database
	},
], function (error, result) {
	if (error) {
		console.log(error);
		process.exit(0);
	} else {
		global.DB = result.database;
		global.Models = require(__dirname+'/app/models');
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(session({
	secret: process.env.ENCRYPTION_KEY,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin : (origin, callback) => { callback(null, true) }, credentials: true }));
app.use(cookieParser());
app.use(express.static(CONSTANTS.PUBLIC_PATH));

app.use('/', require(__dirname+'/routes/index'));
app.use('/users', require(__dirname+'/routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(process.env.HTTP_PORT || 3000);