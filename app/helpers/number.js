
/**
 * Random integer
 *
 * @param      {number}  min     The minimum
 * @param      {number}  max     The maximum
 * @return     {integer}
 */
module.exports.random_integer = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}