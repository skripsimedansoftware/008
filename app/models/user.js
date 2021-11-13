module.exports = {
	connections: [process.env.ACTIVE_DATABASE],
	fields: {
		id: {
			type: Libraries.sequelize.DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		email: {
			type: Libraries.sequelize.DataTypes.STRING(80)
		},
		username: {
			type: Libraries.sequelize.DataTypes.STRING(16)
		},
		password: {
			type: Libraries.sequelize.DataTypes.STRING(40)
		},
		full_name: {
			type: Libraries.sequelize.DataTypes.STRING(60)
		}
	},
	config: {}
}