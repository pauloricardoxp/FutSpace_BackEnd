export interface PlayerEvent {
  id_player: number;
  type: string;
  player: { name: string };
}

export interface PlayerStats {
  name: string;
  goals: number;
  assists: number;
}

export function aggregatePlayerStats(events: PlayerEvent[]) {
  const stats = new Map<number, PlayerStats>();

  for (const event of events) {
    const current = stats.get(event.id_player) ?? {
      name: event.player.name,
      goals: 0,
      assists: 0,
    };

    if (event.type === "goal") current.goals += 1;
    if (event.type === "assist") current.assists += 1;
    stats.set(event.id_player, current);
  }

  const topScorers = Array.from(stats.values())
    .filter((player) => player.goals > 0)
    .map(({ name, goals }) => ({ name, goals }))
    .sort((a, b) => b.goals - a.goals);
  const topAssists = Array.from(stats.values())
    .filter((player) => player.assists > 0)
    .map(({ name, assists }) => ({ name, assists }))
    .sort((a, b) => b.assists - a.assists);
  const performance = Array.from(stats.entries())
    .map(([id, player]) => ({
      id,
      name: player.name,
      goals: player.goals,
      assists: player.assists,
      totalPoints: player.goals + player.assists,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return { topScorers, topAssists, performance };
}
