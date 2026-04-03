import { FastifyInstance } from "fastify";
import { teamsController } from "../controllers/teamsController.js";
import { teamsSchemas } from "../schemas/teamsSchemas.js";

export async function teamsRoute(server: FastifyInstance) {
  const teamscontroller = new teamsController(server.prisma);

  server.post(
    "/:id/teams/draw",
    { schema: teamsSchemas.draw, preHandler: [server.authenticate] },
    teamscontroller.drawTeams.bind(teamscontroller),
  );

  server.get(
    "/:id/teams",
    { schema: teamsSchemas.getTeams, preHandler: [server.authenticate] },
    teamscontroller.getTeams.bind(teamscontroller),
  );
}
