requirejs.config({
	baseUrl: '',

	paths: {
		jquery: 'lib/jquery',
		respondr: 'respondr.min',
		underscore: 'lib/underscore'
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

	'jquery',
	'respondr'

], function ($, Respondr) {

	console.log('started');

	mocha.setup('bdd');

	require([
	
		'tests/init'

	], function () {
		mocha.run();
	});

});
