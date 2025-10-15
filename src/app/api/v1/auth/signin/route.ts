import { AuthSignInController } from "@/backend/infra/controllers";
import { AuthSignInUseCaseFactory } from "@/backend/infra/factories";
import { AuthSignInZodValidation } from "@/shared";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const useCase = AuthSignInUseCaseFactory.make();
  return NextResponse.json(new AuthSignInController(useCase, AuthSignInZodValidation).handle(req));
}
