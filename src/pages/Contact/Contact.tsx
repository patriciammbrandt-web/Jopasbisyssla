import { useState, type FormEvent } from "react";
import Reveal from "../../components/Reveal/Reveal";
import PageHeader from "../../components/PageHeader/PageHeader";
import Socials from "../../components/Socials/Socials";
import { usePageMeta } from "../../hooks/usePageMeta";
import { CONTACT } from "../../data/site";
import "./Contact.css";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  usePageMeta({
    title: "Kontakt",
    description:
      "Kontakta Jopas Honung – ring, mejla eller skicka ett meddelande. Vi svarar gärna på frågor om honung, bisamhällen och pollinering.",
    path: "/kontakt",
  });

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setSubmitError(null);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Fyll i ditt namn.";
    if (!form.email.trim()) {
      next.email = "Fyll i din e-post.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Ange en giltig e-postadress.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = "Skriv gärna några rader (minst 10 tecken).";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length > 0) return;

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
      | string
      | undefined;
    if (!accessKey) {
      setSubmitError("Formuläret saknar e-postnyckel. Kontakta webbansvarig.");
      return;
    }

    setSubmitting(true);
    try {
      // Web3Forms måste anropas från webbläsaren – deras API blockerar
      // server-IP:n (Cloudflare). Access key är avsedd att ligga i frontend.
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || "Meddelande från Jopas Honung",
          message: form.message.trim(),
          from_name: "Jopas Honung",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !data.success) {
        setSubmitError(data.message || "Något gick fel. Försök igen.");
        return;
      }
      setSent(true);
      setForm(EMPTY);
    } catch {
      setSubmitError("Kunde inte skicka just nu. Försök igen om en stund.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <PageHeader
        eyebrow="Kontakt"
        title="Hör av dig – vi ses gärna"
        intro="Vill du köpa honung, boka pollinering eller bara prata bin? Skriv en rad så återkommer vi så snart vi är tillbaka från kuporna."
      />

      <section className="section">
        <div className="container contact__grid">
          {/* Form */}
          <Reveal variant="left" className="contact__form-wrap">
            {sent ? (
              <div className="contact__success" role="status">
                <span className="contact__success-mark" aria-hidden="true">
                  ✓
                </span>
                <h2>Tack för ditt meddelande!</h2>
                <p>
                  Vi har tagit emot din förfrågan och hör av oss så snart vi
                  kan. Under skördetid kan det ta någon dag – bina går först.
                </p>
                <button
                  type="button"
                  className="contact__reset"
                  onClick={() => setSent(false)}
                >
                  Skicka ett till
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="name">Namn</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    placeholder="Ditt namn"
                    disabled={submitting}
                  />
                  {errors.name && (
                    <span id="err-name" className="field__error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="email">E-post</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    placeholder="namn@exempel.se"
                    disabled={submitting}
                  />
                  {errors.email && (
                    <span id="err-email" className="field__error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="subject">Ämne</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="Vad gäller det?"
                    disabled={submitting}
                  />
                </div>

                <div className="field">
                  <label htmlFor="message">Meddelande</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    placeholder="Berätta vad vi kan hjälpa till med…"
                    disabled={submitting}
                  />
                  {errors.message && (
                    <span id="err-message" className="field__error">
                      {errors.message}
                    </span>
                  )}
                </div>

                {submitError && (
                  <p className="field__error" role="alert">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  className="contact__submit"
                  disabled={submitting}
                >
                  {submitting ? "Skickar…" : "Skicka meddelande"}
                  {!submitting && <span aria-hidden="true">→</span>}
                </button>
              </form>
            )}
          </Reveal>

          {/* Info */}
          <Reveal variant="right" delay={120} className="contact__aside">
            <div className="contact__card">
              <h2 className="contact__card-title">Kontaktuppgifter</h2>
              <ul className="contact__list">
                <li>
                  <span className="contact__label">Telefon</span>
                  <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                </li>
                <li>
                  <span className="contact__label">E-post</span>
                  <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                </li>
                <li>
                  <span className="contact__label">Område</span>
                  <span>{CONTACT.region}</span>
                </li>
                <li>
                  <span className="contact__label">Ansvarig</span>
                  <span>{CONTACT.company}</span>
                </li>
              </ul>

              <div className="contact__socials">
                <span className="contact__label">Följ oss</span>
                <Socials className="contact__social-links" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
