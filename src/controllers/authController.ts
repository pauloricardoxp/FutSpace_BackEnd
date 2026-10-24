import { PrismaClient } from "@prisma/client";
import { authService } from "../services/authService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { authLogin, authRegister } from "../types/auth.js";
import { handleError, shouldLogError } from "../utils/errorHandler.js";

export class authController {
  private authService: authService;

  constructor(prisma: PrismaClient) {
    this.authService = new authService(prisma);
  }

  private signToken(req: FastifyRequest, id_usuario: number, email: string) {
    return req.server.jwt.sign({ id: id_usuario, email });
  }

  async register(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authRegister;
    try {
      const users = await this.authService.register(body);
      res.code(201).send({
        token: this.signToken(req, users.id_usuario, users.email),
        id_usuario: users.id_usuario,
        name: users.name,
        email: users.email,
        photo: users.photo,
        has_profile: users.profiles.length > 0,
      });
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Auth request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authLogin;
    try {
      const users = await this.authService.login(body);

      const token = this.signToken(req, users.id_usuario, users.email);
      return res.code(200).send({
        token,
        id_usuario: users.id_usuario,
        name: users.name,
        email: users.email,
        photo: users.photo,
        has_profile: users.has_profile,
      });
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Auth request failed");
      const { statusCode, message } = handleError(err);
      return res.code(statusCode).send({ error: message });
    }
  }
}
