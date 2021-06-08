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

Config = require(__dirname+'/app/config');
Models = require(__dirname+'/app/models');
Helpers = require(__dirname+'/app/helpers');
Libraries = require(__dirname+'/app/libraries');
Middlewares = require(__dirname+'/app/middlewares');
DB = {};

async.waterfall([
	/**
	 * Initialize database
	 */
	async function initializeDatabase(callback) {
		var ACTIVE_DATABASE = Config.database[process.env.ACTIVE_DATABASE];
		if (ACTIVE_DATABASE.dbdriver.toLowerCase().match(/(mongo|mongodb)/)) {
			const MongoDB = require('mongodb').MongoClient;
			const DBConfig = new MongoDB('mongodb://'+ACTIVE_DATABASE.host+':'+ACTIVE_DATABASE.port, { useUnifiedTopology: true });
			app.set('database', {
				database: ACTIVE_DATABASE.database,
				connection: await DBConfig.connect()
			});
		}
	},

	/**
	 * Activate database
	 */
	function activateDatabase(error, callback) {
		Object.assign(DB, app.get('database').connection.db(app.get('database').database));
		callback(null, callback);
	}
], (error) => {
	if (error) {
		console.log(error);
		process.exit(0);
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
app.use(express.static(path.join(__dirname, 'public')));

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