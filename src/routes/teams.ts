import { FastifyInstance } from "fastify";
import { teamsController } from "../controllers/teamsController";

export async function teamsRoute(server: FastifyInstance) {
  const teamscontroller = new teamsController(server.prisma);

  server.post(
    "/matches/:id/draw",
    { preHandler: [server.authenticate] },
    teamscontroller.drawTeams.bind(teamscontroller),
  );
}
