/* eslint-disable @typescript-eslint/no-magic-numbers, no-console, security/detect-object-injection */

'use strict';

const http = require('http');
const { send } = require('httpie');

const PORT = process.env.PORT || 8081;
const unwantedHeaders = [
  'connection',
  'host',
  'origin',
  'referer',
  'pragma',
  'accept-encoding',
  'cdn-loop',
  'cache-control',
  'user-agent',
  'cf-connecting-ip',
  'cf-visitor',
  'cf-ray',
  'x-forwarded-for',
  'x-forwarded-proto',
];

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
 * @param {http.IncomingMessage} req - Original client request.
 * @param {http.ServerResponse} res - Final server response.
 */
function handleRequest(req, res) {
  // Strip leading `/`
  const url = req.url.substring(1);

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.once('end', () => {
    const headers = { ...req.headers };

    unwantedHeaders.forEach((header) => {
      try {
        delete headers[header];
      } catch (err) {}
    });

    // Set body as undefined rather than an empty string
    body = body || undefined;

    console.log('Request:', {
      body,
      headers,
      method: req.method,
      url,
    });

    send(req.method, url, { body, headers })
      .then((result) => {
        prepareResponse(res, result);

        console.log('Response:', {
          // body: result.data,
          headers: result.headers,
          statusCode: result.statusCode,
        });

        res.statusCode = result.statusCode;
        const { data } = result;
        const isObj = typeof data === 'object' && !Buffer.isBuffer(data);
        res.end(isObj ? JSON.stringify(data) : data);
      })
      .catch((error) => {
        prepareResponse(res, error);

        console.error(error);

        res.statusCode =
          error.statusCode >= 200 && error.statusCode < 300
            ? 500
            : error.statusCode;

        const data = error.data || error;
        const isObj = typeof data === 'object' && !Buffer.isBuffer(data);
        res.end(isObj ? JSON.stringify(data) : data);
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
