import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { AuthForgotPasswordUseCase } from "@/backend/domain/use-cases";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthForgotPasswordPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthForgotPasswordRequest {
  identifier: string;
}

export class AuthForgotPasswordController {
  private readonly logger = Logger.withContext(AuthForgotPasswordController.name);

  constructor(
    private readonly authForgotPasswordUseCase: AuthForgotPasswordUseCase,
    private readonly authForgotPasswordValidation: HttpValidation<AuthForgotPasswordRequest>
  ) {}

  async handle(req: Request): Promise<Response> {
    const body: AuthForgotPasswordRequest = await bodyParse(req, this.logger);

    const validationResult = this.authForgotPasswordValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authForgotPasswordUseCase.execute(body);

    if (useCaseResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: useCaseResult,
      });
    }

    return HttpResponse.success({
      message: "Password recovery email sent successfully",
      statusCode: 200,
      data: AuthForgotPasswordPresenter.toHttp(useCaseResult.value),
    });
  }
}
