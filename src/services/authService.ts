import { PrismaClient } from "@prisma/client";
import { authLogin, authRegister } from "../types/auth";
import bcrypt from "bcrypt";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators";

export class authService {
  constructor(private prisma: PrismaClient) {}

  async register(data: authRegister) {
    // Validar name
    if (!validateName(data.name)) {
      throw new Error("Nome deve ter entre 3 e 100 caracteres");
    }

    // Validar email
    if (!validateEmail(data.email)) {
      throw new Error("Email inválido");
    }

    // Validar senha
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join(". "));
    }

    // Verificar se email já existe
    const exists = await this.prisma.users.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      throw new Error("Email já cadastrado");
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
    // Validar email
    if (!validateEmail(data.email)) {
      throw new Error("Email inválido");
    }

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
