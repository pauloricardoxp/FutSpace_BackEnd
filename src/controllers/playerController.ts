import { PrismaClient } from "@prisma/client";
import { playerServices } from "../services/playersServices.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { playersCreate } from "../types/players.js";
import { handleError } from "../utils/errorHandler.js";

export class playersController {
  private playersService: playerServices;

  constructor(prisma: PrismaClient) {
    this.playersService = new playerServices(prisma);
  }

  async addPlayer(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    const body = req.body as playersCreate;
    const id_usuario = (req.user as any).id;

    try {
      const players = await this.playersService.addPlayer(
        body,
        Number(id),
        id_usuario,
      );
      res.code(201).send(players);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async searchPlayers(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.query as { name: string };

    if (!name || name.trim() === "") {
      return res.code(400).send({ error: "Informe um nome para buscar" });
    }
    try {
      const players = await this.playersService.searchUsers(name);
      res.code(200).send(players);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async deletePlayer(req: FastifyRequest, res: FastifyReply) {
    const { id_matches, id_players } = req.params as {
      id_matches: string;
      id_players: string;
    };
    const id_usuario = (req.user as any).id;

    try {
      const result = await this.playersService.deletePlayer(
        Number(id_matches),
        Number(id_players),
        id_usuario,
      );
      res.code(200).send(result);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
