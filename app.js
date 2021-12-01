require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const async = require('async');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const io = require('socket.io')(http);

global.r;
global.CONSTANTS = {
	BASE_PATH: __dirname,
	PUBLIC_PATH: __dirname+'/public/',
	DB_CONFIG: require(__dirname+'/database.json')
}
global.DB;
global.Models;
global.Config = require(__dirname+'/app/config');
global.Helpers = require(__dirname+'/app/helpers');
global.Libraries = require(__dirname+'/app/libraries');
global.Middlewares = require(__dirname+'/app/middlewares');

async.waterfall([
	function (callback) {
		if (process.env.ENABLE_DATABASE == 'YES') {
			var database = new Libraries.database;
			database.init().then(initialize_database => callback(null, initialize_database), error => callback(error)); // Initialize database config
		} else {
			callback(null);
		}
	},
	function(params, callback) {
		if (process.env.ENABLE_DATABASE == 'YES') {
			if (params.active_database.driver == 'mongodb') {
				callback(null, {driver: params.driver, active_database: params.active_database, database: params.connection.db(params.active_database.database)}); // Activation current database
			} else {
				callback(null, {driver: params.driver, active_database: params.active_database, database: params.connection}); // Activation current database
			}
		} else {
			if (typeof callback == 'function') {
				callback(null);
			} else {
				params(null);
			}
		}
	},
], function (error, result) {
	if (error) {
		console.log(error);
		process.exit(0);
	} else {
		if (process.env.ENABLE_DATABASE == 'YES') {
			DB = result.database; // define active database connection as global variable

			if (process.env.INITIALIZE_DB) {
				var file_content = fs.readFileSync(CONSTANTS.BASE_PATH+'/.env', 'utf8');
				process.env.INITIALIZE_DB = false;
				file_content = file_content.replace('INITIALIZE_DB = true', 'INITIALIZE_DB = false');
				fs.writeFileSync(CONSTANTS.BASE_PATH+'/.env', file_content);
			}
		}
	}
});

io.on('connection', (socket) => {
	socket.on('make_train_data', () => {

	});

	socket.on('make_test_data', () => {

	});
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

http.listen(process.env.HTTP_PORT || 3000);