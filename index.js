/* eslint-disable @typescript-eslint/no-magic-numbers, no-console */

'use strict';

const http = require('http');
const { send } = require('httpie');

const PORT = process.env.PORT || 8081;

/**
 * @param {http.ServerResponse} res - Server response.
 * @param {http.ServerResponse} result - The forwarded request's response.
 */
function prepareResponse(res, result) {
  if (result.headers) {
    // Forward the response headers
    Object.entries(result.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  // Add permissive CORS headers
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', '*');
  res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
  res.setHeader('access-control-allow-credentials', 'true');
}

/**
 * @param {http.IncomingMessage} req - Client request.
 * @param {http.ServerResponse} res - Server response.
 */
function handleRequest(req, res) {
  // Strip leading `/`
  const url = req.url.substring(1);

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.once('end', () => {
    console.log('Request:', {
      body,
      headers: req.headers,
      method: req.method,
      url,
    });

    send(req.method, url, { body, headers: req.headers })
      .then((result) => {
        prepareResponse(res, result);

        console.log('Response:', {
          // body: result.data,
          headers: result.headers,
          statusCode: result.statusCode,
        });

        res.statusCode = result.statusCode;
        res.end(
          typeof result.data === 'object'
            ? JSON.stringify(result.data)
            : result.data,
        );
      })
      .catch((error) => {
        console.error(error);

        prepareResponse(res, error);

        res.statusCode = error.statusCode || 500;
        const data = error.data || error;
        res.end(typeof data === 'object' ? JSON.stringify(data) : data);
      });
  });
}

const server = http.createServer(handleRequest);

server.on('error', (err) => {
  console.error(err);
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
