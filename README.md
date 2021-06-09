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

ACTIVE_DATABASE = default
```
### Database Config

```json
{
	"default": {
		"dsn": "",
		"host": "localhost",
		"port": 27017,
		"username": "admin",
		"password": "",
		"database": "express_starter",
		"dbprefix": "",
		"db_debug": false,
		"dbdriver": "mongo",
		"char_set": "utf8",
		"dbcollat": "utf8_general_ci"
	}
}
```