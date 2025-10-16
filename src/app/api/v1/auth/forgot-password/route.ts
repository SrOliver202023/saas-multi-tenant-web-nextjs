import { AuthForgotPasswordController } from "@/backend/infra/controllers";
import { AuthForgotPasswordUseCaseFactory } from "@/backend/infra/factories";
import { AuthForgotPasswordZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthForgotPasswordUseCaseFactory.make();
  const response = await new AuthForgotPasswordController(useCase, AuthForgotPasswordZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
