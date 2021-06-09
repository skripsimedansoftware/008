
/**
 * HTML encode
 *
 * @param      {string}  str     The string
 * @return     {string}  HTML encoded
 */
module.exports.encode = function(str) {
    return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

/**
 * HTML decode
 *
 * @param      {string}  str     The string
 * @return     {string}  HTML decoded
 */
module.exports.decode = function(str) {
    return (str+"").replace(/&#\d+;/gm,function(s) {
        return String.fromCharCode(s.match(/\d+/gm)[0]);
    })
}