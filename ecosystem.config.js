'use strict';

module.exports = {
  apps: [
    {
      name: 'cors-proxy',
      script: './index.js',

      // eslint-disable-next-line sort-keys
      env: {
        NODE_ENV: 'production',
        // SENTRY_DEBUG: true,
        SENTRY_DSN: '__PUT_YOUR_DSN_HERE__',
      },
    },
  ],
};
