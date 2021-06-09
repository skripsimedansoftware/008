
/**
 * Check is valid JSON
 *
 * @param      {string|object}   StrOrObject  The string or object
 * @return     {boolean}
 */
module.exports.is_valid_json = function(StrOrObject) {
	if (typeof StrOrObject == 'object') {
		return true;
	} else {
		try {
			var o = JSON.parse(StrOrObject);
			if (o && typeof o === "object") {
				return o;
			}
		} catch (e) {
			return false;
		}
	}
};

/**
 * Check is valid UTF8
 *
 * @param      {string}   text    The text
 * @return     {boolean}
 */
module.exports.is_valid_utf8 = function(text) {
	try {
		decodeURIComponent(escape(text));
		return true;
	} catch(e) {
		return false;
	}
}