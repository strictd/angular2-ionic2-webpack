var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    charset : 'utf8'
  },
  pool: {
    min: 1,
    max: 10
  }
});

if (process.env.KNEX_SHOW_SQL === '1') {
  console.log('KNEX_SHOW_SQL [strictd_mysql]: Enabled');
  knex.on( 'query', function( queryData ) {
    console.log( queryData );
  });
} else {
  console.log('KNEX_SHOW_SQL [strictd_mysql]: Disabled');
}

module.exports = knex;
