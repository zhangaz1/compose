'use strict'

/**
 * Expose compositor.
 */

module.exports = compose


function noop() {}

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */
function compose(funs) {
	return (context, next) => {
		var calls = funs.slice(0);
		calls.push(next);
		var index = -1;

		return createNextCall(0)();

		function createNextCall(i) {
			return () => {
				if (i < index) {
					return Promise.reject(new Error('next() called multiple times'));
				}

				index = i;
				var fn = calls[i] || noop;
				var nextCall = createNextCall(i + 1);

				try {
					return Promise.resolve(fn(context, nextCall));
				} catch (err) {
					return Promise.reject(err);
				}
			}
		}
	}
}
