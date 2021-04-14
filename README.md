[![Build status](https://img.shields.io/github/workflow/status/MaxMilton/cors-proxy/ci)](https://github.com/MaxMilton/cors-proxy/actions)
[![Coverage status](https://img.shields.io/codeclimate/coverage/MaxMilton/cors-proxy)](https://codeclimate.com/github/MaxMilton/cors-proxy)
[![Licence](https://img.shields.io/github/license/MaxMilton/cors-proxy.svg)](https://github.com/MaxMilton/cors-proxy/blob/master/LICENSE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# cors-proxy

A simple transparent proxy that adds permissive CORS headers to API responses. Allow you to bypass [CORS restrictions](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) on an API for development or testing purposes.

It works in 2 parts, a node server and an nginx reverse proxy. "Why is node required?" you might ask... well, if you know the API endpoint ahead of time it's possible to create a solution using only nginx or HAProxy. But in situations when you want to add the CORS headers dynamically for any request's response, it's necessary to have some extra logic. A Lua script in nginx or HAproxy might be a more elegant solution but for the sake of quick implementation and the ability to track errors/requests easily a node server is used here.

## Usage

1. Optionally install [PM2](https://pm2.keymetrics.io/) for managing the node process.
1. Clone this repo to your server or dev environment.
1. Make any changes required; look into `index.js` and `server.js`.
1. Set up an [nginx](https://nginx.org/en/) virtual host using `nginx.conf` as a template.
1. Look in `package.json#scripts` for how to start the server; with PM2 `prod:start` or `prod:update` and without PM2 `start`.

## Licence

`cors-proxy` is an MIT licensed open source project. See [LICENCE](https://github.com/MaxMilton/cors-proxy/blob/master/LICENCE).

---

© 2021 [Max Milton](https://maxmilton.com)
