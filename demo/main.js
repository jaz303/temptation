var fs = require('fs');
var ttn = require('..');

var templates = {
	test 	: fs.readFileSync(__dirname + '/test.ttn', 'utf8')
};

window.init = function() {

	var template = ttn(templates.test);

	document.body.appendChild(template());

}