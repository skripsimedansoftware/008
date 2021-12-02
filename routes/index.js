var express = require('express');
var router = express.Router();
var sha1 = require('crypto-js/sha1');
var moment = require('moment');

router.get('/', async function(req, res) {
	res.render('index', { title: Config.app.name, products: await Models.product.findAll()});

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
					discount = Helpers.number.random_integer(60, 99);
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
						discount = Helpers.number.random_integer(20, 50);
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
	});
}).get('/fetch', async function(req, res) {

	var shopee = new Libraries.shopee;
	var itemsCategory = await shopee.getItemByCategory(13);
	var products = await  shopee.getProductItemsByCategory(13, itemsCategory.length, itemsCategory);

	const date = new Date();

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

	res.json(products);
}).get('/train', function(req, res) {
	// res.render('index', { title: Config.app.name });
	res.json({});

	// Models['sample-data'].findAll({
	// 	limit: 10
	// }).then(samples => {
	// 	var train_data = new Array();
	// 	var neural_network = new Libraries['neural-network'](4, 1);

	// 	train_data = samples.map((item) => {
	// 		return { input: [parseFloat(item.discount), parseFloat(item.date_day), parseFloat(item.date_month), parseFloat(item.time_hour)], output: [parseFloat(item.discount)]  };
	// 	});

	// 	console.log(train_data)

	// 	neural_network.learn(train_data);

	// 	let result = neural_network.predict([ 28, 11, 11, 12 ]);

	// 	console.log(result)
	// });
	

	Models.product.findOne({}).then(async (product) => {
		var samples = await Models['sample-data'].findAll({
			limit: 10000,
			where: {
				item_id: product.item_id
			}
		});

		var neural_network = new Libraries['neural-network'](4, 1, {
			// learningRate: 2,
			// hiddenLayers: { num: 1, size: [10, 14, 19] }
			// hiddenLayerNum: 2,
			// hiddenLayerSize: 10
		});

		var train_data = samples.map((item, key) => {
			return { input: [parseFloat(item.discount), parseFloat(item.date_day), parseFloat(item.date_month), parseFloat(item.time_hour)], output: [parseFloat(item.discount)]  };
		});

		neural_network.learn(train_data);

		var  pp = { input: [61, 10, 10, 2], output: [61] };
		var result = neural_network.predict(pp.input);

		console.log(result)

		// console.log(neural_network.totalError(result, 61))
		console.log(neural_network.learnSingle(result.input, result.output))
	});
}).get('/nice_date/:nice', function(req, res) {
	res.render('index', { title: Config.app.name });
}).get('/nice_time/:nice', function(req, res) {
	res.render('index', { title: Config.app.name });
}).get('/prediction/:id', async function(req, res) {
	var product = await Models.product.findOne({ where: { id: req.params.id } });
	var shopee = new Libraries.shopee;
	var info = await shopee.getProductItem(product.item_id, product.shop_id);
	res.render('prediction', { title: Config.app.name, product: product, info: info});
});

module.exports = router;