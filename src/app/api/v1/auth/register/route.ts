import { AuthRegisterController } from "@/backend/infra/controllers";
import { AuthRegisterUseCaseFactory } from "@/backend/infra/factories";
import { AuthRegisterZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthRegisterUseCaseFactory.make();
  const response = await new AuthRegisterController(useCase, AuthRegisterZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
