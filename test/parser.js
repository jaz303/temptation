var parser = require('../lib/parser');
var source = require('fs').readFileSync(__dirname + '/test1.tmptn', 'utf8');

var res = parser.parse(source);

var js = require('../lib/compiler')(res);

console.log(js);
