import { FastifyInstance } from "fastify";
import { summaryController } from "../controllers/summaryController.js";
import { summarySchemas } from "../schemas/summarySchemas.js";

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
