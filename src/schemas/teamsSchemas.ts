export const teamsSchemas = {
  draw: {
    tags: ["Teams"],
    summary: "Sortear times automaticamente",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            team: {
              type: "object",
              properties: {
                id_time: { type: "number" },
                name: { type: "string" },
                goals: { type: "number" },
              },
            },
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_players: { type: "number" },
                  name: { type: "string" },
                  position: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
