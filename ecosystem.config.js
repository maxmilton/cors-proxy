'use strict';

module.exports = {
  apps: [
    {
      env: {
        NODE_ENV: 'production',
      },
      name: 'cors-proxy',
      script: './index.js',
    },
  ],
};
