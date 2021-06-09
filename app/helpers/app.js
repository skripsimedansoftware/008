
/**
 * Sleep
 *
 * @param      {integer}   ms      The milliseconds
 * @return     {promise}
 */
module.exports.sleep = function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Callback function
 *
 * @param      {(function|string)}  callback  The callback
 */
module.exports.callback = function(callback) {
	if (callback !== undefined) {
		if (typeof callback == 'function') {
			callback(...Array.prototype.slice.call(arguments, 1));
		} else {
			eval(callback+'(...Array.prototype.slice.call(arguments, 1))');
		}
	}
}