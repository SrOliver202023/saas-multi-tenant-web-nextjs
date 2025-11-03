import { AuthSignInWithGoogleController } from "@/backend/infra/controllers";
import { AuthSignInWithGoogleUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignInWithGoogleZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthSignInWithGoogleUseCaseFactory.make();
  const response = await new AuthSignInWithGoogleController(useCase, AuthSignInWithGoogleZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
