import { AuthSignInController } from "@/backend/infra/controllers";
import { AuthSignInUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignInZodValidation } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthSignInUseCaseFactory.make();
  return new AuthSignInController(useCase, AuthSignInZodValidation).handle(req);
}
