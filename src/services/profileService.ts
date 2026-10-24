import { PrismaClient } from "@prisma/client";
import { ProfileInput, ProfileUpdate } from "../types/profile.js";
import { AppError } from "../utils/errorHandler.js";
import {
  isValidCategory,
  isValidPosition,
  isValidSport,
} from "../utils/sports.js";

export class profileService {
  constructor(private prisma: PrismaClient) {}

  private validate(data: ProfileInput | ProfileUpdate) {
    if (data.sport && !isValidSport(data.sport)) {
      throw new AppError("Esporte inválido", 400);
    }

    if (data.category && !isValidCategory(data.category)) {
      throw new AppError("Categoria inválida", 400);
    }

    if (
      data.category &&
      data.position &&
      !isValidPosition(data.category, data.position)
    ) {
      throw new AppError("Posição inválida para a categoria", 400);
    }

    if (
      data.shirt_number !== undefined &&
      data.shirt_number !== null &&
      (!Number.isInteger(data.shirt_number) ||
        data.shirt_number < 1 ||
        data.shirt_number > 99)
    ) {
      throw new AppError(
        "O número da camisa deve ser um inteiro entre 1 e 99",
        400,
      );
    }
  }

  async getMe(id_usuario: number) {
    const user = await this.prisma.users.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        name: true,
        email: true,
        photo: true,
        profiles: true,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return {
      ...user,
      has_profile: user.profiles.length > 0,
    };
  }

  async updateMe(id_usuario: number, name: string) {
    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      throw new AppError("Nome deve ter entre 3 e 100 caracteres", 400);
    }

    return await this.prisma.users.update({
      where: { id_usuario },
      data: { name: name.trim() },
      select: {
        id_usuario: true,
        name: true,
        email: true,
        photo: true,
      },
    });
  }

  async listProfiles(id_usuario: number) {
    return await this.prisma.playerProfiles.findMany({
      where: { id_usuario },
      orderBy: { created_at: "asc" },
    });
  }

  async createProfile(id_usuario: number, data: ProfileInput) {
    this.validate(data);

    const exists = await this.prisma.playerProfiles.findUnique({
      where: {
        id_usuario_sport_category: {
          id_usuario,
          sport: data.sport,
          category: data.category,
        },
      },
    });

    if (exists) {
      throw new AppError("Perfil já cadastrado para esta categoria", 409);
    }

    return await this.prisma.playerProfiles.create({
      data: {
        id_usuario,
        sport: data.sport,
        category: data.category,
        position: data.position,
        shirt_number: data.shirt_number,
      },
    });
  }

  async updateProfile(
    id_usuario: number,
    id_profile: number,
    data: ProfileUpdate,
  ) {
    const profile = await this.prisma.playerProfiles.findUnique({
      where: { id_profile },
    });

    if (!profile) {
      throw new AppError("Perfil não encontrado", 404);
    }

    if (profile.id_usuario !== id_usuario) {
      throw new AppError("Acesso negado", 403);
    }

    const nextProfile = {
      sport: data.sport ?? profile.sport,
      category: data.category ?? profile.category,
      position: data.position ?? profile.position,
      shirt_number:
        data.shirt_number === undefined
          ? profile.shirt_number
          : data.shirt_number,
    };

    this.validate(nextProfile);

    const duplicate = await this.prisma.playerProfiles.findFirst({
      where: {
        id_usuario,
        sport: nextProfile.sport,
        category: nextProfile.category,
        NOT: { id_profile },
      },
    });

    if (duplicate) {
      throw new AppError("Perfil já cadastrado para esta categoria", 409);
    }

    return await this.prisma.playerProfiles.update({
      where: { id_profile },
      data: nextProfile,
    });
  }

  async deleteProfile(id_usuario: number, id_profile: number) {
    const profile = await this.prisma.playerProfiles.findUnique({
      where: { id_profile },
    });

    if (!profile) {
      throw new AppError("Perfil não encontrado", 404);
    }

    if (profile.id_usuario !== id_usuario) {
      throw new AppError("Acesso negado", 403);
    }

    return await this.prisma.playerProfiles.delete({
      where: { id_profile },
    });
  }
}
