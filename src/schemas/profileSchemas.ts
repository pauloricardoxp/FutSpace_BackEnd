const profileProperties = {
  sport: {
    type: "string",
    enum: ["futebol"],
    default: "futebol",
    description: "Esporte praticado pelo usuário.",
  },
  category: {
    type: "string",
    enum: ["futsal", "society", "campo"],
    description: "Categoria em que o usuário joga.",
  },
  position: {
    type: "string",
    enum: [
      "goleiro",
      "fixo",
      "ala",
      "pivo",
      "zagueiro",
      "lateral",
      "volante",
      "meia",
      "atacante",
    ],
    description: "Posição específica do usuário dentro da categoria.",
  },
  shirt_number: {
    type: ["integer", "null"],
    minimum: 1,
    maximum: 99,
    description: "Número da camisa, entre 1 e 99.",
  },
};

const profileResponse = {
  id_profile: { type: "number", description: "Identificador do perfil." },
  sport: { type: "string", description: "Esporte do perfil." },
  category: { type: "string", description: "Categoria do perfil." },
  position: { type: "string", description: "Posição específica do jogador." },
  shirt_number: {
    type: ["number", "null"],
    description: "Número da camisa.",
  },
};

const profileItemResponse = {
  type: "object",
  properties: profileResponse,
};

const authenticated = [{ bearerAuth: [] }];

export const profileSchemas = {
  getMe: {
    tags: ["Profile"],
    summary: "Consultar meus dados",
    description:
      "Retorna os dados da conta autenticada, a foto e todos os perfis esportivos cadastrados pelo usuário.",
    security: authenticated,
    response: {
      200: {
        type: "object",
        properties: {
          id_usuario: { type: "number", description: "Identificador do usuário." },
          name: { type: "string", description: "Nome do usuário." },
          email: { type: "string", description: "Email da conta." },
          photo: { type: ["string", "null"], description: "URL da foto de perfil." },
          has_profile: {
            type: "boolean",
            description: "Indica se o usuário possui pelo menos um perfil esportivo.",
          },
          profiles: {
            type: "array",
            description: "Perfis esportivos do usuário.",
            items: profileItemResponse,
          },
        },
      },
    },
  },

  updateMe: {
    tags: ["Profile"],
    summary: "Editar meus dados",
    description: "Atualiza o nome da conta do usuário autenticado.",
    security: authenticated,
    body: {
      type: "object",
      additionalProperties: false,
      required: ["name"],
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          description: "Novo nome do usuário.",
        },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_usuario: { type: "number" },
          name: { type: "string" },
          email: { type: "string" },
          photo: { type: ["string", "null"] },
        },
      },
    },
  },

  listProfiles: {
    tags: ["Profile"],
    summary: "Listar meus perfis esportivos",
    description:
      "Lista os perfis esportivos cadastrados pelo usuário autenticado.",
    security: authenticated,
    response: {
      200: {
        type: "array",
        items: profileItemResponse,
      },
    },
  },

  createProfile: {
    tags: ["Profile"],
    summary: "Criar perfil esportivo",
    description:
      "Cadastra a categoria, a posição e o número da camisa do usuário. Só é permitido um perfil por esporte e categoria.",
    security: authenticated,
    body: {
      type: "object",
      additionalProperties: false,
      required: ["category", "position"],
      properties: profileProperties,
    },
    response: {
      201: profileItemResponse,
    },
  },

  updateProfile: {
    tags: ["Profile"],
    summary: "Editar perfil esportivo",
    description:
      "Atualiza os dados de um perfil esportivo pertencente ao usuário autenticado.",
    security: authenticated,
    params: {
      type: "object",
      required: ["id_profile"],
      properties: {
        id_profile: {
          type: "string",
          description: "Identificador do perfil esportivo.",
        },
      },
    },
    body: {
      type: "object",
      additionalProperties: false,
      properties: profileProperties,
    },
    response: {
      200: profileItemResponse,
    },
  },

  deleteProfile: {
    tags: ["Profile"],
    summary: "Excluir perfil esportivo",
    description:
      "Exclui um perfil esportivo pertencente ao usuário autenticado.",
    security: authenticated,
    params: {
      type: "object",
      required: ["id_profile"],
      properties: {
        id_profile: {
          type: "string",
          description: "Identificador do perfil esportivo.",
        },
      },
    },
    response: {
      200: profileItemResponse,
    },
  },

  uploadPhoto: {
    tags: ["Profile"],
    summary: "Enviar foto de perfil",
    description:
      "Envia uma foto JPEG, PNG ou WebP de até 5 MB para o usuário autenticado. A nova foto substitui a anterior.",
    security: authenticated,
  },

  deletePhoto: {
    tags: ["Profile"],
    summary: "Remover foto de perfil",
    description: "Remove a foto de perfil do usuário autenticado.",
    security: authenticated,
    response: {
      200: {
        type: "object",
        properties: {
          photo: { type: "null" },
        },
      },
    },
  },
};
