import { PrismaClient } from "@prisma/client";

export class dashboardService {
  constructor(private prisma: PrismaClient) {}

  async getDashboard(id_usuario: number) {
    const user = await this.prisma.users.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const allMatches = await this.prisma.matches.findMany({
      where: {
        status: "finished",
        players: {
          some: {
            id_usuario,
          },
        },
      },
      include: {
        teams: true,
        events: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const totalMatches = allMatches.length;

    let totalGoals = 0;
    const userGoals = allMatches.flatMap((match) =>
      match.events.filter(
        (e) => e.type === "goal" && e.id_player === user.id_usuario,
      ),
    );
    totalGoals = userGoals.length;

    const recentMatches = allMatches.slice(0, 5).map((match) => {
      const goals = match.events.filter((e) => e.type === "goal");
      const assists = match.events.filter((e) => e.type === "assist");

      const topScorers = Object.values(
        goals.reduce((acc: any, e) => {
          if (!acc[e.id_player]) {
            acc[e.id_player] = { name: e.player.name, goals: 0 };
          }
          acc[e.id_player].goals += 1;
          return acc;
        }, {}),
      ).sort((a: any, b: any) => b.goals - a.goals);

      const topAssists = Object.values(
        assists.reduce((acc: any, e) => {
          if (!acc[e.id_player]) {
            acc[e.id_player] = { name: e.player.name, assists: 0 };
          }
          acc[e.id_player].assists += 1;
          return acc;
        }, {}),
      ).sort((a: any, b: any) => b.assists - a.assists);

      return {
        id_matches: match.id_matches,
        name: match.name,
        scheduled_at: match.scheduled_at,
        teams: match.teams.map((t) => ({
          id_time: t.id_time,
          name: t.name,
          goals: t.goals,
        })),
        topScorers,
        topAssists,
      };
    });

    return {
      user,
      stats: {
        totalMatches,
        totalGoals,
      },
      recentMatches,
    };
  }
}
