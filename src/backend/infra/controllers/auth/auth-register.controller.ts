import { HttpResponse } from "@/backend/core/types";
import { AuthRegisterUseCase } from "@/backend/domain/use-cases";
import { AuthRegisterValidation } from "@/backend/domain/validations";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthRegisterPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthRegisterController {
  private readonly logger = Logger.withContext(AuthRegisterController.name);

  constructor(private readonly authRegisterUseCase: AuthRegisterUseCase, private readonly createAccountValidation: AuthRegisterValidation) {}

  async handle(req: Request): Promise<HttpResponse> {
    const body: AuthRegisterRequest = await bodyParse(req, this.logger);

    const validationResult = this.createAccountValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authRegisterUseCase.execute(body);

    if (useCaseResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: useCaseResult,
      });
    }

    return HttpResponse.success({
      message: "Registered successfully",
      statusCode: 200,
      data: AuthRegisterPresenter.toHttp(useCaseResult.value),
    });
  }
}
