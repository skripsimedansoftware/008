const axios = require('axios');

class Shopee {
	constructor() {
		this.api = axios.create({
			baseURL: 'https://shopee.co.id/api/v2'
		});
	}

	getItemByCategory(id) {
		var items = new Array();shopee
		return new Promise((resolve, reject) => {
			this.api.get('/flash_sale/get_all_itemids', {
				need_personalize: true,
				sort_soldout: true
			}).then(response => {
				if (response.data !== undefined && response.data.data !== undefined) {
					response.data.data.item_brief_list.forEach((item, index) => {
						id = (id == null | id == undefined)?13:id;
						if (item.catid == 13) {
							items.push(item.itemid);
						}

						if ((index+1) === response.data.data.item_brief_list.length) {
							resolve(items);
						}
					});
				}
			}, reject);
		});
	}

	getProductItems(category, limit = 12, itemids) {
		if (itemids == undefined) {
			itemids = '[]';
		} else if (typeof itemids == 'array') {
			itemids = JSON.stringify(itemids);
		}

		return new Promise((resolve, reject) => {
			this.api.post('/flash_sale/flash_sale_batch_get_items', {
				categoryid: category,
				limit: limit,
				itemids: itemids,
				sort_soldout: true,
				need_personalize: true,
				with_dp_items: true
			}).then(response => { resolve(response.data.data.items) }, reject);
		});
	}
}

module.exports = Shopee;