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
const fs = require('fs');

global.CONSTANTS = {
	BASE_PATH: __dirname,
	PUBLIC_PATH: __dirname+'/public/'
}

global.Config = require(__dirname+'/app/config');
global.Helpers = require(__dirname+'/app/helpers');
global.Libraries = require(__dirname+'/app/libraries');
global.Middlewares = require(__dirname+'/app/middlewares');

function initDB() {
	return new Promise(async (resolve, reject) => {
		var DATABASE = require(__dirname+'/database.json');
		var ACTIVE_DATABASE = DATABASE[process.env.ACTIVE_DATABASE];
		if (ACTIVE_DATABASE.dbdriver.toLowerCase().match(/(mongo|mongodb)/)) {
			const MongoDB = require('mongodb').MongoClient;
			if (ACTIVE_DATABASE.dsn !== '') {
				const DBConfig = new MongoDB(ACTIVE_DATABASE.dsn, { useUnifiedTopology: true });
				DBConfig.connect().then(connection => resolve({driver: 'mongodb', active_database: ACTIVE_DATABASE, connection: connection}), error => reject(error));
			} else {
				const DBConfig = new MongoDB('mongodb://'+ACTIVE_DATABASE.host+':'+ACTIVE_DATABASE.port, { useUnifiedTopology: true });
				DBConfig.connect().then(connection => resolve({driver: 'mongodb', active_database: ACTIVE_DATABASE, connection: connection}), error => reject(error));
			}
		} else if (ACTIVE_DATABASE.dbdriver.toLowerCase().match(/(mysqli?)/)) {
			const Sequelize = Libraries.sequelize;
			const sequelize = new Sequelize.Sequelize(ACTIVE_DATABASE.database, ACTIVE_DATABASE.username, ACTIVE_DATABASE.password, {
				host: ACTIVE_DATABASE.host,
				dialect: ACTIVE_DATABASE.dbdriver
			});

			resolve({driver: 'sequelize', active_database: ACTIVE_DATABASE, connection: sequelize});
		}
	});
}

async.waterfall([
	function (callback) {
		if (process.env.ENABLE_DATABASE == 'YES') {
			initDB().then(connection => callback(null, connection), error => callback(error)); // Initialize database config
		} else {
			callback(null);
		}
	},
	function(params, callback) {
		if (process.env.ENABLE_DATABASE == 'YES') {
			if (params.active_database.driver == 'mongodb') {
				callback(null, {database: params.connection.db(params.active_database.database)}); // Activation current database
			} else {
				callback(null, {database: params.connection}); // Activation current database
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
			global.DB = result.database;
			global.Models = require(__dirname+'/app/models');

			Object.keys(Models).forEach((model) => {
				DB.define(model, Models[model], {
					freezeTableName: true,
					createdAt: 'created_at',
					updatedAt: 'updated_at'
				});
			});

			(async () => {
				await DB.sync({ force: process.env.INITIALIZE_DB });
			})();

			if (process.env.INITIALIZE_DB) {
				var file_content = fs.readFileSync(CONSTANTS.BASE_PATH+'/.env', 'utf8');
				process.env.INITIALIZE_DB = false;
				file_content = file_content.replace('INITIALIZE_DB = true', 'INITIALIZE_DB = false');
				fs.writeFileSync(CONSTANTS.BASE_PATH+'/.env', file_content);
			}
		}
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