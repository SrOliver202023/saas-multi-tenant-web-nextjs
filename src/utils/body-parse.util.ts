import { HttpResponse } from "@/backend/core/types";
import { ILogger } from "@/shared";

export async function bodyParse(req: Request, logger: ILogger) {
  try {
    const body = await req.json();
    return body;
  } catch {
    logger.error("Invalid JSON body");
    return HttpResponse.error({ message: "Invalid JSON body" });
  }
}
