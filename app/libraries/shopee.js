const axios = require('axios');

class Shopee {
	constructor() {
		this.api = axios.create({
			baseURL: 'https://shopee.co.id/api'
		});
	}

	getItemByCategory(id) {
		return new Promise((resolve, reject) => {
			this.api.get('/v2/flash_sale/get_all_itemids', {params: { need_personalize: true, sort_soldout: true }}
			).then(response => {
				if (response.data !== undefined && response.data.data !== undefined) {
					var items = response.data.data.item_brief_list.map((item, index) => {
						if (item.catid == id && item.recommendation_info !== null) {
							var info = JSON.parse(item.recommendation_info);
							if (parseFloat(info.score.toFixed(2)) < 0.1) {
								return item.itemid;
							}
						}

						return false;
					});

					resolve(items.filter(Number));
				}
			}, reject);
		});
	}

	getProductItemsByCategory(category, limit = 12, itemids) {
		if (itemids == undefined) {
			itemids = '[]';
		} else if (typeof itemids == 'array') {
			itemids = JSON.stringify(itemids);
		}

		return new Promise((resolve, reject) => {
			this.api.post('/v2/flash_sale/flash_sale_batch_get_items', {
				categoryid: category,
				limit: limit,
				itemids: itemids,
				sort_soldout: true,
				need_personalize: true,
				with_dp_items: true
			}).then(response => { resolve(response.data.data.items) }, reject);
		});
	}

	getProductItem(item, shop) {
		return new Promise((resolve, reject) => {
			this.api.get('/v4/item/get', {
				params: {
					itemid: item,
					shopid: shop
				}
			}).then(response => { resolve(response.data.data) }, reject);
		});
	}
}

module.exports = Shopee;