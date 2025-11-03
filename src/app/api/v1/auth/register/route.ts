import { AuthSignUpController } from "@/backend/infra/controllers";
import { AuthSignUpUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignUpZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthSignUpUseCaseFactory.make();
  const response = await new AuthSignUpController(useCase, AuthSignUpZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
