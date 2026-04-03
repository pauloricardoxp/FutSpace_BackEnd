import { FastifyInstance } from "fastify";
import { matchesController } from "../controllers/matchesController.js";
import { matchesSchemas } from "../schemas/matchesSchemas.js";

export async function matchesRoute(server: FastifyInstance) {
  const matchescontroller = new matchesController(server.prisma);

  server.post(
    "/",
    { schema: matchesSchemas.create, preHandler: [server.authenticate] },
    matchescontroller.create.bind(matchescontroller),
  );

  server.get(
    "/",
    { schema: matchesSchemas.list, preHandler: [server.authenticate] },
    matchescontroller.getByUsers.bind(matchescontroller),
  );

  server.get(
    "/:id",
    { schema: matchesSchemas.getById, preHandler: [server.authenticate] },
    matchescontroller.getById.bind(matchescontroller),
  );

  server.patch(
    "/:id_matches/finish",
    { schema: matchesSchemas.finish, preHandler: [server.authenticate] },
    matchescontroller.finish.bind(matchescontroller),
  );

  server.patch(
    "/:id_matches/start",
    { schema: matchesSchemas.start, preHandler: [server.authenticate] },
    matchescontroller.start.bind(matchescontroller),
  );
}
