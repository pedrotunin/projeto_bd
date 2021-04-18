const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port: '5433',
      user : 'postgres',
      password : '123456',
      database : 'entregapp'
    }
});

module.exports = knex