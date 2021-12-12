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
const hbs = require('hbs');
const http = require('http').Server(app);
const fs = require('fs');
const io = require('socket.io')(http);
const cron = require('node-cron');

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

async function autoFetch() {
	var shopee = new Libraries.shopee;
	var itemsCategory = await shopee.getItemByCategory(13);
	var products = await  shopee.getProductItemsByCategory(13, itemsCategory.length, itemsCategory);

	var date = new Date();

	products.forEach(async (item, index) => {
		var sha1_data = sha1(JSON.stringify({id: item.itemid, discount: item.raw_discount, price: item.price})).toString();
		var find = await Models.product.findAll({
			where: {sha1: sha1_data}
		});

		if (find.length == 0) {
			Models.product.create({
				sha1: sha1_data,
				item_id: item.itemid,
				shop_id: item.shopid,
				name: item.name,
				real_price: (item.price_before_discount/100000),
				discount: item.raw_discount,
				price_with_discount: (item.price/100000),
				image: item.promo_images[0], //https://cf.shopee.co.id/file/<image>_tn
				date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
			});
		}
	});
}

cron.schedule('00 00 00 * * *', () => {
	autoFetch();
}, {
	scheduled: true,
	timezone: "Asia/Jakarta"
});

cron.schedule('00 00 12 * * *', () => {
	autoFetch();
}, {
	scheduled: true,
	timezone: "Asia/Jakarta"
});

cron.schedule('00 00 20 * * *', () => {
	autoFetch();
}, {
	scheduled: true,
	timezone: "Asia/Jakarta"
});

/**
 *
 * Data Manipulator
 *
 *
var moment = require('moment');
var date = moment().month(9).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);

for (i = 0; i < 1500; i ++) {
	date.add(1, 'hour');
	var match_hours = ['00', '12', '13', '20'];

	var matches_time = (date.format('MM') == date.format('DD'));
	var matches_hour = (match_hours.indexOf(date.format('HH')) !== -1);

	// debug : console.log(date.format('YYYY-MM-DD HH'));

	products.forEach((item, index) => {
		if (matches_time) {

		} else {
			if (matches_hour) {

			}
		}
	});
}
*/

io.on('connection', (socket) => {
	socket.on('make_train_data', async () => {
		var moment = require('moment');
		var date = moment().month(9).date(1).hours(0).minutes(0).seconds(0).milliseconds(0);
		Models.product.findAll().then(products => {
			for (i = 0; i < 1500; i ++) {
				date.add(1, 'hour');
				var match_hours = ['00', '12', '13', '20'];
				var matches_time = (date.format('MM') == date.format('DD'));
				var matches_hour = (match_hours.indexOf(date.format('HH')) !== -1);

				// debug : console.log(date.format('YYYY-MM-DD HH'));

				products.forEach(async (item, index) => {
					var real_price = item.real_price;
					var discount = 0;
					var price_with_discount = real_price;
					if (matches_time) {
						var matches_for = Helpers.array.random(['time', 'hour']);
						if (matches_for == 'time') {
							discount = Helpers.number.random_integer(60, 99);
						} else {
							discount = Helpers.number.random_integer(2, 80);
						}

						var data = {
							item_id: item.item_id,
							real_price: item.real_price,
							discount: discount,
							price_with_discount: (item.real_price-(discount/100)*item.real_price),
							date_day: date.format('DD'),
							date_month: date.format('MM'),
							time_hour: date.format('HH')
						};

						// console.log('matches-time', data);
						Models['sample-data'].create(data);
					} else {
						if (matches_hour) {
							discount = Helpers.number.random_integer(2, 60);
							var data = {
								item_id: item.item_id,
								real_price: item.real_price,
								discount: discount,
								price_with_discount: (item.real_price-(discount/100)*item.real_price),
								date_day: date.format('DD'),
								date_month: date.format('MM'),
								time_hour: date.format('HH')
							};

							// console.log('matches-hour', data);
							Models['sample-data'].create(data);
						}
					}
				});
			}

			socket.emit('make_train_data');
		});
	});

	socket.on('make_test_data', () => {

	});
});


hbs.registerHelper('times', function(n, block) {
	var accum = '';
	for (var i = 0; i < n; ++i)
		accum += block.fn(i);
	return accum;
});

hbs.registerHelper('for', function(from, to, incr, block) {
	var accum = '';
	for (var i = from; i < to; i += incr)
	accum += block.fn(i);
	return accum;
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