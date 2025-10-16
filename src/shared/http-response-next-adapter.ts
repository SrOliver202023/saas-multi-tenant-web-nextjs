import { NextResponse } from "next/server";

export class HttpNextAdapter {
  static from(response: Response): NextResponse {
    const cloned = response.clone();
    return new NextResponse(cloned.body, {
      status: cloned.status,
      headers: cloned.headers,
    });
  }
}
