"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { type ContactFormField, type ContactFormState } from "@/lib/contact-form";
import { ContactEmailError, sendContactEmail } from "@/lib/contact-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINIMUM_COMPLETION_TIME_MS = 1_500;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const globalForContactRateLimit = globalThis as typeof globalThis & {
  contactRateLimitBuckets?: Map<string, RateLimitBucket>;
};

const contactRateLimitBuckets =
  globalForContactRateLimit.contactRateLimitBuckets ?? new Map<string, RateLimitBucket>();

globalForContactRateLimit.contactRateLimitBuckets = contactRateLimitBuckets;

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateContactForm(formData: FormData) {
  const name = readText(formData, "name");
  const email = readText(formData, "email").toLowerCase();
  const message = readText(formData, "message");
  const privacyAccepted = formData.get("privacy") === "on";
  const errors: Partial<Record<ContactFormField, string>> = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = "Skriv inn et navn på mellom 2 og 80 tegn.";
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = "Skriv inn en gyldig e-postadresse.";
  }

  if (message.length < 20 || message.length > 5_000) {
    errors.message = "Meldingen må inneholde mellom 20 og 5 000 tegn.";
  }

  if (!privacyAccepted) {
    errors.privacy = "Du må bekrefte at du har lest personvernerklæringen.";
  }

  return {
    data: { name, email, message },
    errors,
  };
}

function isLikelyAutomatedSubmission(formData: FormData) {
  const honeypot = readText(formData, "website");
  const startedAt = Number(readText(formData, "startedAt"));

  if (honeypot) {
    return true;
  }

  return Number.isFinite(startedAt) && Date.now() - startedAt < MINIMUM_COMPLETION_TIME_MS;
}

async function getRateLimitKey() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || requestHeaders.get("x-real-ip") || "ukjent";

  return createHash("sha256").update(address).digest("hex");
}

async function isRateLimited() {
  const now = Date.now();
  const key = await getRateLimitKey();
  const current = contactRateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    contactRateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;

  if (contactRateLimitBuckets.size > 1_000) {
    for (const [bucketKey, bucket] of contactRateLimitBuckets) {
      if (bucket.resetAt <= now) {
        contactRateLimitBuckets.delete(bucketKey);
      }
    }
  }

  return false;
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (isLikelyAutomatedSubmission(formData)) {
    return {
      status: "success",
      message: "Takk! Meldingen er mottatt.",
    };
  }

  const { data, errors } = validateContactForm(formData);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Kontroller feltene som er markert nedenfor.",
      errors,
    };
  }

  if (await isRateLimited()) {
    return {
      status: "error",
      message: "Du har sendt flere meldinger på kort tid. Vent litt før du prøver igjen.",
    };
  }

  try {
    await sendContactEmail(data);
  } catch (error) {
    const status = error instanceof ContactEmailError ? error.status : undefined;
    console.error("Kontaktskjemaet kunne ikke sende e-post.", { status });

    return {
      status: "error",
      message:
        "Vi fikk ikke sendt meldingen akkurat nå. Prøv igjen senere, eller send e-post direkte til lonnsinnsikt@gmail.com.",
    };
  }

  return {
    status: "success",
    message: "Takk! Meldingen er sendt. Vi svarer så snart vi kan.",
  };
}
