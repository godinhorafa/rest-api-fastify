import fastify from "fastify";

const app = fastify();

app.get("/", () => {
  return "Hello World";
});
