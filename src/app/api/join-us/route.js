import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 20_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const FOUNDATION_EMAIL = "aktfoundation.ma@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitStore = new Map();

const json = (body, status = 200) => NextResponse.json(body, { status });

const trimText = (value = "") =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const trimMultiline = (value = "") =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .trim();

const sanitizePhone = (value = "") =>
  String(value ?? "")
    .replace(/[^\d+\s().-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toLowerCase();
  return ["true", "1", "yes", "on"].includes(normalized);
};

const getClientIp = (request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
};

const isRateLimited = (request) => {
  const key = getClientIp(request);
  const now = Date.now();
  const current = rateLimitStore.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  rateLimitStore.set(key, { ...current, count: current.count + 1 });
  return false;
};

const parseBody = async (request) => {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return { error: "invalid_content_type" };
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_SIZE) {
    return { error: "payload_too_large" };
  }

  try {
    return { body: rawBody ? JSON.parse(rawBody) : {} };
  } catch {
    return { error: "invalid_json" };
  }
};

const normalizeSubmission = (body = {}) => ({
  fullName: trimText(body.fullName),
  email: trimText(body.email).toLowerCase(),
  phone: sanitizePhone(body.phone),
  profileType: trimText(body.profileType),
  institution: trimText(body.institution),
  specialization: trimText(body.specialization ?? body.field),
  requestType: trimText(body.requestType),
  cityCountry: trimText(body.cityCountry),
  academicLevel: trimText(body.academicLevel),
  preferredContactMethod: trimText(body.preferredContactMethod ?? body.preferredContact),
  message: trimMultiline(body.message),
  consent: body.consent === true,
  locale: trimText(body.locale),
  website: trimText(body.website),
});

const validateSubmission = (submission) => {
  const fields = {};

  if (submission.fullName.length < 3) fields.fullName = "required";
  if (!EMAIL_PATTERN.test(submission.email)) fields.email = "invalid";
  if (!submission.profileType) fields.profileType = "required";
  if (!submission.institution) fields.institution = "required";
  if (!submission.specialization) fields.specialization = "required";
  if (!submission.requestType) fields.requestType = "required";
  if (submission.message.length < 20) fields.message = "too_short";
  if (!submission.consent) fields.consent = "required";

  return fields;
};

const getMailConfig = () => {
  const host = trimText(process.env.SMTP_HOST);
  const user = trimText(process.env.SMTP_USER);
  const pass = String(process.env.SMTP_PASS || "");
  const from = trimText(process.env.SMTP_FROM);

  if (!host || !user || !pass || !from) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);

  return {
    to: trimText(process.env.JOIN_REQUEST_TO_EMAIL) || FOUNDATION_EMAIL,
    from,
    transport: {
      host,
      port: Number.isFinite(port) ? port : 587,
      secure: parseBoolean(process.env.SMTP_SECURE),
      auth: {
        user,
        pass,
      },
    },
  };
};

const buildTextEmail = (submission, submittedAt, userAgent) => {
  const lines = [
    "طلب انضمام جديد إلى شبكة المؤسسة",
    "",
    "الاسم الكامل:",
    submission.fullName,
    "",
    "البريد الإلكتروني:",
    submission.email,
    "",
    "الهاتف:",
    submission.phone || "-",
    "",
    "الصفة:",
    submission.profileType,
    "",
    "المؤسسة أو الانتماء:",
    submission.institution,
    "",
    "مجال الدراسة أو التخصص:",
    submission.specialization,
    "",
    "المدينة / البلد:",
    submission.cityCountry || "-",
    "",
    "المستوى الأكاديمي:",
    submission.academicLevel || "-",
    "",
    "نوع الطلب:",
    submission.requestType,
    "",
    "طريقة التواصل المفضلة:",
    submission.preferredContactMethod || "-",
    "",
    "الرسالة:",
    submission.message,
    "",
    "الموافقة:",
    submission.consent ? "نعم" : "لا",
    "",
  ];

  if (submission.locale) {
    lines.push("اللغة:", submission.locale, "");
  }

  lines.push("تاريخ الإرسال:", submittedAt, "", "User-Agent:", userAgent || "-");

  return lines.join("\n");
};

const buildHtmlRow = (label, value) => `
  <tr>
    <th style="text-align:right;vertical-align:top;padding:10px 12px;color:#0f315f;background:#f7f8fc;border-bottom:1px solid #e6ebf4;width:34%;">${escapeHtml(label)}</th>
    <td style="padding:10px 12px;color:#26364f;border-bottom:1px solid #e6ebf4;white-space:pre-wrap;">${escapeHtml(value || "-")}</td>
  </tr>
`;

const buildHtmlEmail = (submission, submittedAt, userAgent) => {
  const rows = [
    ["الاسم الكامل", submission.fullName],
    ["البريد الإلكتروني", submission.email],
    ["الهاتف", submission.phone],
    ["الصفة", submission.profileType],
    ["المؤسسة أو الانتماء", submission.institution],
    ["مجال الدراسة أو التخصص", submission.specialization],
    ["المدينة / البلد", submission.cityCountry],
    ["المستوى الأكاديمي", submission.academicLevel],
    ["نوع الطلب", submission.requestType],
    ["طريقة التواصل المفضلة", submission.preferredContactMethod],
    ["الرسالة", submission.message],
    ["الموافقة", submission.consent ? "نعم" : "لا"],
    ...(submission.locale ? [["اللغة", submission.locale]] : []),
    ["تاريخ الإرسال", submittedAt],
    ["User-Agent", userAgent || "-"],
  ];

  return `
    <div dir="rtl" lang="ar" style="font-family:Arial,Tahoma,sans-serif;line-height:1.7;color:#26364f;">
      <h1 style="font-size:22px;color:#0f315f;margin:0 0 16px;">طلب انضمام جديد إلى شبكة المؤسسة</h1>
      <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:760px;border:1px solid #e6ebf4;border-radius:12px;overflow:hidden;">
        <tbody>
          ${rows.map(([label, value]) => buildHtmlRow(label, value)).join("")}
        </tbody>
      </table>
    </div>
  `;
};

const sendJoinRequestEmail = async (submission, request) => {
  const mailConfig = getMailConfig();
  if (!mailConfig) {
    return { ok: false, code: "mail_unavailable" };
  }

  const submittedAt = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") || "";
  const transporter = nodemailer.createTransport(mailConfig.transport);

  await transporter.sendMail({
    from: mailConfig.from,
    to: mailConfig.to,
    replyTo: submission.email,
    subject: "طلب انضمام جديد إلى شبكة المؤسسة",
    text: buildTextEmail(submission, submittedAt, userAgent),
    html: buildHtmlEmail(submission, submittedAt, userAgent),
  });

  return { ok: true };
};

export async function POST(request) {
  const parsed = await parseBody(request);
  if (parsed.error) {
    return json({ ok: false, code: "validation_error", fields: { body: parsed.error } }, 400);
  }

  const submission = normalizeSubmission(parsed.body);

  if (submission.website) {
    return json({ ok: true });
  }

  if (isRateLimited(request)) {
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  const fields = validateSubmission(submission);
  if (Object.keys(fields).length > 0) {
    return json({ ok: false, code: "validation_error", fields }, 400);
  }

  try {
    const result = await sendJoinRequestEmail(submission, request);
    if (!result.ok) {
      return json({ ok: false, code: result.code }, 503);
    }
    return json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Join request email failed.", error?.message || error);
    }
    return json({ ok: false, code: "mail_unavailable" }, 503);
  }
}
