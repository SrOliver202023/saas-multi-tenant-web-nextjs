import { AuthRegisterController } from "@/backend/infra/controllers";
import { AuthRegisterUseCaseFactory } from "@/backend/infra/factories";
import { AuthRegisterZodValidation } from "@/shared";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const useCase = AuthRegisterUseCaseFactory.make();
  return NextResponse.json(new AuthRegisterController(useCase, AuthRegisterZodValidation).handle(req));
}
