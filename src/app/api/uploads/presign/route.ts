import {NextResponse} from "next/server";
import {getServerApiBaseUrl} from "@/lib/apiBase";

export async function POST(request: Request) {
  let body: any = null;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const finalBody: Record<string, any> = {};
  if (body && typeof body.content_type === "string" && body.content_type.trim()) {
    finalBody.content_type = body.content_type;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const incomingAuth = request.headers.get("authorization");
  const incomingCookie = request.headers.get("cookie");
  const xsrf = request.headers.get("x-xsrf-token") || request.headers.get("X-XSRF-TOKEN");

  if (incomingAuth && incomingAuth.trim()) {
    headers.Authorization = incomingAuth;
  }
  if (incomingCookie && incomingCookie.trim()) {
    headers.Cookie = incomingCookie;
    if (!headers.Authorization) {
      const tokenMatch =
        incomingCookie.match(/(?:^|;\s*)(access_token)=([^;]+)/i) ||
        incomingCookie.match(/(?:^|;\s*)(token)=([^;]+)/i) ||
        incomingCookie.match(/(?:^|;\s*)(auth)=([^;]+)/i);
      if (tokenMatch && tokenMatch[2]) {
        headers.Authorization = `Bearer ${tokenMatch[2]}`;
      }
    }
  }
  if (xsrf && xsrf.trim()) {
    headers["x-xsrf-token"] = xsrf;
  }

  try {
    const apiBase = getServerApiBaseUrl();
    if (!apiBase) {
      return NextResponse.json(
        {userMessage: "API base URL is not configured"},
        {status: 500},
      );
    }

    const upstream = await fetch(`${apiBase}/v1/uploads/presign`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalBody),
    });

    const contentType = upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {userMessage: "Unable to contact upstream for presign", detail: String(error)},
      {status: 500},
    );
  }
}
