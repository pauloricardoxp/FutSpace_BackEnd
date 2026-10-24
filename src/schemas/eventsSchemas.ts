export const eventsSchemas = {
  create: {
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    summary: "Registrar gol ou assistência",
    body: {
      type: "object",
      required: ["type", "minute", "id_player"],
      properties: {
        type: { type: "string", enum: ["goal"], default: "goal" },
        minute: { type: "number", default: 15 },
        id_player: { type: "number", default: 1 },
        id_assistido: { type: "number", default: null },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_events: { type: "number" },
          type: { type: "string" },
          minute: { type: "number" },
        },
      },
    },
  },
};
