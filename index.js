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

      res.statusCode = result.statusCode;
      res.end(isJson ? JSON.stringify(result.data) : result.data);
    })
    .catch((error) => {
      console.error(error);

      const type = error.headers && error.headers['content-type'];
      const isJson = type && type.includes('application/json');

      // Forward the response headers
      Object.entries(error.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      // Add permissive CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      res.statusCode = error.statusCode || 500;
      const data = error.data || error;
      res.end(isJson ? JSON.stringify(data) : data);
    });
}

const server = http.createServer(requestHandler);

server.on('error', (err) => {
  console.error(err);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
