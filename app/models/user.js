module.exports = {
	connections: [process.env.ACTIVE_DATABASE],
	fields: {
		id: {
			type: DB.DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: DB.DataTypes.STRING(80)
		},
		username: {
			type: DB.DataTypes.STRING(16)
		},
		password: {
			type: DB.DataTypes.STRING(40)
		},
		full_name: {
			type: DB.DataTypes.STRING(60)
		}
	},
	config: {}
}