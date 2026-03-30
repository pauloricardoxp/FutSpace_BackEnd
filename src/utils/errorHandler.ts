export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(err: any) {
  const message = err?.message || "Erro interno do servidor";

  if (
    message.includes("obrigatório") ||
    message.includes("Informe") ||
    message.includes("válido") ||
    message.includes("deve ser")
  ) {
    return { statusCode: 400, message };
  }

  if (
    message.includes("não encontrad") ||
    message.includes("não existe") ||
    message.includes("Not found")
  ) {
    return { statusCode: 404, message };
  }

  if (
    message.includes("permissão") ||
    message.includes("Acesso negado") ||
    message.includes("não tem acesso") ||
    message.includes("não autorizado")
  ) {
    return { statusCode: 403, message };
  }

  if (
    message.includes("já existe") ||
    message.includes("duplicado") ||
    message.includes("máximo de")
  ) {
    return { statusCode: 409, message };
  }

  if (
    message.includes("já foi iniciada") ||
    message.includes("já encerrada") ||
    message.includes("pendentes") ||
    message.includes("em andamento")
  ) {
    return { statusCode: 422, message };
  }

  return { statusCode: 500, message };
}
