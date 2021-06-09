
/**
 * Format date
 *
 * @param      {integer}	date     The date
 * @param      {string}		month    The month
 * @param      {integer}	year     The year
 * @param      {integer}	hours    The hours
 * @param      {integer}	minutes  The minutes
 * @param      {integer}	second   The second
 * @return     {Date}
 */
module.exports.format = (date, month, year, hours, minutes, second) => {
	var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	if (months.indexOf(month.toLowerCase()) !== -1) {
		return new Date(year, months.indexOf(month.toLowerCase()), date, hours, minutes, second);
	}
}