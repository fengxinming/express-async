'use strict';

const flatten = require('array-flatten');
const {
  isAsyncFunction,
  asyncToFn
} = require('./utils');

exports.use = function (app) {
  return function (...args) {
    let offset = 0;
    let path = '/';
    let fn = args[0];

    if (typeof fn !== 'function') {
      let arg = fn;

      while (Array.isArray(arg) && arg.length !== 0) {
        arg = arg[0];
      }

      if (typeof arg !== 'function') {
        offset = 1;
        path = fn;
      }
    }

    const fns = flatten(args.slice(offset));

    if (fns.length === 0) {
      throw new TypeError('app.use() requires a middleware function');
    }

    app._use(path, fns.map(n => isAsyncFunction(n) ? asyncToFn(n) : n));
  };
};