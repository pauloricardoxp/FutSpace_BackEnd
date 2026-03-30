import { PrismaClient } from "@prisma/client";
import { authService } from "../services/authService";
import { FastifyReply, FastifyRequest } from "fastify";
import { authLogin, authRegister } from "../types/auth";

export class authController {
  private authService: authService;

  constructor(prisma: PrismaClient) {
    this.authService = new authService(prisma);
  }

  async register(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authRegister;
    try {
      const users = await this.authService.register(body);
      res.code(201).send(users);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authLogin;
    try {
      const users = await this.authService.login(body);

      const token = req.server.jwt.sign({
        id: users.id_usuario,
        email: users.email,
      });
      return res.code(200).send({ token });
    } catch (err: any) {
      return res.code(400).send({ error: err.message });
    }
  }
}
