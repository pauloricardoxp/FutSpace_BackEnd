import { PrismaClient } from "@prisma/client";
import { summaryService } from "../services/summaryService";
import { FastifyReply, FastifyRequest } from "fastify";

export class summaryController {
  private summaryService: summaryService;

  constructor(prisma: PrismaClient) {
    this.summaryService = new summaryService(prisma);
  }

  async getMatchSummary(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };

    try {
      const summary = await this.summaryService.getMatchSummary(Number(id));
      res.code(200).send(summary);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }
}
