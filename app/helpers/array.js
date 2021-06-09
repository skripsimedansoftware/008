
/**
 * Find value in array or object
 *
 * @param      {array}		arrayName    The array name
 * @param      {string}		searchKey    The search key
 * @param      {string} 	searchValue  The search value
 * @return     {boolean} 	array key
 */
module.exports.find_value = (arrayName, searchKey, searchValue) => {
	let find = arrayName.findIndex(i => i[searchKey] == searchValue);
	return (find !== -1)?find:false;
}

/**
 * Foreach
 *
 * @param      {array|object}   obj       The object
 * @param      {function}  		iterator  The iterator
 */
module.exports.foreach = (obj, iterator) => {
	if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
		obj.forEach(iterator)
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			iterator(obj[i], i, obj)
		}
	} else {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				iterator(obj[key], key, obj)
			}
		}
	}
}

/**
 * Array shuffle
 *
 * @param      {array}  array   The array
 * @return     {array}
 */
module.exports.shuffle = function(array) {
	var j, x, i;
	for (i = array.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = array[i];
		array[i] = array[j];
		array[j] = x;
	}
	return array;
}

/**
 * Array random
 *
 * @param      {array}  array   The array
 * @return     {mixed}
 */
module.exports.random = function(array) {
	var random = Math.floor(Math.random() * array.length);
	return array[random];
}

/**
 * Array chunks
 */
module.exports.chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));