import { PrismaClient } from "@prisma/client";
import { summaryService } from "../services/summaryService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, shouldLogError } from "../utils/errorHandler.js";

export class summaryController {
  private summaryService: summaryService;

  constructor(prisma: PrismaClient) {
    this.summaryService = new summaryService(prisma);
  }

  async getMatchSummary(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const { id: id_usuario } = req.user as { id: number };

    try {
      const summary = await this.summaryService.getMatchSummary(Number(id), id_usuario);
      res.code(200).send(summary);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Summary request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
