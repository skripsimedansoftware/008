var fs = require('fs');
var path = require('path');
var files = {};
var directory_target = __dirname;

fs.readdirSync(directory_target).filter(file => {
	if (path.basename(file).split('.').slice(0, -1).join('.') !== path.basename(__filename).split('.').slice(0, -1).join('.')) {
		return (file.slice(-3).match(/\.(js|ts)/));
	}
}).forEach(file => {
	Object.assign(files, {[path.basename(file).split('.').slice(0, -1).join('.')] : require(path.join(directory_target, file))});
});

module.exports = files;