/* eslint-disable @typescript-eslint/no-magic-numbers, no-console */

'use strict';

const http = require('http');
const { send } = require('httpie');

const PORT = process.env.PORT || 8081;

/**
 * @param {http.IncomingMessage} req - Client request.
 * @param {http.ServerResponse} res - Server response.
 */
function requestHandler(req, res) {
  // Strip leading `/`
  const url = req.url.substring(1);

  console.log('Request:', url);

  send(req.method, url)
    .then((result) => {
      const type = result.headers['content-type'];
      const isJson = type.includes('application/json');

      // Forward the response headers
      Object.entries(result.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // Add permissive CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      res.end(isJson ? JSON.stringify(result.data) : result.data);
    })
    .catch((err) => {
      console.error(err);

      // Add permissive CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      res.statusCode = err.statusCode || 500;
      res.end(err.message);
    });
}

const server = http.createServer(requestHandler);

server.on('error', (err) => {
  console.error(err);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
