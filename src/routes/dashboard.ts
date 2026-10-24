import { FastifyInstance } from "fastify";
import { dashboardController } from "../controllers/dashboardController.js";
import { dashboardSchemas } from "../schemas/dashboardSchemas.js";
import { eventController } from "../controllers/eventController.js";

export async function dashboardRoute(server: FastifyInstance) {
  const dashboardcontroller = new dashboardController(server.prisma);

  server.get(
    "/",
    { schema: dashboardSchemas.getDashboard, preHandler: [server.authenticate] },
    dashboardcontroller.getDashboard.bind(dashboardcontroller),
  );
}
