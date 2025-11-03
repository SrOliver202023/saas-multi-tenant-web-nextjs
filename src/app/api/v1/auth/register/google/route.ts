import { AuthSignUpWithGoogleController } from "@/backend/infra/controllers";
import { AuthSignUpWithGoogleUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignUpWithGoogleZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthSignUpWithGoogleUseCaseFactory.make();
  const response = await new AuthSignUpWithGoogleController(useCase, AuthSignUpWithGoogleZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
