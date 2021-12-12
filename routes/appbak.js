var express = require('express');
var router = express.Router();
var sha1 = require('crypto-js/sha1');
var moment = require('moment');
var architect = require('neataptic').architect;

router.get('/', async function(req, res) {
	res.render('index', { title: Config.app.name, products: await Models.product.findAll()});
}).get('/fetch', async function(req, res) {

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

	res.json(products);
})
.get('/manipulation', function(req, res) {
	res.render('manipulation', { title: Config.app.name});
})
.get('/train', function(req, res) {
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
			where: {
				item_id: product.item_id
			}
		});

		var neural_network = new Libraries['neural-network'](4, 2, {
			// learningRate: 2,
			// hiddenLayers: { num: 1, size: [10, 14, 19] }
			// hiddenLayerNum: 2,
			// hiddenLayerSize: 10
		});

		var train_data = samples.map((item, key) => {
			return {
				input: [
					parseFloat(item.discount),
					parseFloat(item.price_with_discount),
					parseFloat(item.date_day),
					parseFloat(item.date_month)],
				output: [parseFloat(item.price_with_discount), parseFloat(item.discount)]
			};
		});

		neural_network.learn(train_data);
		var result = neural_network.predict([ 45, 197945, 11, 10 ]);

		console.log(result)

		// samples.forEach((item, key) => {
		// 	var  prediction = {
		// 		input: [
		// 			parseFloat(item.discount),
		// 			parseFloat(item.price_with_discount),
		// 			parseFloat(item.date_day),
		// 			parseFloat(item.date_month)]
		// 	};
		// 	var result = neural_network.predict(prediction.input);
		// 	console.log(result, item.discount, prediction.input)
		// });
	});
}).get('/nice_date/:nice', async function(req, res) {
	var products = await Models.product.findAll();
	products = Helpers.array.shuffle(products);
	res.render('index', { title: Config.app.name, products: products});
}).get('/nice_time/:nice', async function(req, res) {
	var products = await Models.product.findAll();
	products = Helpers.array.shuffle(products);
	res.render('index', { title: Config.app.name, products: products});
}).get('/prediction/:id', async function(req, res) {
	var product = await Models.product.findOne({ where: { id: req.params.id } });
	var shopee = new Libraries.shopee;

	var samples = await Models['sample-data'].findAll({
		where: {
			item_id: product.item_id
		}
	});

	var neural_network = new Libraries['neural-network'](2, 2, {
		learningRate: 1000,
		// hiddenLayers: { num: 1, size: [10, 14, 19] }
		// hiddenLayerNum: 2,
		// hiddenLayerSize: 10
	});

	var train_data = samples.map((item, key) => {
		return {
			input: [
				parseFloat(item.discount),
				parseFloat(item.price_with_discount),
				// parseFloat(item.date_day),
				// parseFloat(item.date_month)
			],
			output: [parseFloat(item.price_with_discount), parseFloat(item.discount)]
		};
	});

	neural_network.learn(train_data);
	var result = neural_network.predict([ product.discount, product.price_with_discount]);
	console.log(neural_network)

	var network = new architect.Perceptron(4, 10, 2);
var error = 0.001;
var iterations = 5000;
var rate = 0.05;
network.train(myTrainingSet,{
log: 500,
error: error,
iterations: iterations,
rate: rate
});

	res.json({});

	// var info = await shopee.getProductItem(product.item_id, product.shop_id);
	// res.render('prediction', { title: Config.app.name, product: product, neural_network: neural_network, prediction: result});
});

module.exports = router;