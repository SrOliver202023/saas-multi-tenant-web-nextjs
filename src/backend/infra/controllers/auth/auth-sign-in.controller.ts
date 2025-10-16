import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { AuthSignInUseCase } from "@/backend/domain/use-cases";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthSignInPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthSignInRequest {
  identifier: string;
  password: string;
}

export class AuthSignInController {
  private readonly logger = Logger.withContext(AuthSignInController.name);

  constructor(private readonly authSignInUseCase: AuthSignInUseCase, private readonly authSignInValidation: HttpValidation<AuthSignInRequest>) {}

  async handle(req: Request): Promise<Response> {
    const body: AuthSignInRequest = await bodyParse(req, this.logger);

    const validationResult = this.authSignInValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authSignInUseCase.execute(body);

    if (useCaseResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: useCaseResult,
      });
    }

    return HttpResponse.success({
      message: "Authenticated successfully",
      statusCode: 200,
      data: AuthSignInPresenter.toHttp(useCaseResult.value),
    });
  }
}
