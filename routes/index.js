var express = require('express');
var router = express.Router();
var sha1 = require('crypto-js/sha1');
var moment = require('moment');

router.get('/', function(req, res) {
	res.render('index', { title: Config.app.name });
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
});

module.exports = router;