export const playersSchemas = {
  add: {
    tags: ["Players"],
    security: [{ bearerAuth: [] }],
    summary: "Adicionar jogador à partida",
    body: {
      type: "object",
      required: ["name", "position", "is_guest"],
      properties: {
        name: { type: "string", default: "Paulo Ricardo" },
        position: {
          type: "string",
          enum: ["linha", "goleiro"],
          default: "linha",
        },
        is_guest: { type: "boolean", default: true },
        id_usuario: { type: "number", default: null },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_players: { type: "number" },
          name: { type: "string" },
          position: { type: "string" },
        },
      },
    },
  },

  search: {
    tags: ["Players"],
    security: [{ bearerAuth: [] }],
    summary: "Buscar usuários por nome",
    querystring: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", default: "Paulo" },
      },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_usuario: { type: "number" },
            name: { type: "string" },
            photo: { type: ["string", "null"] },
          },
        },
      },
    },
  },

  delete: {
    tags: ["Players"],
    security: [{ bearerAuth: [] }],
    summary: "Remover jogador da partida",
    params: {
      type: "object",
      properties: {
        id_matches: { type: "string" },
        id_players: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_players: { type: "number" },
          name: { type: "string" },
          position: { type: "string" },
        },
      },
    },
  },
};
