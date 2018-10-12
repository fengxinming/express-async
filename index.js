'use strict';

const express = require('express');
const methods = require('methods').concat('all');
const wrap = require('./lib/wrap');
const utils = require('./lib/utils');

const {
  use,
  method
} = wrap;

function createApplication() {
  const app = express();
  app._use = app.use;
  app.use = use(app);
  return app;
}

module.exports = createApplication;

Object.assign(createApplication, express);

const Router = express.Router;

createApplication.Router = function (options) {
  const router = Router(options);
  router._use = router.use;
  router.use = use(router);
  methods.forEach((fn) => {
    const _fn = `_${fn}`;
    router[_fn] = router[fn];
    router[fn] = method(router, _fn);
  });
  return router;
};

createApplication.utils = utils;
