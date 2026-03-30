import { FastifyInstance } from "fastify";
import { matchesController } from "../controllers/matchesController";

export async function matchesRoute(server: FastifyInstance) {
  const matchescontroller = new matchesController(server.prisma);

  server.post(
    "/",
    { preHandler: [server.authenticate] },
    matchescontroller.create.bind(matchescontroller),
  );

  server.get(
    "/",
    { preHandler: [server.authenticate] },
    matchescontroller.getByUsers.bind(matchescontroller),
  );

  server.get(
    "/:id",
    { preHandler: [server.authenticate] },
    matchescontroller.getById.bind(matchescontroller),
  );

  server.patch(
    "/:id_matches/finish",
    { preHandler: [server.authenticate] },
    matchescontroller.finish.bind(matchescontroller),
  );

  server.patch(
    "/:id_matches/start",
    { preHandler: [server.authenticate] },
    matchescontroller.start.bind(matchescontroller),
  );
}
