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
			discount: {
				type: DataTypes.DOUBLE
			},
			price: {
				type: DataTypes.DOUBLE
			},
			date_day: {
				type: DataTypes.INTEGER(2)
			},
			date_month: {
				type: DataTypes.INTEGER(2)
			},
			time_hour: {
				type: DataTypes.INTEGER(2)
			}
		},
		config: {}
	}
}