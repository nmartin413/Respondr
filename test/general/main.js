requirejs.config({
	baseUrl: '../',

	paths: {
		respondr: 'respondr.min',
		underscore: 'lib/underscore'
	},

	shim: {
		underscore: {
			exports: '_'
		}
	}

});


require([

	'respondr'

], function (Respondr) {
	window.Respondr = Respondr;


	mocha.setup('bdd');

	require(['general/test'], function () {
		mocha.run();
	});

});
