import { PrismaClient } from "@prisma/client";
import { eventsService } from "../services/eventsService";
import { FastifyReply, FastifyRequest } from "fastify";
import { eventCreate } from "../types/events";
import { handleError } from "../utils/errorHandler";

export class eventController {
  private eventService: eventsService;

  constructor(prisma: PrismaClient) {
    this.eventService = new eventsService(prisma);
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    const body = req.body as eventCreate;

    try {
      const events = await this.eventService.create(Number(id), body);
      res.code(201).send(events);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
