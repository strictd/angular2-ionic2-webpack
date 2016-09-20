'use strict';

module.exports = function (dbServers) {
  let config = {
    knex: dbServers.default_mysql
  };

  // Grab settings for table references that are no under the default modules.config
  let tableConfig = {};

  return {
    get: function(qTable) {
      if (qTable !== '' && typeof tableConfig[qTable] !== 'undefined') { return tableConfig[qTable]; } else { return config; }
    },
    scheme: function(qTable) {
      if (qTable !== '' && typeof tableConfig[qTable] !== 'undefined') { return tableConfig[qTable].scheme; } else { return config.scheme; }
    }
  };
}
