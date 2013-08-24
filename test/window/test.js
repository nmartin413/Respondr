

define(['respondr'], function (Respondr) {

	var respondr = Respondr.create();
	var listRoot = document.createElement('ul');

	respondr.set.ranges({
		small: [0, 640],
		medium: [640, 1000],
		large: [1000]
	});
	respondr.set.logging(true);

	function init(opts) {

		var allEl = document.createElement('li');
		allEl.innerHTML = "all";
		
		var largeEl = document.createElement('li');
		largeEl.innerHTML = "large";

		var mediumEl = document.createElement('li');
		mediumEl.innerHTML = "medium";

		var smallEl = document.createElement('li');
		smallEl.innerHTML = "small";

		var target = opts.target;

		respondr.on.enter('all').run(function () {
			target.appendChild(listRoot);
			listRoot.appendChild(allEl);
		});

		respondr.on.enter('large').run(function () {
			listRoot.appendChild(largeEl);
		});
		respondr.on.exit('large').run(function () {
			listRoot.removeChild(largeEl);
		});

		respondr.on.enter('medium').run(function () {
			listRoot.appendChild(mediumEl);
		});
		respondr.on.exit('medium').run(function () {
			listRoot.removeChild(mediumEl);
		});

		respondr.on.enter('small').run(function () {
			listRoot.appendChild(smallEl);
		});
		respondr.on.exit('small').run(function () {
			listRoot.removeChild(smallEl);
		});

		respondr.listen();
	}

	return {
		init: init,
		respondr: respondr
	};

});