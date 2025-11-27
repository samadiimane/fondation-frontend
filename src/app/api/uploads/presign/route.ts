import {NextResponse} from "next/server";

const rawBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASEPATH ||
  "";

const API_BASE = (rawBase || "http://127.0.0.1:8000").replace(/\/+$/, "");

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
    const upstream = await fetch(`${API_BASE}/v1/uploads/presign`, {
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
