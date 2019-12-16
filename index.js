'use strict';

const profiler = require('@google-cloud/profiler');
const { startServer } = require('./server');
const pkg = require('./package.json');

profiler.start({
  serviceContext: {
    service: pkg.name,
    version: pkg.version,
  },
});

startServer();
