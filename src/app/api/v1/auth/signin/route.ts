import { AuthSignInController } from "@/backend/infra/controllers";
import { AuthSignInUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignInZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthSignInUseCaseFactory.make();
  const response = await new AuthSignInController(useCase, AuthSignInZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
