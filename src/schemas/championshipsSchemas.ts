export const championshipsSchemas = {
  create: {
    tags: ["Championships"],
    summary: "Criar campeonato",
    body: {
      type: "object",
      additionalProperties: false,
      required: ["name", "sport", "format", "players_per_team"],
      properties: {
        name: { type: "string", default: "Campeonato de Quinta" },
        sport: { type: "string", enum: ["futebol", "fifa"], default: "futebol" },
        format: { type: "string", enum: ["league", "knockout"], default: "league" },
        players_per_team: { type: "number", default: 5 },
      },
    },
  },

  addTeam: {
    tags: ["Championships"],
    summary: "Inscrever time/jogador no campeonato",
    params: {
      type: "object",
      properties: { id_championship: { type: "string" } },
    },
    body: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: {
        name: { type: "string", default: "Time A" },
      },
    },
  },

  generateFixtures: {
    tags: ["Championships"],
    summary: "Gerar tabela de confrontos (round-robin)",
    params: {
      type: "object",
      properties: { id_championship: { type: "string" } },
    },
  },

  getStandings: {
    tags: ["Championships"],
    summary: "Ver classificação do campeonato",
    params: {
      type: "object",
      properties: { id_championship: { type: "string" } },
    },
  },
};