import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthSignUpPresenter, handleControllerErrorResponse } from "../../presenters";
import { AuthSignUpUseCase } from "@/backend/domain/use-cases";

interface AuthSignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthSignUpController {
  private readonly logger = Logger.withContext(AuthSignUpController.name);

  constructor(private readonly authSignUpUseCase: AuthSignUpUseCase, private readonly createAccountValidation: HttpValidation<AuthSignUpRequest>) {}

  async handle(req: Request): Promise<Response> {
    const body: AuthSignUpRequest = await bodyParse(req, this.logger);

    const validationResult = this.createAccountValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authSignUpUseCase.execute(body);

    if (useCaseResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: useCaseResult,
      });
    }

    return HttpResponse.success({
      message: "Registered successfully",
      statusCode: 200,
      data: AuthSignUpPresenter.toHttp(useCaseResult.value),
    });
  }
}
