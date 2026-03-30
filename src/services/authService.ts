import { PrismaClient } from "@prisma/client";
import { authLogin, authRegister } from "../types/auth";
import bcrypt from "bcrypt";

export class authService {
  constructor(private prisma: PrismaClient) {}

  async register(data: authRegister) {
    const exists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("Email já cadastrado");
    }

    const passwordhas = await bcrypt.hash(data.password, 10);

    return await this.prisma.users.create({
      data: {
        ...data,
        password: passwordhas,
      },
      select: {
        id_usuario: true,
        name: true,
        email: true,
      },
    });
  }

  async login(data: authLogin) {
    const users = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!users) {
      throw new Error("Email ou senha inválidos");
    }

    const passwordValid = await bcrypt.compare(data.password, users.password);

    if (!passwordValid) {
      throw new Error("Email ou senha inválidos");
    }

    return users;
  }
}
