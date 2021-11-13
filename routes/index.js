var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index', { title: Config.app.name });
});

module.exports = router;