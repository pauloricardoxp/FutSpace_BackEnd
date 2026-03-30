import { FastifyInstance } from "fastify";
import { historyController } from "../controllers/historyController";
import { historySchemas } from "../schemas/historySchemas";

export async function historyRoute(server: FastifyInstance) {
  const controller = new historyController(server.prisma);

  server.get(
    "/",
    { schema: historySchemas.getHistory, preHandler: [server.authenticate] },
    controller.getHistory.bind(controller),
  );
}
