import { PrismaClient } from "@prisma/client";
import { playersCreate } from "../types/players.js";
import { AppError } from "../utils/errorHandler.js";
import { isValidPosition, toMacroPosition } from "../utils/sports.js";
import { Category } from "@prisma/client";

export class playerServices {
  constructor(private prisma: PrismaClient) {}

  async addPlayer(data: playersCreate, id_matches: number, id_usuario: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new AppError("Partida nao encontrada", 404);
    }
    if (
      data.shirt_number !== undefined &&
      data.shirt_number !== null &&
      (!Number.isInteger(data.shirt_number) || data.shirt_number < 1 || data.shirt_number > 99)
    ) {
      throw new AppError("O número da camisa deve ser um inteiro entre 1 e 99", 400);
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
      const user = await this.prisma.users.findUnique({
        where: { id_usuario: data.id_usuario },
        include: {
          profiles: {
            where: { sport: matches.sport, category: matches.category },
          },
        },
      });
      if (!user) throw new AppError("Usuário não encontrado", 404);
      const userAlreadyAdded = await this.prisma.players.findFirst({
        where: {
          id_matches,
          id_usuario: data.id_usuario,
        },
      });

      if (userAlreadyAdded) {
        throw new AppError("Este usuário já foi adicionado a esta partida", 409);
      }

      const fieldPosition = data.field_position ?? (
        data.position === "goleiro" ? "goleiro" : user.profiles[0]?.position
      );
      if (!fieldPosition && !data.position) {
        throw new AppError("Informe a posição do jogador", 400);
      }
      if (fieldPosition && !isValidPosition(matches.category, fieldPosition)) {
        throw new AppError("Posição inválida para a categoria da partida", 400);
      }
      if (fieldPosition) {
        data.field_position = fieldPosition;
        data.position = toMacroPosition(fieldPosition);
      }
      data.shirt_number ??= user.profiles[0]?.shirt_number;
    } else {
      if (!data.field_position && !data.position) {
        throw new AppError("Informe a posição do jogador", 400);
      }
      if (data.field_position && !isValidPosition(matches.category, data.field_position)) {
        throw new AppError("Posição inválida para a categoria da partida", 400);
      }
      if (!data.field_position && data.position === "goleiro") data.field_position = "goleiro";
      if (data.field_position) data.position = toMacroPosition(data.field_position);
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
        field_position: data.field_position,
        shirt_number: data.shirt_number,
        is_guest: data.is_guest,
        id_matches,
        ...(data.id_usuario ? { id_usuario: data.id_usuario } : {}),
      },
    });
  }

  async searchUsers(name: string, category?: string) {
    if (name.trim().length < 2) {
      throw new AppError("Informe pelo menos 2 letras para buscar", 400);
    }
    if (category && !Object.values(Category).includes(category as Category)) {
      throw new AppError("Categoria inválida", 400);
    }
    return await this.prisma.users.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 20,
      select: {
        id_usuario: true,
        name: true,
        photo: true,
        profiles: {
          where: category ? { category: category as Category } : undefined,
          select: { category: true, position: true, shirt_number: true },
        },
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
