'use strict';

/** @type {import('@polka/send').default} */
// @ts-expect-error - cast
const send = require('@polka/send');
const http = require('http');
const httpie = require('httpie');

const PORT = process.env.PORT || 8080;
// TODO: Pass through some headers
const noPassHeaders = new Set([
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
]);

/** @param {Record<string, string>} headers */
function mixHeaders(headers) {
  return {
    ...headers,
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': '*',
    'access-control-allow-credentials': 'true',
    'cross-origin-resource-policy': 'cross-origin',
  };
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function route(req, res) {
  // strip leading "/"
  const url = req.url && req.url.substring(1);
  let body = '';

  console.log('[http]', req.method, url);

  if (!url) {
    res.statusCode = 421;
    res.end('Missing target URL');
    return;
  }

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.once('end', () => {
    /** @type {Record<string, string | string[] | undefined>} */
    const headers = {};
    for (const k in req.headers) {
      if (!noPassHeaders.has(k)) {
        headers[k] = req.headers[k];
      }
    }

    httpie
      .send(req.method || 'GET', url, {
        body: body || undefined,
        // @ts-expect-error - can handle [] or undef
        headers,
      })
      .then((reply) => {
        send(res, reply.statusCode, reply.data, mixHeaders(reply.headers));
      })
      .catch((/** @type {httpie.Response} */ err) => {
        console.error(err);
        send(
          res,
          err.statusCode || 500,
          err.data || err,
          mixHeaders(err.headers),
        );
      });
  });
}

function run() {
  const server = http.createServer(route);
  server.on('error', console.error);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

exports.run = run;
