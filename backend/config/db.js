'use strict';

let host = require('./host');

let dbConfigs = {
  local: require('./host_local')
};

let dbServers = {
  default_mysql: require('../db/db_knex_default_mysql'),
};

exports.setDatabase = function(app, req, res, next) {
  // setup database connections for host
  app.locals.dbServers = dbServers; 
  app.locals.db = this.getModuleFromHost(app.locals.host)(app.locals.dbServers);
  
  // Continue app.use
  next();
}

exports.getModuleFromHost = function(hostname) {
  let ident = host.getIdentFromHost(hostname);
  if (!ident) { throw `No Config Associated with Host ${hostname}`; }
  let identMod = this.getModuleFromConfigs(ident);
  if (!identMod) { throw `No Module associated with Ident ${ident}`; }

  return identMod;
}

exports.getModuleFromConfigs = function(ident) {
  return dbConfigs[ident];
}

exports.getAllConfigs = function() {
  let ret = [];
  for (var s in dbConfigs) {
    if (!obj.hasOwnProperty(s)) { continue; }
    ret.push(s);
  }
  return ret;
}
