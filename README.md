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
### Database Config

**example using mongodb driver**

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

**example using sequelize driver**

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