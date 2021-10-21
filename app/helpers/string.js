
/**
 * String to boolean
 *
 * @param      {string}  str     String
 * @return     {boolean}
 */
module.exports.to_boolean = function(str) {
	switch(str.toLowerCase().trim()) {
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": case null: return false;
		default: return Boolean(str);
	}
}