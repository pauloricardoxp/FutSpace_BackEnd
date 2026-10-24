export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(err: unknown) {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message };
  }

  return { statusCode: 500, message: "Erro interno do servidor" };
}
