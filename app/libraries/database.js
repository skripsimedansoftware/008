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
		const MongoDB = require('mongodb').MongoClient;
		if (this.active_database.dsn !== '') {
			const DBConfig = new MongoDB(this.active_database.dsn, { useUnifiedTopology: true });
			DBConfig.connect().then(connection => resolve({ driver: 'mongodb', active_database: this.active_database, connection: connection })).catch(reject);
		} else {
			const DBConfig = new MongoDB('mongodb://'+this.active_database.host+':'+this.active_database.port, { useUnifiedTopology: true });
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

			resolve({driver: 'rethinkdb', active_database: this.active_database, connection: connection});
		});
	}

	async sequelize(resolve, reject) {
		const mysql = require('mysql2/promise');
		const { host, port, username, password, database, dbdriver } = this.active_database;
		const temp_connection = await mysql.createConnection({ host, port, user:username, password });
		await temp_connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

		const { Sequelize, Op, Model, DataTypes } = require('sequelize');
		const connection = new Sequelize.Sequelize(database, username, password, {
			host: host,
			port: (port !== 3306)?port:3306,
			dialect: dbdriver,
			logging: false
		});

		resolve({ driver: 'sequelize', active_database: this.active_database, connection: { connection, Sequelize, Op, Model, DataTypes } });
	}
}

module.exports = Database;