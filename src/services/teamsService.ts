import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorHandler.js";

export class teamsService {
  constructor(private prisma: PrismaClient) {}

  async drawTeams(id_matches: number, id_usuario: number) {
    const match = await this.prisma.matches.findUnique({
      where: {
        id_matches,
      },
    });

    if (!match) {
      throw new AppError("Partida não encontrada", 404);
    }

    if (match.id_usuario !== id_usuario) {
      throw new AppError(
        "Você não tem permissão para sortear times desta partida",
        403,
      );
    }

    if (match.status !== "pending") {
      throw new AppError("O sorteio só pode ser feito em partidas pendentes", 422);
    }

    const players = await this.prisma.players.findMany({
      where: { id_matches },
    });

    const maxPlayers = match.num_teams * match.players_per_team;
    if (players.length < maxPlayers) {
      throw new AppError(
        `A partida precisa de ${maxPlayers} jogadores para sortear`,
        422,
      );
    }

    const goalkeepers = players.filter((p) => p.position === "goleiro");
    const outfield = players.filter((p) => p.position !== "goleiro");

    if (goalkeepers.length < match.num_teams) {
      throw new AppError(
        `A partida precisa de pelo menos ${match.num_teams} goleiros`,
        422,
      );
    }

    const shuffledGoalkeepers = this.shuffle(goalkeepers);
    const shuffledOutfield = this.shuffle(outfield);

    const results: {
      team: {
        id_time: number;
        name: string;
        id_matches: number;
        goals: number;
      };
      players: typeof players;
    }[] = [];

    return this.prisma.$transaction(async (tx) => {
      await tx.teams.deleteMany({ where: { id_matches } });
      await tx.players.updateMany({
        where: { id_matches },
        data: { id_time: null },
      });

      const availablePlayers = this.shuffle([
        ...shuffledGoalkeepers.slice(match.num_teams),
        ...shuffledOutfield,
      ]);

      for (let i = 0; i < match.num_teams; i++) {
        const team = await tx.teams.create({
          data: { id_matches, name: `Time ${i + 1}`, goals: 0 },
        });
        const teamPlayers = [
          shuffledGoalkeepers[i],
          ...availablePlayers.splice(0, match.players_per_team - 1),
        ];

        await tx.players.updateMany({
          where: { id_players: { in: teamPlayers.map((p) => p.id_players) } },
          data: { id_time: team.id_time },
        });
        results.push({ team, players: teamPlayers });
      }
      return results;
    });
  }

  private shuffle<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  async getTeams(id_matches: number, id_usuario: number) {
    const match = await this.prisma.matches.findUnique({
      where: { id_matches },
      select: { id_usuario: true, players: { select: { id_usuario: true } } },
    });
    if (!match) throw new AppError("Partida não encontrada", 404);
    if (
      match.id_usuario !== id_usuario &&
      !match.players.some((player) => player.id_usuario === id_usuario)
    ) {
      throw new AppError("Acesso negado", 403);
    }

    const teams = await this.prisma.teams.findMany({
      where: { id_matches },
      include: { players: true },
    });

    return teams.map((team) => ({
      team: { id_time: team.id_time, name: team.name, goals: team.goals },
      players: team.players,
    }));
  }
}
