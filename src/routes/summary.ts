import { FastifyInstance } from "fastify";
import { summaryController } from "../controllers/summaryController";
import { summarySchemas } from "../schemas/summarySchemas";

export async function summaryRoute(server: FastifyInstance) {
  const controller = new summaryController(server.prisma);

  server.get(
    "/:id/summary",
    {
      schema: summarySchemas.getMatchSummary,
      preHandler: [server.authenticate],
    },
    controller.getMatchSummary.bind(controller),
  );
}
