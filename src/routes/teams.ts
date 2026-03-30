import { FastifyInstance } from "fastify";
import { teamsController } from "../controllers/teamsController";
import { teamsSchemas } from "../schemas/teamsSchemas";

export async function teamsRoute(server: FastifyInstance) {
  const teamscontroller = new teamsController(server.prisma);

  server.post(
    "/:id/teams/draw",
    { schema: teamsSchemas.draw, preHandler: [server.authenticate] },
    teamscontroller.drawTeams.bind(teamscontroller),
  );
}
