import "./types/fastify";
import fastify from "fastify";
import jwtPlugin from "./plugins/jwt";
import prismaPlugin from "./plugins/prisma";
import helmetPlugin from "./plugins/helmet";
import rateLimitPlugin from "./plugins/rateLimit";
import corsPlugin from "./plugins/cors";
import { authRoutes } from "./routes/auth";
import { matchesRoute } from "./routes/matches";
import { playersRoute } from "./routes/players";
import { teamsRoute } from "./routes/teams";
import { eventsRoute } from "./routes/events";
import { summaryRoute } from "./routes/summary";
import { historyRoute } from "./routes/history";
import { dashboardRoute } from "./routes/dashboard";
import { healthRoute } from "./routes/health";
import swagger from "@fastify/swagger";
import scalarPlugin from "@scalar/fastify-api-reference";
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

server.register(authRoutes, { prefix: "/auth" });
server.register(matchesRoute, { prefix: "/matches" });
server.register(teamsRoute, { prefix: "/matches" });
server.register(eventsRoute, { prefix: "/matches" });
server.register(summaryRoute, { prefix: "/matches" });
server.register(playersRoute, { prefix: "/players" });
server.register(historyRoute, { prefix: "/history" });
server.register(dashboardRoute, { prefix: "/dashboard" });
server.register(healthRoute);

const start = async () => {
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    console.log("Servidor rodando em http://localhost:8080");

    console.log("\nIniciando auto-ping a cada 5 minutos...\n");

    setInterval(
      async () => {
        try {
          const response = await fetch("http://localhost:8080/ping");
          const data = await response.json();
          console.log(
            `\n PING OK - ${new Date().toLocaleString("pt-BR")} - Status: ${data.status}\n`,
          );
        } catch (err) {
          console.error(
            `\n PING ERRO - ${new Date().toLocaleString("pt-BR")} - ${err}\n`,
          );
        }
      },
      5 * 60 * 1000,
    );
    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:8080/ping");
        const data = await response.json();
        console.log(`\n PING INICIAL OK - Status: ${data.status}\n`);
      } catch (err) {
        console.error(`\n PING INICIAL ERRO - ${err}\n`);
      }
    }, 2000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
