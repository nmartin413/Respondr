## Respondr
#### setup and teardown functions for responsive web development

#### [download minified](https://raw.github.com/nmartin413/Respondr/master/src/respondr.min.js)


#### Usage

##### init

	var respondr = Respondr.create();

	respondr.set.ranges({
		small:  [0, 200],
		medium: [200, 300],
		large:  [300, Infinity]
	});

	respondr.on.enter('large').run(function () {
		// do something
	});
	respondr.on.enter('medium').run(function () {
		// do something
	});
	respondr.on.enter('small').run(function () {
		// do something
	});
