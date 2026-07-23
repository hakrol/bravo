"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitContactForm } from "@/app/kontakt/actions";
import { initialContactFormState } from "@/lib/contact-form";

const inputClassName =
  "mt-2 w-full rounded-[5px] border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--primary-strong)] focus:ring-2 focus:ring-[rgba(20,83,45,0.14)]";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 text-sm font-semibold text-red-700" id={id}>
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) {
      startedAtRef.current.value = String(Date.now());
    }
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      if (startedAtRef.current) {
        startedAtRef.current.value = String(Date.now());
      }
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[5px] border border-[rgba(27,36,48,0.1)] bg-white p-5 shadow-[0_18px_50px_rgba(27,36,48,0.07)] sm:p-7"
    >
      <input ref={startedAtRef} name="startedAt" type="hidden" />

      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Nettside</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-extrabold text-slate-900" htmlFor="contact-name">
            Navn
          </label>
          <input
            aria-describedby={state.errors?.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(state.errors?.name)}
            autoComplete="name"
            className={inputClassName}
            id="contact-name"
            maxLength={80}
            name="name"
            placeholder="Ditt navn"
            required
            type="text"
          />
          <FieldError id="contact-name-error" message={state.errors?.name} />
        </div>

        <div>
          <label className="text-sm font-extrabold text-slate-900" htmlFor="contact-email">
            E-post
          </label>
          <input
            aria-describedby={state.errors?.email ? "contact-email-error" : undefined}
            aria-invalid={Boolean(state.errors?.email)}
            autoComplete="email"
            className={inputClassName}
            id="contact-email"
            maxLength={254}
            name="email"
            placeholder="navn@eksempel.no"
            required
            type="email"
          />
          <FieldError id="contact-email-error" message={state.errors?.email} />
        </div>
      </div>

      <div className="mt-5">
        <label className="text-sm font-extrabold text-slate-900" htmlFor="contact-message">
          Melding
        </label>
        <textarea
          aria-describedby={state.errors?.message ? "contact-message-error" : undefined}
          aria-invalid={Boolean(state.errors?.message)}
          className={`${inputClassName} min-h-44 resize-y`}
          id="contact-message"
          maxLength={5_000}
          minLength={20}
          name="message"
          placeholder="Beskriv spørsmålet eller feilen så konkret som mulig."
          required
          rows={7}
        />
        <FieldError id="contact-message-error" message={state.errors?.message} />
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            aria-describedby={state.errors?.privacy ? "contact-privacy-error" : undefined}
            aria-invalid={Boolean(state.errors?.privacy)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary-strong)]"
            name="privacy"
            required
            type="checkbox"
          />
          <span>
            Jeg har lest{" "}
            <Link
              className="font-bold text-[var(--primary-strong)] underline underline-offset-4"
              href="/personvern"
            >
              personvernerklæringen
            </Link>{" "}
            og forstår hvordan opplysningene i skjemaet behandles.
          </span>
        </label>
        <FieldError id="contact-privacy-error" message={state.errors?.privacy} />
      </div>

      {state.message ? (
        <div
          aria-live="polite"
          className={`mt-6 rounded-[5px] border px-4 py-3 text-sm font-semibold leading-6 ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      ) : null}

      <button
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[5px] bg-[var(--primary-strong)] px-6 py-3 text-base font-extrabold text-white transition hover:bg-[#0f4525] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={pending}
        type="submit"
      >
        {pending ? "Sender …" : "Send melding"}
      </button>
    </form>
  );
}
