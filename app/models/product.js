module.exports = function(DataTypes) {
	return {
	connections: [process.env.ACTIVE_DATABASE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			sha1: {
				type: DataTypes.STRING(40)
			},
			item_id: {
				type: DataTypes.BIGINT.UNSIGNED
			},
			shop_id: {
				type: DataTypes.BIGINT.UNSIGNED
			},
			name: {
				type: DataTypes.STRING(100)
			},
			real_price: {
				type: DataTypes.DOUBLE
			},
			discount: {
				type: DataTypes.DOUBLE
			},
			price_with_discount: {
				type: DataTypes.DOUBLE
			},
			image: {
				type: DataTypes.STRING(100)
			},
			date: {
				type: DataTypes.DATEONLY
			}
		},
		config: {}
	}
}