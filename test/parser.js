var parser = require('../lib/parser');
var source = require('fs').readFileSync(__dirname + '/test1.tmptn', 'utf8');

var res = parser.parse(source);

console.log(require('util').inspect(res, {depth: null, colors: true}));