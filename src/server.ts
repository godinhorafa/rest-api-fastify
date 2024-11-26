import fastify from 'fastify';
import { knex } from './database';

const app = fastify();

async function setup() {
  await knex.raw('SELECT 1');
}

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')
  return tables
})

setup()
  .then(() => {
    app.listen({ port: 3333 }).then(() => {
      console.log("Server is running on port 3333");
    });
  })
  .catch(console.error);
