import { FastifyInstance } from "fastify";
import { dashboardController } from "../controllers/dashboardController.js";
import { dashboardSchemas } from "../schemas/dashboardSchemas.js";

export async function dashboardRoute(fastify: FastifyInstance) {
  const dashboardcontroller = new dashboardController(fastify.prisma);

  fastify.get(
    "/",
    { schema: dashboardSchemas.getDashboard },
    async (req, res) => {
      await fastify.authenticate(req, res);
      await dashboardcontroller.getDashboard(req, res);
    },
  );
}
