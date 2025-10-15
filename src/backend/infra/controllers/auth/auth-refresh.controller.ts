import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { AuthRefreshUseCase } from "@/backend/domain/use-cases";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthRefreshPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthRefreshRequest {
  refreshToken: string;
}

export class AuthRefreshController {
  private readonly logger = Logger.withContext(AuthRefreshController.name);

  constructor(private readonly authRefreshUseCase: AuthRefreshUseCase, private readonly authRefreshValidation: HttpValidation<AuthRefreshRequest>) {}

  async handle(req: Request): Promise<HttpResponse> {
    const body: AuthRefreshRequest = await bodyParse(req, this.logger);

    const validationResult = this.authRefreshValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authRefreshUseCase.execute(body);

    if (useCaseResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: useCaseResult,
      });
    }

    return HttpResponse.success({
      message: "Authenticated successfully",
      statusCode: 200,
      data: AuthRefreshPresenter.toHttp(useCaseResult.value),
    });
  }
}
