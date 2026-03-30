import { FastifyInstance } from "fastify";
import { playersController } from "../controllers/playerController";
import { playersSchemas } from "../schemas/playersSchemas";

export async function playersRoute(server: FastifyInstance) {
  const playercontroller = new playersController(server.prisma);

  server.post(
    "/:id/add",
    { schema: playersSchemas.add, preHandler: [server.authenticate] },
    playercontroller.addPlayer.bind(playercontroller),
  );

  server.post(
    "/search",
    { schema: playersSchemas.search, preHandler: [server.authenticate] },
    playercontroller.searchPlayers.bind(playercontroller),
  );
}
