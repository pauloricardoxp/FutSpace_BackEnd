import { PrismaClient } from "@prisma/client";

export class teamsService {
  constructor(private prisma: PrismaClient) {}

  async drawTeams(id_matches: number) {
    const match = await this.prisma.matches.findUnique({
      where: {
        id_matches,
      },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
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

    // Separa goleiros e linha
    const goalkeepers = players.filter((p) => p.position === "goleiro");
    const outfield = players.filter((p) => p.position !== "goleiro");

    if (goalkeepers.length < match.num_teams) {
      throw new Error(
        `A partida precisa de pelo menos ${match.num_teams} goleiros`,
      );
    }

    // Embaralha os arrays
    const shuffledGoalkeepers = this.shuffle(goalkeepers);
    const shuffledOutfield = this.shuffle(outfield);

    // Cria os times e distribui jogadores
    const results = [];

    for (let i = 0; i < match.num_teams; i++) {
      // Cria o time
      const team = await this.prisma.teams.create({
        data: {
          id_matches,
          name: `Time ${i + 1}`,
          goals: 0,
        },
      });

      // Jogadores deste time: 1 goleiro + restante de linha
      const playersPerTeam = match.players_per_team - 1; // -1 pro goleiro
      const teamPlayers = [
        shuffledGoalkeepers[i],
        ...shuffledOutfield.splice(0, playersPerTeam),
      ];

      // Atualiza id_time em cada jogador
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
}
