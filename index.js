'use strict'

/**
 * Expose compositor.
 */

module.exports = compose


function noop() {}

function once(fun) {
    var called = false;
    return ()=>{
        if (called) {
            throw new Error('called multiple times');
        }
        called = true;

        return fun.apply(null, arguments);
    }
    ;
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
function compose(funs) {
    var calls = funs.slice(0);

    return (context,next)=>{
        calls.push(next);
        return createNextCall(calls)();

    }
}

function createNextCall(nextCalls) {
    var nextCall = ()=>{
        var fn = nextCalls[0] || noop;
        var nextCall = createNextCall(nextCalls.slice(1));
        return Promise.resolve(fn(context, nextCall));
    }
    ;

    return once(nextCall);
}
