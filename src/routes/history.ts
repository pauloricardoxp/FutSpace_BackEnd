import { FastifyInstance } from "fastify";
import { historyController } from "../controllers/historyController";

export async function historyRoute(server: FastifyInstance) {
  const controller = new historyController(server.prisma);

  server.get(
    "/",
    { preHandler: [server.authenticate] },
    controller.getHistory.bind(controller),
  );
}