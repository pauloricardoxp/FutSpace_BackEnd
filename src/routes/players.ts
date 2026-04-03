import { FastifyInstance } from "fastify";
import { playersController } from "../controllers/playerController.js";
import { playersSchemas } from "../schemas/playersSchemas.js";

export async function playersRoute(server: FastifyInstance) {
  const playercontroller = new playersController(server.prisma);

  server.post(
    "/:id/add",
    { schema: playersSchemas.add, preHandler: [server.authenticate] },
    playercontroller.addPlayer.bind(playercontroller),
  );

  server.get(
    "/search",
    { schema: playersSchemas.search, preHandler: [server.authenticate] },
    playercontroller.searchPlayers.bind(playercontroller),
  );

  server.delete(
    "/:id_matches/:id_players",
    { schema: playersSchemas.delete, preHandler: [server.authenticate] },
    playercontroller.deletePlayer.bind(playercontroller),
  );
}
