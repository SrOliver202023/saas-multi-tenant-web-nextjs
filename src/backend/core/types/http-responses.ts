/**
 * ✅ Tipos de metadados para respostas com paginação
 */
export interface IMetaPaginationHttpResponse {
  limit: number;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * ✅ Estrutura para respostas de sucesso
 */
export interface IHttpResponseSuccess<TData> {
  success: true;
  message: string;
  statusCode: number;
  data: TData;
  meta?: IMetaPaginationHttpResponse;
}

/**
 * ❌ Estrutura para respostas de erro
 */
export interface IHttpResponseError<TDetails> {
  success: false;
  message: string;
  statusCode: number;
  details?: TDetails;
  debug?: {
    stack?: string;
  };
}

/**
 * 🔧 Classe utilitária para padronizar respostas HTTP
 */
export class HttpResponse {
  private static readonly defaultHeaders = {
    "Content-Type": "application/json",
  };

  /**
   * ✅ Cria uma resposta de sucesso (200 ou 201)
   */
  static success<TData>({
    message,
    data,
    meta,
    statusCode = 200,
  }: {
    message: string;
    data: TData;
    meta?: IMetaPaginationHttpResponse;
    statusCode?: 200 | 201;
  }): Response {
    const payload: IHttpResponseSuccess<TData> = {
      success: true,
      message,
      statusCode,
      data,
      ...(meta && { meta }),
    };

    return new Response(JSON.stringify(payload), {
      status: statusCode,
      headers: this.defaultHeaders,
    });
  }

  /**
   * ❌ Cria uma resposta de erro padronizada
   */
  static error<TDetails>({
    message,
    statusCode = 500,
    details,
    debug,
  }: {
    message: string;
    statusCode?: number;
    details?: TDetails;
    debug?: { stack?: string };
  }): Response {
    const payload: IHttpResponseError<TDetails> = {
      success: false,
      message,
      statusCode,
      ...(details && { details }),
      ...(debug && { debug }),
    };

    return new Response(JSON.stringify(payload), {
      status: statusCode,
      headers: this.defaultHeaders,
    });
  }

  /**
   * 🧩 Helper para converter qualquer `Response` em JSON tipado
   */
  static async toJson<T = unknown>(response: Response): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      throw new Error("Invalid JSON response");
    }
  }
}
