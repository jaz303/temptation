module.exports = compile;
function compile(root) {

	var code = '';
	var nextVar = 1;

	function ln(str) {
		code += str + "\n";
	}

	function genvar() {
		return '$tmp_' + (nextVar++);
	}

	function isStatic(exp) {
		return exp.type === 'string'
			|| exp.type === 'symbol';
	}

	function staticEvalString(exp) {
		switch (exp.type) {
			case 'string':
				return exp.value;
			case 'symbol':
				return exp.name;
			default:
				throw new Error("expression cannot be evaluated statically");
		}
	}

	function compileInterpolatedString(node, parentName) {

	}

	function compileString(node, parentName) {
		var varName = genvar();
		ln('var ' + varName + ' = document.createTextNode(' + JSON.stringify(node.value) + ');');
		return [varName];
	}

	function compileElement(node, parentVar) {
		
		var varName = genvar();
		
		ln('var ' + varName + ' = document.createElement("' + node.el.name + '");');

		if (node.el.id) {
			ln(varName + '.id = ' + JSON.stringify(node.el.id) + ";");
		}

		var staticClasses = [];

		node.el.classes.forEach(function(klass) {
			if (klass.type === 'class-static') {
				staticClasses.push(klass.name);
			} else if (klass.type === 'class-toggle') {
				// watch(
				// 	subject,
				// 	klass.predicate,
				// 	function(newVal) {
				// 		if (newVal) {
				// 			addClass(el, klass.name);
				// 		} else {
				// 			removeClass(el, klass.name);
				// 		}
				// 	}
				// );
			} else if (klass.type === 'class-dynamic') {

			}
		});

		if (staticClasses.length > 0) {
			ln(varName + '.className = ' + JSON.stringify(staticClasses.join(' ')) + ';');	
		}

		node.el.attributes.forEach(function(attr) {
			switch (attr.type) {
				case 'attribute-value':
					if (isStatic(attr.exp)) {
						ln([
							varName,
							'.setAttribute(',
							JSON.stringify(attr.key),
							', ',
							JSON.stringify(staticEvalString(attr.exp)),
							');'
						].join(''));
					} else {
						ln(['DYNAMIC ATTRIBUTE']);
					}
					break;
				case 'attribute-event':
					if (attr.delegate) {
						ln([
							'delegate(',
							varName,
							', ',
							JSON.stringify(attr.key),
							', ',
							JSON.stringify(attr.delegate),
							', ',
							'function(evt) { }',
							');'
						].join(''))
					} else {
						ln([
							'bind(',
							varName,
							', ',
							JSON.stringify(attr.key),
							', ',
							'function(evt) { }',
							');'
						].join(''))
					}
			}
		});

		var children = compileInner(node.body, varName);
		children.forEach(function(child) {
			ln(varName + '.appendChild(' + child + ');');
		});

		return varName;
	
	}

	function compileBoundCollection(node, parentName) {
		
		var altEls = node.alternate
			? compileInner(node.alternate)
			: [];

		ln(
			'this.bindCollection(subject, ',
			JSON.stringify(node.name),
			', ' + parentName,
			', ' + JSON.stringify(altEls),
			');'
		);

	}

	function compileInner(lst, parentName) {
		var tld = [];
		lst.forEach(function(child) {
			switch (child.type) {
				case 'interpolated-string':
					console.log(child);
					break;
				case 'string':
					tld.push(compileString(child)[0]);
					break;
				case 'element':
					tld.push(compileElement(child)[0]);
					break;
				case 'bound-collection':
					tld = tld.concat(compileBoundCollection(child, parentNode));
					break;
				case 'if':
					break;
				default:
					throw new Error("unknown!");
			}
		});
		return tld;
	}

	var rootVar = compileElement(root);
	ln('return ' + rootVar + ';');

	code = code.replace(/^/g, '    ');
	code = "function(subject) {\n" + code + "}";

	return code;

}