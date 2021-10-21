const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:', {
	define: {
		freezeTableName: true
	}
});

module.exports = { Sequelize, Op, Model, DataTypes, sequelize };