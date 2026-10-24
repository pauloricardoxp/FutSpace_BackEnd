import "./types/fastify.js";
import fastify from "fastify";
import jwtPlugin from "./plugins/jwt.js";
import prismaPlugin from "./plugins/prisma.js";
import helmetPlugin from "./plugins/helmet.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import corsPlugin from "./plugins/cors.js";
import { authRoutes } from "./routes/auth.js";
import { matchesRoute } from "./routes/matches.js";
import { playersRoute } from "./routes/players.js";
import { teamsRoute } from "./routes/teams.js";
import { eventsRoute } from "./routes/events.js";
import { summaryRoute } from "./routes/summary.js";
import { historyRoute } from "./routes/history.js";
import { dashboardRoute } from "./routes/dashboard.js";
import swagger from "@fastify/swagger";
import scalarPlugin from "@scalar/fastify-api-reference";
import { healthRoute } from "./routes/health.js";
const server = fastify({
  logger: true,
});

await server.register(swagger, {
  openapi: {
    info: {
      title: "FutSpace  API",
      description: "API do sistema de gerenciamento de partidas",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

await server.register(scalarPlugin, {
  routePrefix: "/docs",
});

server.register(helmetPlugin);
server.register(rateLimitPlugin);
server.register(corsPlugin);
server.register(jwtPlugin);
server.register(prismaPlugin);
server.register(healthRoute);

server.register(authRoutes, { prefix: "/auth" });
server.register(matchesRoute, { prefix: "/matches" });
server.register(teamsRoute, { prefix: "/matches" });
server.register(eventsRoute, { prefix: "/matches" });
server.register(summaryRoute, { prefix: "/matches" });
server.register(playersRoute, { prefix: "/players" });
server.register(historyRoute, { prefix: "/history" });
server.register(dashboardRoute, { prefix: "/dashboard" });

server.get("/", async (request, reply) => {
  return { status: "ok" };
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
