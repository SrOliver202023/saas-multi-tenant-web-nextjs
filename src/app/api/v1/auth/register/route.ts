import { AuthRegisterController } from "@/backend/infra/controllers";
import { AuthRegisterUseCaseFactory } from "@/backend/infra/factories";
import { AuthRegisterZodValidation } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthRegisterUseCaseFactory.make();
  return new AuthRegisterController(useCase, AuthRegisterZodValidation).handle(req);
}
