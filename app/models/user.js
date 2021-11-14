module.exports = function(DataTypes) {
	return {
	connections: [process.env.ACTIVE_DATABASE],
		fields: {
			id: {
				type: DataTypes.BIGINT.UNSIGNED,
				primaryKey: true,
				autoIncrement: true
			},
			email: {
				type: DataTypes.STRING(80)
			},
			username: {
				type: DataTypes.STRING(16)
			},
			password: {
				type: DataTypes.STRING(40)
			},
			full_name: {
				type: DataTypes.STRING(60)
			}
		},
		config: {}
	}
}