/*
 *	Respondr - setup and teardown functions for responsive websites
 * 	
 *  depends on underscore.js
 *
 */

// support for AMD & non-AMD
(function (root, factory) {
    if (typeof define==='function' && define.amd) define(['underscore'], factory);
    else root.Respondr = factory(this._);
}(this, function (_) {
	"use strict";

	/* Custom Errors */
	
	function RangeNotFoundError(message) {
		this.name = "RangeNotFoundError";
		this.message = message || "could not find range";
	};
	RangeNotFoundError.prototype = new Error();
	RangeNotFoundError.prototype.constructor = RangeNotFoundError;

	/* Generics */

	var genericEventAttacher = function (ranges, type, rangeName) {
		var targetRange = ranges[rangeName];
		if (!(targetRange instanceof Range))
			throw new RangeNotFoundError("could not find range: " + type);
		return {
			run: _(genericRun).partial(targetRange, type)
		};
	};

	var genericRun = function (range, type, fn) {
		range.addEvent(type, fn);
	};

	/* Respondr.Range */

	function Range(span, name) {
		if (!(span instanceof Array))
			throw new TypeError('new range requires an array span parameter');
		if (typeof name !== 'string')
			throw new TypeError('new range requires a string name parameter');
		this.validateSpan(span);
		this.name = name;
		this.min = span[0];
		this.max = span[1] || Infinity;

		this.events = {
			enter: [],
			exit: []
		};
	};
	Range.prototype = new Object();
	Range.prototype.constructor = Range;

	Range.prototype.validateSpan = function (span) {
		if (typeof span !== "object")
			throw new TypeError("invalid span for range");
		if (span.length !== 1 && span.length !== 2)
			throw new Error("span must have exactly 1 or 2 boundaries");
		_(span).each(function (n) {
			if (n === Infinity)
				return;
			if (n===+n && n !== (n|0))
				throw new TypeError("range boundaries can not be floats");
			if (n < 0)
				throw new RangeError("range boundaries can not be negative");
		});
		if (span.length !== 1) {
			if (span[0] > span[1])
				throw new RangeError("first boundary cannot be greater than second");
		}
	};
	Range.prototype.addEvent = function (type, fn) {
		if (typeof fn !== "function")
			throw new TypeError("event responder must be a function");
		this.validateEventType(type);
		this.events[type].push(fn);
	};
	Range.prototype.validateEventType = function (type) {
		if (type !== "enter" && type !== "exit")
			throw new Error("event type must be exit or enter");
	};
	Range.prototype.doesContain = function (val) {
		return (val > this.min && val < this.max);
	};
	Range.prototype.getTypeForChange = function (start, end) {
		// both are above
		if (start > this.max && end > this.max)
			return "above";

		// both are below
		if (start < this.min && end < this.min)
			return "below";

		// across cases
		if (start < this.min && end > this.max)
			return "across";
		if (start > this.max && end < this.min)
			return "across";

		// start is inside
		var startInside = (start > this.min && start < this.max);
		var endInside = (end > this.min && end < this.max);
		if (startInside && endInside)
			return "inside";

		// exit
		if (startInside && end < this.max)
			return "exit";
		if (startInside && end > this.min)
			return "exit";
		if (endInside && start > this.max)
			return "enter";
		if (endInside && start < this.min)
			return "enter";
	};

	/* Responder.create */

	var create = function () {
		var inst = {};
		var metric = inst.metric = { lastWidth: -1, width: -1 };

		var ranges = inst.ranges = { all: new Range([0, Infinity], 'all') };

		var getRangesForChange = function () {
			return _(ranges).filter(function (range) {
				var changeType = range.getTypeForChange(metric.lastWidth, metric.width);
				if (changeType === "exit" || changeType === "enter") return true;
				return false;
			});
		};

		var getRangeActions = function () {
			var changed = getRangesForChange();
			return _(changed).map(function (range) {
				return {
					changeType: range.getTypeForChange(metric.lastWidth, metric.width),
					range: range
				};
			});
		};

		var executeActions = function () {
			var actions = getRangeActions();
			var orderedActions = _(actions).sortBy(function (action) {
				if(action.changeType === "enter") return 2;
				if(action.changeType === "exit") return 1;
			});
			_(orderedActions).each(function (action) {
				var events = action.range.events[action.changeType];
				_(events).each(function (fn) {
					fn.call();
				});
			});
		};

		var set = inst.set = {
			ranges: function (rangeMap) {
				if (typeof rangeMap !== "object") throw new TypeError("invalid object");
				_(rangeMap).each(function (span, name) {
					ranges[name] = new Range(span, name);
				});
			},
			width: function (val) {
				metric.lastWidth = metric.width;
				metric.width = val;
				executeActions();
			}
		};
		
		var on = inst.on = {
			enter: _(genericEventAttacher).partial(ranges, 'enter'),
			exit: _(genericEventAttacher).partial(ranges, 'exit')
		};

		inst.getRangeActions = getRangeActions;
		inst.getRangesForChange = getRangesForChange;
		return inst;
	};
	
	return {
		create: create,
		Range: Range,
		RangeNotFoundError: RangeNotFoundError
	};

}));