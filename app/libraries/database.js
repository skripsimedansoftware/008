class Database {
	constructor(group) {
		if (group !== undefined) {
			if (Object.keys(CONSTANTS.DB_CONFIG).indexOf(group) !== -1) {
				this.active_database = CONSTANTS.DB_CONFIG[group];
			}
		} else {
			this.active_database  = CONSTANTS.DB_CONFIG[process.env.ACTIVE_DATABASE];
		}
	}

	init(group) {
		return new Promise(async (resolve, reject) => {
			if (this.active_database.dbdriver.toLowerCase().match(/(mongo|mongodb)/)) {
				this.mongodb(resolve, reject);
			} else if (this.active_database.dbdriver.toLowerCase().match(/(rethinkdb)/)) {
				this.rethinkdb(resolve, reject);
			} else if (this.active_database.dbdriver.toLowerCase().match(/(mysqli?)/)) {
				this.sequelize(resolve, reject);
			}
		});
	}

	mongodb(resolve, reject) {
		const { MongoClient } = require('mongodb');
		if (this.active_database.dsn !== '') {
			const DBConfig = new MongoClient(this.active_database.dsn, { useUnifiedTopology: true });
			DBConfig.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		} else {
			const DBConfig = new MongoClient('mongodb://'+this.active_database.host+':'+this.active_database.port, { useUnifiedTopology: true });
			DBConfig.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		}
	}

	rethinkdb(resolve, reject) {
		r = require('rethinkdb');
		r.connect({
			host: this.active_database.host,
			port: this.active_database.port,
			user: this.active_database.username,
			password: this.active_database.password,
			db: this.active_database.password
		}, (error, connection) => {
			if (error) {
				reject(error);
			}

			resolve({ driver: 'rethinkdb', active_database: this.active_database, connection: connection });
		});
	}

	sequelize(resolve, reject) {
		const mysql = require('mysql2/promise');
		const { host, port, username, password, database, dbdriver } = this.active_database;
		mysql.createConnection({ host, port, user:username, password }).then((temp) => {
			temp.connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`).then((result) => {
				const { Sequelize, Op, Model, DataTypes } = require('sequelize');
				const connection = new Sequelize.Sequelize(database, username, password, {
					host: host,
					port: (port !== 3306)?port:3306,
					dialect: dbdriver,
					logging: this.active_database.db_debug
				});

				const models = require(CONSTANTS.BASE_PATH+'/app/models');

				Object.keys(models).forEach((model) => {
					var name = model;
					model = models[model](DataTypes);
					if (model.connections !== undefined && model.connections.indexOf(process.env.ACTIVE_DATABASE) !== -1) {
						const dbprefix = (this.active_database.dbprefix !== undefined && this.active_database.dbprefix !== '')?this.active_database.dbprefix:'';
						connection.define(name, model.fields, Object.assign({
							tableName: dbprefix+name,
							freezeTableName: true,
							createdAt: 'created_at',
							updatedAt: 'updated_at'
						}, model.config));
					}
				});

				(async () => {
					await connection.sync({ force: Helpers.string.to_boolean(process.env.INITIALIZE_DB) });
				})();

				global.Models = Object.assign(connection.models, global.Models);

				resolve({ driver: 'sequelize', active_database: this.active_database, connection: { connection, Sequelize, Op, Model, DataTypes } });
			}, ({ code }) => reject('DATABASE ERROR : '+code));
		}).catch(({ code, errno, sqlState }) => {
			reject('DATABASE ERROR : '+code)
		});
	}
}

module.exports = Database;