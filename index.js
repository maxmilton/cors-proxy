'use strict';

const profiler = require('@google-cloud/profiler');
const { startServer } = require('./server');
const pkg = require('./package.json');

profiler.start({
  logLevel: 3,
  serviceContext: {
    service: pkg.name,
    version: pkg.version,
  },
});

startServer();
