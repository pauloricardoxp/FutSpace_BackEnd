export const playersSchemas = {
  add: {
    tags: ["Players"],
    security: [{ bearerAuth: [] }],
    summary: "Adicionar jogador à partida",
    body: {
      type: "object",
      additionalProperties: false,
      required: ["name", "is_guest"],
      properties: {
        name: { type: "string", default: "Paulo Ricardo" },
        position: {
          type: "string",
          enum: ["linha", "goleiro"],
        },
        field_position: {
          type: "string",
          enum: ["goleiro", "fixo", "ala", "pivo", "zagueiro", "lateral", "volante", "meia", "atacante"],
        },
        shirt_number: { type: ["integer", "null"], minimum: 1, maximum: 99 },
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
        category: { type: "string", enum: ["futsal", "society", "campo"] },
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
            profiles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  position: { type: "string" },
                  shirt_number: { type: ["number", "null"] },
                },
              },
            },
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
