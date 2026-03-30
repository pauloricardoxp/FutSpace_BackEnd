import { PrismaClient } from "@prisma/client";
import { playersCreate } from "../types/players";
import { useType } from "../types/auth";

export class playerServices {
  constructor(private prisma: PrismaClient) {}

  async addPlayer(data: playersCreate, id_matches: number) {
    const matches = await this.prisma.matches.findUnique({
      where: {
        id_matches,
      },
    });

    if (!matches) {
      throw new Error("Partida nao encontrada");
    }

    if (matches.status !== "pending") {
      throw new Error(
        "Voce nao pode adicionar jogador numa partida que esta iniciada ou finalizada",
      );
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
}
