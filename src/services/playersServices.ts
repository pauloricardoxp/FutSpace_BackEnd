import { PrismaClient } from "@prisma/client";
import { playersCreate } from "../types/players.js";
import { AppError } from "../utils/errorHandler.js";

export class playerServices {
  constructor(private prisma: PrismaClient) {}

  async addPlayer(data: playersCreate, id_matches: number, id_usuario: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new AppError("Partida nao encontrada", 404);
    }

    if (matches.id_usuario !== id_usuario) {
      throw new AppError(
        "Você não tem permissão para adicionar jogadores a esta partida",
        403,
      );
    }

    if (matches.status !== "pending") {
      throw new AppError(
        "Voce nao pode adicionar jogador numa partida que esta iniciada ou finalizada",
        422,
      );
    }

    if (data.id_usuario) {
      const userAlreadyAdded = await this.prisma.players.findFirst({
        where: {
          id_matches,
          id_usuario: data.id_usuario,
        },
      });

      if (userAlreadyAdded) {
        throw new AppError("Este usuário já foi adicionado a esta partida", 409);
      }
    }

    const totalPlayers = await this.prisma.players.count({
      where: { id_matches },
    });

    const maxPlayers = matches.num_teams * matches.players_per_team;

    if (totalPlayers >= maxPlayers) {
      throw new AppError("Número máximo de jogadores atingido", 409);
    }

    return await this.prisma.players.create({
      data: {
        name: data.name,
        position: data.position,
        is_guest: data.is_guest,
        id_matches,
        ...(data.id_usuario ? { id_usuario: data.id_usuario } : {}),
      },
    });
  }

  async searchUsers(name: string) {
    return await this.prisma.users.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id_usuario: true,
        name: true,
        photo: true,
      },
    });
  }

  async deletePlayer(
    id_matches: number,
    id_players: number,
    id_usuario: number,
  ) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new AppError("Partida não encontrada", 404);
    }

    if (matches.id_usuario !== id_usuario) {
      throw new AppError(
        "Você não tem permissão para remover jogadores desta partida",
        403,
      );
    }

    if (matches.status !== "pending") {
      throw new AppError(
        "Você não pode remover jogadores de uma partida que está iniciada ou finalizada",
        422,
      );
    }

    const player = await this.prisma.players.findUnique({
      where: { id_players },
    });

    if (!player) {
      throw new AppError("Jogador não encontrado", 404);
    }

    if (player.id_matches !== id_matches) {
      throw new AppError("Jogador não pertence a esta partida", 403);
    }

    return await this.prisma.players.delete({
      where: { id_players },
      select: {
        id_players: true,
        name: true,
        position: true,
      },
    });
  }
}
