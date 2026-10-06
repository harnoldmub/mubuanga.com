"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

const FIELDS = [
  { name: "name", label: "Nom", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "company", label: "Structure", type: "text", autoComplete: "organization", required: false },
] as const;

/**
 * No backend to maintain and no third-party form service holding the data:
 * the form composes a mail and hands it to the visitor's own client.
 */
export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", company: "", subject: "", message: "" });

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      values.message.trim(),
      "",
      "—",
      values.name && `Nom : ${values.name}`,
      values.email && `Email : ${values.email}`,
      values.company && `Structure : ${values.company}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      values.subject || "Prise de contact — mubuanga.com",
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full border-0 border-b border-ink-line bg-transparent py-3 text-paper placeholder:text-paper/50 transition-colors duration-300 focus:border-gold";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-3">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="meta">
              {f.label}
              {f.required && <span className="text-gold"> *</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.required}
              value={values[f.name as keyof typeof values]}
              onChange={(e) => set(f.name, e.target.value)}
              className={`${field} mt-2`}
              placeholder={f.name === "email" ? "vous@structure.com" : ""}
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="subject" className="meta">
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={(e) => set("subject", e.target.value)}
          className={`${field} mt-2`}
          placeholder="Application métier, plateforme, refonte…"
        />
      </div>

      <div>
        <label htmlFor="message" className="meta">
          Votre contexte <span className="text-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          className={`${field} mt-2 resize-none`}
          placeholder="Ce que vous voulez construire, pour qui, et à quelle échéance."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="meta">Ouvre votre messagerie</p>
        <button type="submit" className="btn btn-primary">
          Envoyer
          <ArrowRight className="arrow h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
