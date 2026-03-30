import fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import prismaPlugin from "./plugins/prisma";
import { authRoutes } from "./routes/auth";
const server = fastify({
  logger: true,
});

server.register(jwtPlugin);
server.register(prismaPlugin);

server.register(authRoutes, { prefix: "/auth" });

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
