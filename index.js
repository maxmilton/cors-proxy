/* eslint-disable @typescript-eslint/no-magic-numbers, no-console */

'use strict';

const http = require('http');
const { send } = require('httpie');

const PORT = process.env.PORT || 8081;

/**
 * @param {http.ServerResponse} res - Server response.
 * @param {http.ServerResponse} result - The forwarded request's response.
 * @returns {{ isJson: boolean }} Data used to finish the response.
 */
function prepareResponse(res, result) {
  // Forward the response headers
  Object.entries(result.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Add permissive CORS headers
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
  res.setHeader('access-control-allow-credentials', 'true');

  const type = result.headers && result.headers['content-type'];
  const isJson = type && type.includes('application/json');

  return { isJson };
}

/**
 * @param {http.IncomingMessage} req - Client request.
 * @param {http.ServerResponse} res - Server response.
 */
function handleRequest(req, res) {
  // Strip leading `/`
  const url = req.url.substring(1);

  console.log('Request:', url);

  // send(req.method, url, { body: req.body, headers: req.headers })
  send(req.method, url, { headers: req.headers })
    .then((result) => {
      const { isJson } = prepareResponse(res, result);

      res.statusCode = result.statusCode;
      res.end(isJson ? JSON.stringify(result.data) : result.data);
    })
    .catch((error) => {
      console.error(error);

      const { isJson } = prepareResponse(res, error);

      res.statusCode = error.statusCode || 500;
      const data = error.data || error;
      res.end(isJson ? JSON.stringify(data) : data);
    });
}

const server = http.createServer(handleRequest);

server.on('error', (err) => {
  console.error(err);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
