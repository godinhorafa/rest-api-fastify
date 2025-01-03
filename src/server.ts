import fastify from 'fastify';
import { knex } from './database';
import { transactionsRoutes } from './routes/transactions';
import cookie from '@fastify/cookie'

const app = fastify();

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

async function setup() {
  await knex.raw('SELECT 1');
}

setup()
  .then(() => {
    app.listen({ port: 3333 }).then(() => {
      console.log("Server is running on port 3333");
    });
  })
  .catch(console.error);
