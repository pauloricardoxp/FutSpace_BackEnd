import { FastifyInstance } from "fastify";
import { summaryController } from "../controllers/summaryController";

export async function summaryRoute(server: FastifyInstance) {
  const controller = new summaryController(server.prisma);

  server.get(
    "/matches/:id",
    { preHandler: [server.authenticate] },
    controller.getMatchSummary.bind(controller),
  );
}