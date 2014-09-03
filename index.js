var parser = require('./lib/parser');
var compiler = require('./lib/compiler');

module.exports = function(src) {
	return compiler.compileFunction(parser.parse(src));
}