import fastify from "fastify";

const server = fastify({
  logger: true,
});

const start = async () => {
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log("Servidor rodando em http://localhost:8080");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
