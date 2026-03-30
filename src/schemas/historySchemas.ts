export const historySchemas = {
  getHistory: {
    tags: ["History"],
    summary: "Obter histórico de partidas do usuário",
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_matches: { type: "number" },
            name: { type: "string" },
            teams: { type: "array" },
            topScorers: { type: "array" },
            topAssists: { type: "array" },
          },
        },
      },
    },
  },
};
