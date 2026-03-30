import { FastifyInstance } from "fastify";
import { eventController } from "../controllers/eventController";

export async function eventsRoute(server: FastifyInstance) {
  const eventscontroller = new eventController(server.prisma);

  server.post(
    "/:id/events",
    { preHandler: [server.authenticate] },
    eventscontroller.create.bind(eventscontroller),
  );
}
