var parser = require('../lib/parser');
var source = require('fs').readFileSync(__dirname + '/test1.tmptn', 'utf8');

parser.parse(source);