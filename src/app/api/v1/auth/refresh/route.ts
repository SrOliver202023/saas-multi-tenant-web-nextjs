import { AuthRefreshController } from "@/backend/infra/controllers";
import { AuthRefreshUseCaseFactory } from "@/backend/infra/factories";
import { AuthRefreshZodValidation, HttpNextAdapter } from "@/shared";

export async function POST(req: Request) {
  const useCase = AuthRefreshUseCaseFactory.make();
  const response = await new AuthRefreshController(useCase, AuthRefreshZodValidation).handle(req);
  return HttpNextAdapter.from(response);
}
