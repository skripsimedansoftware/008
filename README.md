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

**Post**

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

### Database Models

**example model for sequelize driver**

```javascript
module.exports = {
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
```