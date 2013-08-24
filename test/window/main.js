requirejs.config({
	baseUrl: '',

	paths: {
		respondr: '../respondr.min',
		underscore: '../lib/underscore'
	},

	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		}
	}

});


require([

	'respondr',
	'test'

], function (Respondr, test) {

	test.init({
		target: document.getElementById('body')
	});

});
