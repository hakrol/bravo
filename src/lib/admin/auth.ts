import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSession = {
  username: string;
  issuedAt: number;
};

type AdminCredentials = {
  username: string;
  password: string;
  sessionSecret: string;
};

function readAdminCredentials(): AdminCredentials | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!username || !password || !sessionSecret) {
    return null;
  }

  return {
    username,
    password,
    sessionSecret,
  };
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(hashValue(left), hashValue(right));
}

function buildSignature(username: string, issuedAt: number, secret: string) {
  return createHmac("sha256", secret).update(`${username}:${issuedAt}`).digest("base64url");
}

function encodeSessionValue(username: string, issuedAt: number, secret: string) {
  const signature = buildSignature(username, issuedAt, secret);
  return Buffer.from(`${username}:${issuedAt}:${signature}`, "utf8").toString("base64url");
}

function decodeSessionValue(value: string) {
  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8");
    const [username, issuedAtRaw, signature] = decoded.split(":");
    const issuedAt = Number(issuedAtRaw);

    if (!username || !signature || !Number.isFinite(issuedAt)) {
      return null;
    }

    return { username, issuedAt, signature };
  } catch {
    return null;
  }
}

export function isAdminAvailable() {
  return process.env.NODE_ENV !== "production";
}

export function isAdminAuthConfigured() {
  return isAdminAvailable() && readAdminCredentials() !== null;
}

export async function validateAdminLogin(username: string, password: string) {
  if (!isAdminAvailable()) {
    return false;
  }

  const credentials = readAdminCredentials();

  if (!credentials) {
    return false;
  }

  return safeEqual(username, credentials.username) && safeEqual(password, credentials.password);
}

export async function createAdminSession(username: string) {
  if (!isAdminAvailable()) {
    throw new Error("Admin er deaktivert i produksjon.");
  }

  const credentials = readAdminCredentials();

  if (!credentials) {
    throw new Error("Admin-innlogging er ikke konfigurert.");
  }

  const cookieStore = await cookies();
  const issuedAt = Date.now();

  cookieStore.set(ADMIN_SESSION_COOKIE, encodeSessionValue(username, issuedAt, credentials.sessionSecret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isAdminAvailable()) {
    return null;
  }

  const credentials = readAdminCredentials();

  if (!credentials) {
    return null;
  }

  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!rawCookie) {
    return null;
  }

  const decoded = decodeSessionValue(rawCookie);

  if (!decoded) {
    return null;
  }

  const expectedSignature = buildSignature(decoded.username, decoded.issuedAt, credentials.sessionSecret);
  const isExpired = decoded.issuedAt + SESSION_MAX_AGE_SECONDS * 1000 < Date.now();

  if (
    !safeEqual(decoded.signature, expectedSignature) ||
    !safeEqual(decoded.username, credentials.username) ||
    isExpired
  ) {
    return null;
  }

  return {
    username: decoded.username,
    issuedAt: decoded.issuedAt,
  };
}

export async function requireAdminSession() {
  if (!isAdminAvailable()) {
    redirect("/");
  }

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
