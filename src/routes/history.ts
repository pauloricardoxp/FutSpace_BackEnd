import { FastifyInstance } from "fastify";
import { historyController } from "../controllers/historyController.js";
import { historySchemas } from "../schemas/historySchemas.js";

export async function historyRoute(server: FastifyInstance) {
  const controller = new historyController(server.prisma);

  server.get(
    "/",
    { schema: historySchemas.getHistory, preHandler: [server.authenticate] },
    controller.getHistory.bind(controller),
  );
}
