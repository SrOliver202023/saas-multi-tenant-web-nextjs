export interface IMetaPaginationHttpResponse {
  limit: number;
  page: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IHttpResponseSuccess<TData> {
  success: true;
  message: string;
  statusCode: number;
  data: TData;
  meta?: IMetaPaginationHttpResponse;
}

export interface IHttpResponseError<TData> {
  success: false;
  message: string;
  statusCode: number;
  details?: TData;
  debug?: {
    stack?: string;
  };
}

export class HttpResponse {
  /**
   * ✅ Sucesso — resposta genérica e flexível
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
  }) {
    const payload: IHttpResponseSuccess<TData> = {
      message,
      success: true,
      statusCode,
      data,
      ...(meta ? { meta } : {}),
    };

    return new Response(JSON.stringify(payload), { status: statusCode, headers: { "Content-Type": "application/json" } });
  }

  /**
   * ❌ Erro — resposta padronizada com status e mensagem
   */
  static error<TData>({ message, statusCode = 500, details }: { message: string; statusCode?: number; details?: TData; debug?: { stack?: string } }) {
    const payload: IHttpResponseError<TData> = {
      message,
      success: false,
      statusCode,
      ...(details ? { details } : {}),
    };

    return new Response(JSON.stringify(payload), { status: statusCode, headers: { "Content-Type": "application/json" } });
  }
}
