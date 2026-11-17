import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, Check, Loader2, Mail } from "lucide-react";
import { SITE, BUDGET_OPTIONS, SERVICE_OPTIONS } from "../data/content";
import { MaskLine, Fade } from "./Reveal";
import { cn } from "../utils/cn";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  details: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  details: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (!f.service) errors.service = "Pick the closest match.";
  if (f.details.trim().length < 20)
    errors.details = "Give us at least a sentence about the project.";
  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      return;
    }

    /**
     * FORM INTEGRATION POINT
     * When SITE.formEndpoint is configured (Formspree / Basin / own API),
     * the form POSTs there. Until then it composes a pre-filled email in the
     * visitor's mail client and clearly reports that behaviour — the form
     * never claims a message was "sent" when it was not.
     */
    if (SITE.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setStatus("sent");
        setForm(EMPTY);
      } catch {
        setStatus("error");
      }
    } else {
      const subject = encodeURIComponent(`Project inquiry — ${form.name}`);
      const body = encodeURIComponent(
        [
          `Name: ${form.name}`,
          `Email: ${form.email}`,
          form.company && `Company: ${form.company}`,
          `Need: ${form.service}`,
          form.budget && `Budget: ${form.budget}`,
          "",
          form.details,
        ]
          .filter(Boolean)
          .join("\n")
      );
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setStatus("mailto");
    }
  };

  return (
    <section id="contact" className="grid-bg-light relative bg-cream py-28 text-coal md:py-44">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* invitation */}
          <div className="flex flex-col lg:col-span-5">
            <Fade y={16}>
              <p className="mb-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-smoke">
                <span className="text-ember">(04)</span>
                <span className="inline-block h-px w-8 bg-line-dark" />
                Contact
              </p>
            </Fade>

            <h2 className="font-display font-semibold uppercase leading-[1] tracking-[-0.02em] text-coal text-[clamp(2.6rem,5.8vw,5.75rem)]">
              <MaskLine>Worth</MaskLine>
              <MaskLine delay={0.1}>
                <span className="text-ember">building?</span>
              </MaskLine>
            </h2>

            <Fade delay={0.25}>
              <a
                href={`mailto:${SITE.email}`}
                className="group mt-10 inline-flex w-fit items-center gap-3 border-b-2 border-coal pb-2 font-display text-xl font-semibold tracking-tight text-coal transition-colors hover:border-ember hover:text-ember md:mt-14 md:text-2xl"
              >
                <Mail className="h-5 w-5 shrink-0" />
                {SITE.email}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Fade>

            <Fade delay={0.35}>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.26em] text-smoke">
                {SITE.location} — worldwide
              </p>
            </Fade>
          </div>

          {/* form */}
          <Fade delay={0.15} className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={submit} noValidate aria-label="Project inquiry form">
              <div className="grid gap-7 md:grid-cols-2">
                <Field
                  id="name"
                  label="Name *"
                  error={errors.name}
                  value={form.name}
                  onChange={(v) => set("name", v)}
                  placeholder="Jane Appleseed"
                  autoComplete="name"
                />
                <Field
                  id="email"
                  label="Email *"
                  type="email"
                  error={errors.email}
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  placeholder="jane@company.com"
                  autoComplete="email"
                />
                <Field
                  id="company"
                  label="Company"
                  value={form.company}
                  onChange={(v) => set("company", v)}
                  placeholder="Optional"
                  autoComplete="organization"
                />
                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-smoke"
                  >
                    Budget
                  </label>
                  <select
                    id="budget"
                    value={form.budget}
                    onChange={(e) => set("budget", e.target.value)}
                    className="w-full appearance-none border border-line-dark bg-transparent px-4 py-3.5 text-sm text-coal transition-colors focus:border-ember focus:outline-none"
                  >
                    <option value="">Optional</option>
                    {BUDGET_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* service chips */}
              <fieldset className="mt-10">
                <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-smoke">
                  What do you need? *
                </legend>
                <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Project type">
                  {SERVICE_OPTIONS.map((option) => {
                    const selected = form.service === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => set("service", option)}
                        className={cn(
                          "border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-200",
                          selected
                            ? "border-ember bg-ember text-ink"
                            : "border-line-dark bg-transparent text-coal hover:border-coal"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {errors.service && <FieldError message={errors.service} />}
              </fieldset>

              {/* details */}
              <div className="mt-10">
                <label
                  htmlFor="details"
                  className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-smoke"
                >
                  The project *
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                  aria-invalid={!!errors.details}
                  aria-describedby={errors.details ? "details-error" : undefined}
                  placeholder="What are you building? Who is it for?"
                  data-lenis-prevent="true"
                  className={cn(
                    "w-full resize-y border bg-transparent px-4 py-3.5 text-sm leading-relaxed text-coal placeholder:text-smoke/70 transition-colors focus:border-ember focus:outline-none",
                    errors.details ? "border-ember" : "border-line-dark"
                  )}
                />
                {errors.details && <FieldError id="details-error" message={errors.details} />}
              </div>

              {/* submit + status */}
              <div className="mt-10 flex flex-col gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex w-full items-center justify-center gap-3 border border-coal bg-coal py-4.5 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-paper transition-all duration-300 hover:border-ember hover:bg-ember hover:text-ink disabled:cursor-wait disabled:opacity-70 md:py-5"
                >
                  {status === "sending" ? (
                    <>
                      Sending
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Let&rsquo;s talk
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>

                <div aria-live="polite">
                  {status === "sent" && (
                    <StatusRow tone="ok" text="Message sent. We'll be in touch shortly." />
                  )}
                  {status === "mailto" && (
                    <StatusRow
                      tone="ok"
                      text="Your email client opened with everything pre-filled — press send there. (A direct endpoint can be connected in the site config.)"
                    />
                  )}
                  {status === "error" && (
                    <StatusRow
                      tone="warn"
                      text={`Delivery failed — email us directly at ${SITE.email}.`}
                    />
                  )}
                  {status === "idle" && Object.keys(errors).length > 0 && (
                    <StatusRow tone="warn" text="A few fields need attention." />
                  )}
                </div>
              </div>
            </form>
          </Fade>
        </div>
      </div>
    </section>
  );
}

/* ── form primitives ───────────────────────────────────────── */

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-smoke"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full border bg-transparent px-4 py-3.5 text-sm text-coal placeholder:text-smoke/70 transition-colors focus:border-ember focus:outline-none",
          error ? "border-ember" : "border-line-dark"
        )}
      />
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ember-deep">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

function StatusRow({ tone, text }: { tone: "ok" | "warn"; text: string }) {
  const ok = tone === "ok";
  return (
    <p
      className={cn(
        "flex items-start gap-2.5 border px-4 py-3 text-sm leading-relaxed",
        ok ? "border-coal/25 bg-paper/60 text-coal" : "border-ember bg-ember/10 text-ember-deep"
      )}
    >
      {ok ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      {text}
    </p>
  );
}
