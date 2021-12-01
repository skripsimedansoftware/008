module.exports = function(DataTypes) {
	return {
	connections: [process.env.ACTIVE_DATABASE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			item_id: {
				type: DataTypes.BIGINT.UNSIGNED
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
			date_day: {
				type: DataTypes.STRING(2)
			},
			date_month: {
				type: DataTypes.STRING(2)
			},
			time_hour: {
				type: DataTypes.STRING(2)
			}
		},
		config: {}
	}
}