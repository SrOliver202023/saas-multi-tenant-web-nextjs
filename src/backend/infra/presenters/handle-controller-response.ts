import { Either } from "@/backend/core";
import { HttpError } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { ILogger } from "@/shared";

interface IHandleControllerErrorResponse {
  logger: ILogger;
  result: Either<Error, unknown>;
}

export function handleControllerErrorResponse({ logger, result }: IHandleControllerErrorResponse): ReturnType<typeof HttpResponse.error> {
  const error = result.value;

  // 🚨 Erros de domínio conhecidos (HttpError)
  if (error instanceof HttpError) {
    logger.warn(`Domain error: ${error.message}`, {
      meta: { statusCode: error.statusCode },
    });

    return HttpResponse.error({
      statusCode: error?.statusCode ?? 500,
      message: error?.message || "Ocorreu um erro inesperado.",
      details: {
        ...(error?.fieldPath ? { fieldPath: error.fieldPath } : {}),
      },
      debug: {
        ...(process.env.NODE_ENV !== "production" && error?.stack ? { stack: error.stack } : {}),
      },
    });
  }

  if (error instanceof Error) {
    logger.warn(`Unexpected error in [${error.name}]: ${error.message}`, {
      meta: { statusCode: 500 },
    });

    return HttpResponse.error({
      message: error.name,
      statusCode: 500,
    });
  }

  // ⚠️ Erro inesperado
  logger.error("Internal server error", { error });

  const message = "Internal server error";
  return HttpResponse.error({
    message,
    statusCode: 500,
  });
}
