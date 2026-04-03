import { FastifyInstance } from "fastify";
import { eventController } from "../controllers/eventController.js";
import { eventsSchemas } from "../schemas/eventsSchemas.js";

export async function eventsRoute(server: FastifyInstance) {
  const eventscontroller = new eventController(server.prisma);

  server.post(
    "/:id/events",
    { schema: eventsSchemas.create, preHandler: [server.authenticate] },
    eventscontroller.create.bind(eventscontroller),
  );
}
