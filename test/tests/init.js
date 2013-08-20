
define(['respondr', 'underscore'], function (Respondr, _) {
	var should = chai.should();
	var expect = chai.expect;

	describe("Respondr - setup & manipulation", function () {
		describe('static', function () {
			it('should have function create', function () {
				Respondr.create.should.be.a('function');
			});
		});
		describe('instance - range manipulation', function () {
			var respondr = Respondr.create();
			it('should have default range "all" for 0 to Infinity', function () {
				respondr.ranges.all.should.be.an('object');
			});
			it('should be able to add two ranges', function () {
				respondr.set.ranges({ large: [1000, Infinity], small: [0, 1000] });
			});
			it('should have three ranges', function () {
				_(respondr.ranges).keys().length.should.be.eql(3);
			});
		});
		describe('instance - width manipulation', function () {
			it('should initialize metric.width to -1', function () {
				var respondr = Respondr.create();
				respondr.metric.width.should.eql(-1);
			});
			it('should initialize metric.lastWidth to -1', function () {
				var respondr = Respondr.create();
				respondr.metric.lastWidth.should.eql(-1);
			});
			it('should be able to change metric.width via set.width', function () {
				var respondr = Respondr.create();
				respondr.set.width(400);
				respondr.metric.width.should.eql(400);
			});
			it('should remember the last width', function () {
				var respondr = Respondr.create();
				respondr.set.width(100);
				respondr.set.width(300);
				respondr.metric.lastWidth.should.eql(100);
			});
		});
	});

	describe('Respondr - event attaching', function () {
		var testRanges = { small: [0, 100], medium: [100, 200], large: [200, Infinity] };

		it('should attach event to the correct range', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			respondr.on.exit('small').run(function () { });

			respondr.ranges.small.events.exit.length.should.eql(1);
			respondr.ranges.medium.events.exit.length.should.eql(0);
			respondr.ranges.large.events.exit.length.should.eql(0);
			respondr.ranges.all.events.exit.length.should.eql(0);
		});

		it('should attach event to the correct collection', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			respondr.on.enter('medium').run(function () { });

			respondr.ranges.medium.events.enter.length.should.eql(1);
			respondr.ranges.medium.events.exit.length.should.eql(0);
		});

		it('should return the correct changed ranges (initial)', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			respondr.set.width(150);
			var changed = respondr.getRangesForChange();
			changed.length.should.eql(2);

			var names = _(changed).pluck('name');
			names.should.include('medium');
			names.should.include('all');
		});

		it('should return the correct changed ranges (non-initial)', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			respondr.set.width(150);
			respondr.set.width(500);

			var changed = respondr.getRangesForChange();
			changed.length.should.eql(2);

			var names = _(changed).pluck('name');
			names.should.include('medium');
			names.should.include('large');
		});

		it('should return the correct range action count', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			respondr.set.width(150);
			respondr.getRangeActions().length.should.eql(2);
		});

		it('should return the correct ranges with actions for the change', function () {
			var respondr = Respondr.create(testRanges);
			respondr.set.ranges(testRanges);
			respondr.on.enter('small').run(function () { });
			respondr.on.enter('medium').run(function () { });

			respondr.set.width(150);
			var actions = respondr.getRangeActions();
			var ranges = _(actions).pluck('range');
			var rangeNames = _(ranges).pluck('name');

			rangeNames.should.include('all');
			rangeNames.should.include('medium');
		});

		it('should return the correct change types with actions for the change', function () {
			var respondr = Respondr.create(testRanges);
			respondr.set.ranges(testRanges);

			respondr.on.enter('small').run(function () { });
			respondr.on.enter('medium').run(function () { });

			respondr.set.width(50);
			respondr.set.width(150);

			var actions = respondr.getRangeActions();
			console.log(actions);

			actions.length.should.eql(2);

			actions[0].changeType.should.eql('exit');
			actions[0].range.name.should.eql('small');

			actions[1].changeType.should.eql('enter');
			actions[1].range.name.should.eql('medium');
		});
	});

	describe('Respondr - event firing', function () {
		var testRanges = { small: [0, 100], medium: [100, 200], large: [200, Infinity] };

		it('should fire enter event when moving into range', function () {
			var str = "", respondr = Respondr.create();
			respondr.set.ranges(testRanges);

			respondr.on.enter('medium').run(function () {
				str += "a";
			});
			respondr.set.width(150);

			str.should.eql("a");
		});
		it('should fire exit event when moving out of range', function () {
			var str = "", respondr = Respondr.create();
			respondr.set.ranges(testRanges);

			respondr.on.exit('medium').run(function () {
				str += "a";
			});

			respondr.set.width(150);
			respondr.set.width(50);

			str.should.eql("a");
		});
		it('should fire multiple events in order', function () {
			var str = "", respondr = Respondr.create();
			respondr.set.ranges(testRanges);

			respondr.on.enter('large').run(function () {
				str += "a";
			});
			respondr.on.enter('medium').run(function () {
				str += "b";
			});
			respondr.on.enter('small').run(function () {
				str += "c";
			});

			respondr.set.width(500);
			respondr.set.width(150);
			respondr.set.width(50);

			str.should.eql('abc');
		});
		it('should fire exit events before enter events', function () {
			var str = "", respondr = Respondr.create();
			respondr.set.ranges(testRanges);

			respondr.on.enter('large').run(function () {
				str += "en-l ";
			});
			respondr.on.exit('large').run(function () {
				str += "ex-l ";
			});
			respondr.on.enter('medium').run(function () {
				str += "en-m ";
			});
			respondr.on.exit('medium').run(function () {
				str += "ex-m ";
			});
			respondr.on.enter('small').run(function () {
				str += "en-s ";
			});
			respondr.on.exit('small').run(function () {
				str += "ex-s ";
			});

			respondr.set.width(500);
			respondr.set.width(150);
			respondr.set.width(50);
			respondr.set.width(150);
			respondr.set.width(500);

			str.should.eql("en-l ex-l en-m ex-m en-s ex-s en-m ex-m en-l ");
		});
		it('should fire enter all event on first change', function () {
			var str = "", respondr = Respondr.create();
			respondr.set.ranges(testRanges);

			respondr.on.enter('all').run(function () {
				str = "a";
			});
			respondr.set.width(300);

			str.should.eql("a");
		});
		it('should throw RangeNotFoundError if range doesn\'t exist', function () {
			var respondr = Respondr.create();
			respondr.set.ranges(testRanges);
			(function(){ respondr.on.enter('smedium', function () { }) }).should.throw(Respondr.RangeNotFoundError);
		});
	});

	describe('Respondr.Range', function () {
		var Range = Respondr.Range;
		describe('init', function () {
			it('should assign the first item to min, second to max', function () {
				var range = new Range([100, 500], 'test');
				range.min.should.eql(100);
				range.max.should.eql(500);
			});
			it('should allow Infinity as a boundary', function () {
				var range = new Range([400, Infinity], 'test');
				range.min.should.eql(400);
				range.max.should.eql(Infinity);
			});
			it('should assume Infinity for second argument if omitted', function () {
				var range = new Range([1000], 'test');
				range.min.should.eql(1000);
				range.max.should.eql(Infinity);
			});
			it('should throw Error if array length is not 1 or 2', function () {
				(function(){ new Range([100, 200, 300], 'test')}).should.throw(Error, "span must have exactly 1 or 2 boundaries");
			});
			it('should throw TypeError with no name argument', function () {
				(function(){ new Range([100, 200])}).should.throw(TypeError);
			});
			it('should throw TypeError with no argument', function () {
				(function(){ new Range() }).should.throw(TypeError);
			});
			it('should throw TypeError with no span argument', function () {
				(function(){ new Range("medium")}).should.throw(TypeError);
			});
			it('should throw TypeError with floats', function () {
				(function(){ new Range([50.5, 100], 'test')}).should.throw(TypeError);
			});
			it('should throw RangeError with negative numbers', function () {
				(function(){ new Range([-100, 100], 'test')}).should.throw(RangeError);
			});
			it('should throw RangeError if first is greater than second', function () {
				(function(){ new Range([500, 200], 'test')}).should.throw(RangeError);
			});
		});
		describe('events', function () {
			var emptyFn = function () { return this; };
			it('should init with no events', function () {
				var range = new Range([0, 100], 'test');
				range.events.enter.length.should.eql(0);
				range.events.exit.length.should.eql(0);
			});
			it('should add events to correct collection', function () {
				var range = new Range([0, 100], 'test');
				range.addEvent('enter', emptyFn);
				range.events.enter.length.should.eql(1);
				range.events.exit.length.should.eql(0);
			});
			it('should throw Error for event types that are not "exit" or "enter"', function () {
				var range = new Range([0, 100], 'test');
				(function() { range.addEvent("boo", emptyFn) }).should.throw(Error, "event type must be exit or enter");
			});
			it('should throw TypeError for when function is not supplied, or is not a function', function () {
				var range = new Range([0, 100], 'test');
				(function() { range.addEvent("exit") }).should.throw(TypeError);
				(function() { range.addEvent("exit", "doSomething") }).should.throw(TypeError);
			});
		});
		describe('boundary crossing', function () {
			var range = new Range([100, 200], 'test');

			it('should return "exit" for exiting range', function () {
				range.getTypeForChange(150, 50).should.eql("exit");
			});

			it('should return "enter" for entering range', function () {
				range.getTypeForChange(50, 150).should.eql("enter");
			});

			it('should return "inside" for moving inside range', function () {
				range.getTypeForChange(120, 180).should.eql("inside");
			});

			it('should return "above" for moving above range', function () {
				range.getTypeForChange(220, 280).should.eql("above");
			});

			it('should return "below" for moving below range', function () {
				range.getTypeForChange(20, 80).should.eql("below");
			});

			it('should return "across" for moving across range', function () {
				range.getTypeForChange(80, 220).should.eql("across");
				range.getTypeForChange(220, 80).should.eql("across");
			});

		});
		describe('range inclusion', function () {
			var range = new Range([500, 600], 'test');
			it('should return true for numbers inside', function () {
				range.doesContain(550).should.eql(true);
			});
			it('should return false for numbers outside', function () {
				range.doesContain(300).should.eql(false);
			});
		});
	});


});
