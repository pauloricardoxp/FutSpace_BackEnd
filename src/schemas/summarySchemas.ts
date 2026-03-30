export const summarySchemas = {
  getMatchSummary: {
    tags: ["Summary"],
    summary: "Obter resumo completo da partida",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
    },
    response: {
      200: {
        type: "object",
        properties: {
          match: {
            type: "object",
            properties: {
              id_matches: { type: "number" },
              name: { type: "string" },
              status: { type: "string" },
            },
          },
          teams: { type: "array" },
          topScorers: { type: "array" },
          topAssists: { type: "array" },
        },
      },
    },
  },
};
