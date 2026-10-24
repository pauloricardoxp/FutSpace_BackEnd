import { PrismaClient } from "@prisma/client";
import { authLogin, authRegister } from "../types/auth.js";
import * as bcrypt from "bcrypt";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators.js";
import { AppError } from "../utils/errorHandler.js";

export class authService {
  constructor(private prisma: PrismaClient) {}

  async register(data: authRegister) {
    if (!validateName(data.name)) {
      throw new AppError("Nome deve ter entre 3 e 100 caracteres", 400);
    }

    if (!validateEmail(data.email)) {
      throw new AppError("Email inválido", 400);
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.errors.join(". "), 400);
    }

    const exists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new AppError("Email já cadastrado", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return await this.prisma.users.create({
      data: {
        ...data,
        password: passwordHash,
      },
      select: {
        id_usuario: true,
        name: true,
        email: true,
      },
    });
  }

  async login(data: authLogin) {
    if (!validateEmail(data.email)) {
      throw new AppError("Email inválido", 400);
    }

    const users = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (!users) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const passwordValid = await bcrypt.compare(data.password, users.password);

    if (!passwordValid) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    return {
      id_usuario: users.id_usuario,
      name: users.name,
      email: users.email,
    };
  }
}
