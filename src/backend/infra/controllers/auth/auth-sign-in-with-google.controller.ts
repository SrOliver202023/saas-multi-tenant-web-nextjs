import { HttpValidation } from "@/backend/core/entities";
import { HttpResponse } from "@/backend/core/types";
import { AuthSignInWithGoogleUseCase } from "@/backend/domain/use-cases";
import { Logger } from "@/shared";
import { bodyParse } from "@/utils";
import { AuthSignInPresenter, handleControllerErrorResponse } from "../../presenters";

interface AuthSignInWithGoogleRequest {
  identifier: string;
  password: string;
  googleId: string;
}

export class AuthSignInWithGoogleController {
  private readonly logger = Logger.withContext(AuthSignInWithGoogleController.name);

  constructor(
    private readonly authSignInWithGoogleUseCase: AuthSignInWithGoogleUseCase,
    private readonly authSignInWithGoogleValidation: HttpValidation<AuthSignInWithGoogleRequest>
  ) {}

  async handle(req: Request): Promise<Response> {
    const body: AuthSignInWithGoogleRequest = await bodyParse(req, this.logger);

    const validationResult = this.authSignInWithGoogleValidation.validate(body);

    if (validationResult.isLeft()) {
      return handleControllerErrorResponse({
        logger: this.logger,
        result: validationResult,
      });
    }

    const useCaseResult = await this.authSignInWithGoogleUseCase.execute(body);

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
