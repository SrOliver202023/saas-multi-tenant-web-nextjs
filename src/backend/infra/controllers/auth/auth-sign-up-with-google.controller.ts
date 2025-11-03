import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { AuthSignUpWithGoogleUseCase } from "@/backend/domain/use-cases";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthSignUpPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthSignUpWithGoogleRequest {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  googleId: string;
  refreshToken?: string;
  accessToken?: string;
  expiresIn?: number;
}

export class AuthSignUpWithGoogleController {
  private readonly logger = Logger.withContext(AuthSignUpWithGoogleController.name);

  constructor(
    private readonly authSignUpWithGoogleUseCase: AuthSignUpWithGoogleUseCase,
    private readonly authSignUpWithGoogleValidation: HttpValidation<AuthSignUpWithGoogleRequest>
  ) {}

  async handle(req: Request): Promise<Response> {
    const body: AuthSignUpWithGoogleRequest = await bodyParse(req, this.logger);

    const validationResult = this.authSignUpWithGoogleValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authSignUpWithGoogleUseCase.execute(body);

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
