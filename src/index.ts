import fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import prismaPlugin from "./plugins/prisma";
import { authRoutes } from "./routes/auth";
import { matchesRoute } from "./routes/matches";
import { playersRoute } from "./routes/players";
import { teamsRoute } from "./routes/teams";
import { eventsRoute } from "./routes/events";
import { summaryRoute } from "./routes/summary";
import { historyRoute } from "./routes/history";
const server = fastify({
  logger: true,
});

server.register(jwtPlugin);
server.register(prismaPlugin);

server.register(authRoutes, { prefix: "/auth" });
server.register(matchesRoute, { prefix: "/matches" });
server.register(teamsRoute, { prefix: "/matches" });
server.register(eventsRoute, { prefix: "/matches" });
server.register(summaryRoute, { prefix: "/matches" });
server.register(playersRoute, { prefix: "/players" });
server.register(historyRoute, { prefix: "/history" });

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
