'use strict';

const profiler = require('@google-cloud/profiler');
const pkg = require('./package.json');
const { startServer } = require('./server');

profiler.start({
  logLevel: 3,
  serviceContext: {
    service: pkg.name,
    version: pkg.version,
  },
});

startServer();
