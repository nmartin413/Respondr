# Respondr
#### setup and teardown functions for responsive web development

#### [download minified](https://raw.github.com/nmartin413/Respondr/master/src/respondr.min.js)


### Usage

#### Quick Example

	var respondr = Respondr.create();

	respondr.set.ranges({
		small:  [0, 200],
		medium: [200, 300],
		large:  [300, Infinity]
	});

	respondr.on.enter('large').run(function () {
		// do something
	});
	respondr.on.exit('medium').run(function () {
		// do something
	});
	respondr.on.enter('small').run(function () {
		// do something
	});

##### Setting Ranges

To set ranges, pass an object map to respondr.set.ranges in the format:

	{
		firstRange: [min, max],
		secondRange: [min, max]
	}


