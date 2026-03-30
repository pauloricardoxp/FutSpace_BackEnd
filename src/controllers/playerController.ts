import { PrismaClient } from "@prisma/client";
import { playerServices } from "../services/playersServices";
import { FastifyReply, FastifyRequest } from "fastify";
import { playersCreate } from "../types/players";

export class playersController {
  private playersService: playerServices;

  constructor(prisma: PrismaClient) {
    this.playersService = new playerServices(prisma);
  }

  async addPlayer(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    const body = req.body as playersCreate;

    try {
      const players = await this.playersService.addPlayer(body, id);
      res.code(201).send(players);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
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
      res.code(500).send({ error: err.message });
    }
  }
}
