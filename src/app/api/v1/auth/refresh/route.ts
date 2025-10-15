import { AuthRefreshController } from "@/backend/infra/controllers";
import { AuthRefreshUseCaseFactory } from "@/backend/infra/factories";
import { AuthRefreshZodValidation } from "@/shared";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const useCase = AuthRefreshUseCaseFactory.make();
  return NextResponse.json(new AuthRefreshController(useCase, AuthRefreshZodValidation).handle(req));
}
