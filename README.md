[![Build status](https://img.shields.io/github/workflow/status/MaxMilton/cors-proxy/ci)](https://github.com/MaxMilton/cors-proxy/actions)
[![License](https://img.shields.io/github/license/MaxMilton/cors-proxy.svg)](https://github.com/MaxMilton/cors-proxy/blob/master/LICENSE)

# cors-proxy

A simple transparent proxy that adds permissive CORS and CORP headers to all HTTP responses. It allows you to bypass [CORS restrictions](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [CORP restrictions](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)>) on an API for development or testing purposes.

It works in two parts, a Node.js server and an Nginx reverse proxy.

"Why is node required?" you might ask... well, if the target API endpoint is known ahead of time it's possible to create a solution using only Nginx or HAProxy. But to target any endpoint dynamically, extra logic is required. A Lua script in Nginx or HAproxy would be a more elegant solution but for the sake of quick implementation and ease of tracking errors/requests a node server is used here.

## Setup

1. Clone this repo to your server or dev environment.
1. Make changes to `index.js` and `server.js` if required.
1. Set up an [Nginx](https://nginx.org/en/) virtual host using `nginx.conf` as a template.
1. Run `node index.js`.

## Usage

### Basic proxy

To use the service prepend its URL before the API you want to access. For example, if you set up cors-proxy with an endpoint `https://cors-proxy.yourdomain.com` and the API you want to access is `https://swapi.dev/api/people/1/`, then you should fetch:

```
https://cors-proxy.yourdomain.com/https://swapi.dev/api/people/1/
```

### Bypass HTTPS

If you set up Nginx as in the `nginx.conf` template, you can make a request to a `https` API URL over `http`. This is useful for devices with old CA certificates or no modern TLS support. Simply use http instead of https:

```
http://cors-proxy.yourdomain.com/https://swapi.dev/api/people/1/
```

## License

MIT license. See [LICENSE](https://github.com/maxmilton/cors-proxy/blob/master/LICENSE).

---

© 2021 [Max Milton](https://maxmilton.com)
