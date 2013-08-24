# Respondr
#### setup and teardown functions for responsive web development

#### [download minified](https://raw.github.com/nmartin413/Respondr/master/src/respondr.min.js)
#### depends on [underscore.js](https://github.com/jashkenas/underscore)

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
	
##### Initializing a respondr

For most applications, there is only a need to have one respondr instance, but you can create more if you'd like.
They will operate independent of one another, and can have their own range definitions.

	var respondr = Responder.create();
	var auxillaryRespondr = Respondr.create();

##### Defining Ranges

To set ranges, pass an object map to respondr.set.ranges in the format:

	respondr.set.ranges({
		firstRange: [min, max],
		secondRange: [min, max]
	});

Notes on ranges:

+ Passed as an `Array` of `Numbers` (of length 1 or 2)
+ Must be non-negative integers or `Infinity`
+ If only one `Number` is provided, the second is assumed to be `Infinity`
+ Second `Number` must be greater than first `Number`
+ The key value of the range will later be used as the range identifier when binding events

##### Binding Events

To bind events, use the following syntax:

	respondr.on.enter('rangeName').run(function () {
		// do some setup work for this range
	});

	respondr.on.exit('rangeName').run(function () {
		// do some teardown work for this range
	});
	


