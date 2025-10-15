import { AuthRefreshController } from "@/backend/infra/controllers";
import { AuthRefreshUseCaseFactory } from "@/backend/infra/factories";
import { AuthRefreshZodValidation } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthRefreshUseCaseFactory.make();
  return new AuthRefreshController(useCase, AuthRefreshZodValidation).handle(req);
}
