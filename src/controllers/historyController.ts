import { PrismaClient } from "@prisma/client";
import { historyService } from "../services/historyService";
import { FastifyReply, FastifyRequest } from "fastify";

export class historyController {
  private historyService: historyService;

  constructor(prisma: PrismaClient) {
    this.historyService = new historyService(prisma);
  }

  async getHistory(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };

    try {
      const history = await this.historyService.getHistory(Number(id));
      res.code(200).send(history);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }
}
