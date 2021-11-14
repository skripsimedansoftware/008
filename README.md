# ExpressJs Starter

### [DotEnv](https://github.com/motdotla/dotenv#rules)

```text
# Application setting

APP_ENV = development
APP_NAME = ExpressJs Starter
APP_VENDOR = MedanSoftware

# Port setting

HTTP_PORT = 8080
HTTPS_PORT = 8081

# Security setting

ENCRYPTION_KEY = MedanSoftware

# Database

INITIALIZE_DB = true
ENABLE_DATABASE = YES
ACTIVE_DATABASE = default
```

## Installation

```bash
git clone https://github.com/medansoftware/Express-Starter.git
```

```bash
npm install
```

### Install Driver for NoSQL Database

**MongoDB**

```bash
npm run with-mongodb
```

**RethinkDB**

```bash
npm run with-rethinkdb
```

### Install Driver for SQL Database

**MySQL**

```bash
npm run sequelize-mysql
```

**SQLite**

```bash
npm run sequelize-sqlite
```

**PostgreSQL**

```bash
npm run sequelize-postgre
```

### Database Config

**example config for mongodb driver**

```json
{
	"default": {
		"dsn": "",
		"host": "localhost",
		"port": 27017,
		"username": "admin",
		"password": "",
		"database": "express-starter",
		"dbprefix": "",
		"db_debug": false,
		"dbdriver": "mongo",
		"char_set": "utf8mb4",
		"dbcollat": "utf8mb4_unicode_ci"
	}
}
```

**example config for rethinkdb driver**

```json
{
	"default": {
		"dsn": "",
		"host": "localhost",
		"port": 27017,
		"username": "admin",
		"password": "",
		"database": "express-starter",
		"dbprefix": "",
		"db_debug": false,
		"dbdriver": "mongo",
		"char_set": "utf8mb4",
		"dbcollat": "utf8mb4_unicode_ci"
	}
}
```

**example config for sequelize driver**

```json
{
	"default": {
		"dsn": "",
		"host": "localhost",
		"port": 3306,
		"username": "root",
		"password": "",
		"database": "express-starter",
		"dbprefix": "",
		"db_debug": false,
		"dbdriver": "mysql",
		"char_set": "utf8mb4",
		"dbcollat": "utf8mb4_unicode_ci"
	}
}
```

### Initialize other database with database group name

```javascript
var database2 = new Libraries.database('other_database_group');
database2.init().then(({ driver, active_database, connection }) => {
	console.log('connected using ', driver);
	console.log('connected database ', active_database);
	console.log('DB connection ', connection);
}).catch(console.log); // Initialize database config
```

### Database Models

**example model for sequelize**

```javascript
module.exports = {
	connections: [process.env.ACTIVE_DATABASE, 'database_backup', ...],
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
	config: {
		tableName: 'user_table'
	}
}
```

```javascript
Models.user.create({
	email: 'medansoftware.com@gmail.com',
	username: 'medansoftware',
	password: 'medansoftware',
	full_name: 'Medan Software'
}).then(created => {
	res.json(created)
}, ({ name, original }) => {
	res.json({ error: {
		code: original.code,
		message: original.sqlMessage
	}})
});
```

```javascript
Models.user.create({
	email: 'medansoftware.com@gmail.com',
	username: 'medansoftware-this-car-more-than-column-length',
	password: 'medansoftware',
	full_name: 'Medan Software'
}).then(created => {
	res.json(created)
}, ({ name, original }) => {
	res.json({ error: {
		code: original.code,
		message: original.sqlMessage
	}})
});
```