import { PrismaClient } from "@prisma/client";
import { playersCreate } from "../types/players.js";

export class playerServices {
  constructor(private prisma: PrismaClient) {}

  async addPlayer(data: playersCreate, id_matches: number, id_usuario: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new Error("Partida nao encontrada");
    }

    if (matches.id_usuario !== id_usuario) {
      throw new Error(
        "Você não tem permissão para adicionar jogadores a esta partida",
      );
    }

    if (matches.status !== "pending") {
      throw new Error(
        "Voce nao pode adicionar jogador numa partida que esta iniciada ou finalizada",
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
        throw new Error("Este usuário já foi adicionado a esta partida");
      }
    }

    const totalPlayers = await this.prisma.players.count({
      where: { id_matches },
    });

    const maxPlayers = matches.num_teams * matches.players_per_team;

    if (totalPlayers >= maxPlayers) {
      throw new Error("Número máximo de jogadores atingido");
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
        email: true,
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
      throw new Error("Partida não encontrada");
    }

    if (matches.id_usuario !== id_usuario) {
      throw new Error(
        "Você não tem permissão para remover jogadores desta partida",
      );
    }

    if (matches.status !== "pending") {
      throw new Error(
        "Você não pode remover jogadores de uma partida que está iniciada ou finalizada",
      );
    }

    const player = await this.prisma.players.findUnique({
      where: { id_players },
    });

    if (!player) {
      throw new Error("Jogador não encontrado");
    }

    if (player.id_matches !== id_matches) {
      throw new Error("Jogador não pertence a esta partida");
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
