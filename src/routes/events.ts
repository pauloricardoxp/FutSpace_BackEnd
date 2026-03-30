import { FastifyInstance } from "fastify";
import { eventController } from "../controllers/eventController";
import { eventsSchemas } from "../schemas/eventsSchemas";

export async function eventsRoute(server: FastifyInstance) {
  const eventscontroller = new eventController(server.prisma);

  server.post(
    "/:id/events",
    { schema: eventsSchemas.create, preHandler: [server.authenticate] },
    eventscontroller.create.bind(eventscontroller),
  );
}
