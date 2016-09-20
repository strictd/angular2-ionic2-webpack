'use strict';

let url = require('url');

exports.getIdentFromHost = function(host) {
  if (host == 'localhost') return 'local';

  console.log('Ident Host: '+host);
  return 'local';
}

// fetch IP based off header or connection data
exports.getIp = function(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

// fetch ORIGIN based off header referrer or connection origin
exports.getOrigin = function(req) {
  return req.headers.referer || req.get('origin');
}

exports.setAppHostInfo = function(app, req, res, next) {
  // set IP
  app.locals.ip = this.getIp(req);

  // Parse and set host
  let host = this.getOrigin(req);
  if (typeof host !== 'undefined') { app.locals.host = url.parse(host).host; }

  // Set Ident from Host
  app.locals.ident = this.getIdentFromHost(app.locals.host);

  // Continue app.use
  next();
}
