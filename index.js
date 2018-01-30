'use strict'

/**
 * Expose compositor.
 */

module.exports = compose


function noop() {}

function multipleCallError() {
	return Promise.reject(new Error('next() called multiple times'));
}

function check(middleware){
	if (!Array.isArray(middleware)) {
		throw new TypeError('Middleware stack must be an array!');
	}

	for (const fn of middleware) {
		if (typeof fn !== 'function') {
			throw new TypeError('Middleware must be composed of functions!');
		}
	}
}

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */
function compose(middleware) {
	check(middleware);

	return (context, next) => {
		var funs = [];
		funs[middleware.length] = next;

		try {
			return callNext(0);
		} catch (err) {
			return Promise.reject(err);
		}

		function callNext(i) {
			var fn = funs[i] || middleware[i] || noop;
			funs[i] = multipleCallError;

			return Promise.resolve(fn(context, () => {
				return callNext(i + 1);
			}));
		}
	}
}