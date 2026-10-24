import { PrismaClient } from "@prisma/client";
import { dashboardService } from "../services/dashboardService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/errorHandler.js";

export class dashboardController {
  private dashboardService: dashboardService;

  constructor(prisma: PrismaClient) {
    this.dashboardService = new dashboardService(prisma);
  }

  async getDashboard(req: FastifyRequest, res: FastifyReply) {
    try {
      const id_usuario = (req.user as any).id;
      const dashboard = await this.dashboardService.getDashboard(id_usuario);
      res.code(200).send(dashboard);
    } catch (err: any) {
      req.log.error({ err }, "Dashboard request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
