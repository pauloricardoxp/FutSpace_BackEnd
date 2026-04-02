import { PrismaClient } from "@prisma/client";

export class teamsService {
  constructor(private prisma: PrismaClient) {}

  async drawTeams(id_matches: number, id_usuario: number) {
    const match = await this.prisma.matches.findUnique({
      where: {
        id_matches,
      },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    if (match.id_usuario !== id_usuario) {
      throw new Error(
        "Você não tem permissão para sortear times desta partida",
      );
    }

    if (match.status !== "pending") {
      throw new Error("O sorteio só pode ser feito em partidas pendentes");
    }

    const players = await this.prisma.players.findMany({
      where: { id_matches },
    });

    const maxPlayers = match.num_teams * match.players_per_team;
    if (players.length < maxPlayers) {
      throw new Error(
        `A partida precisa de ${maxPlayers} jogadores para sortear`,
      );
    }

    const goalkeepers = players.filter((p) => p.position === "goleiro");
    const outfield = players.filter((p) => p.position !== "goleiro");

    if (goalkeepers.length < match.num_teams) {
      throw new Error(
        `A partida precisa de pelo menos ${match.num_teams} goleiros`,
      );
    }

    await this.prisma.teams.deleteMany({
      where: { id_matches },
    });

    await this.prisma.players.updateMany({
      where: { id_matches },
      data: { id_time: null },
    });

    const shuffledGoalkeepers = this.shuffle(goalkeepers);
    const shuffledOutfield = this.shuffle(outfield);

    const results = [];

    for (let i = 0; i < match.num_teams; i++) {
      const team = await this.prisma.teams.create({
        data: {
          id_matches,
          name: `Time ${i + 1}`,
          goals: 0,
        },
      });

      const playersPerTeam = match.players_per_team - 1;
      const teamPlayers = [
        shuffledGoalkeepers[i],
        ...shuffledOutfield.splice(0, playersPerTeam),
      ];

      await this.prisma.players.updateMany({
        where: {
          id_players: { in: teamPlayers.map((p) => p.id_players) },
        },
        data: { id_time: team.id_time },
      });

      results.push({ team, players: teamPlayers });
    }

    return results;
  }

  private shuffle<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  async getTeams(id_matches: number) {
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
