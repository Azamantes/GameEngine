// Object.prototype.toString.call(1)
const Check = {
	number: '[object Number]',
	infinity: '[object Number]',
	nan: '[object Number]',
	boolean: '[object Boolean]',
	string: '[object String]',
	function: '[object Function]',
	undefined: '[object Undefined]',
	null: '[object Null]',
	object: '[object Object]',
	array: '[object Array]',
	this: function(value) {
		return Object.prototype.toString.call(value);
	}
};
module.exports = Check;