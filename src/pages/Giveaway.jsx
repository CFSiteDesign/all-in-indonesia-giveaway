import { useState, useEffect } from "react";
import PhoneInput, {
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { supabase } from "../lib/supabase.js";
import { asset } from "../lib/asset.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

// Set to an ISO date string (e.g. "2026-07-01T23:59:59") to show a live
// countdown. Leave null to show the static urgency line instead.
const GIVEAWAY_ENDS = null;

function getSource() {
  const src = new URLSearchParams(window.location.search).get("src");
  return src && src.trim() ? src.trim() : "direct";
}

function useCountdown(targetMs) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetMs) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (!targetMs) return null;
  const remaining = targetMs - now;
  if (remaining <= 0) return null;

  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
  };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl leading-none text-brand">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[0.6rem] uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
}

// Red-box tooltip shown under a field when its value fails validation.
function FieldError({ children }) {
  return (
    <div className="relative mt-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-red-900/40">
      <span className="absolute -top-1 left-4 h-2 w-2 rotate-45 rounded-[2px] bg-red-600" />
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border bg-black/40 px-4 py-3 text-white placeholder-white/40 focus:outline-none transition-colors";

export default function Giveaway() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const endsAtMs = GIVEAWAY_ENDS ? new Date(GIVEAWAY_ENDS).getTime() : null;
  const countdown = useCountdown(endsAtMs);

  function validate() {
    const next = {};
    if (!name.trim()) {
      next.name = "Please enter your full name.";
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "That email doesn't look right.";
    }
    if (!whatsapp) {
      next.whatsapp = "Please enter your WhatsApp number.";
    } else if (!isPossiblePhoneNumber(whatsapp)) {
      next.whatsapp =
        "That number doesn't have enough digits for the selected country.";
    } else if (!isValidPhoneNumber(whatsapp)) {
      next.whatsapp = "Enter a valid phone number for the selected country.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    // Honeypot: a real user never fills this. Fake success, skip the insert.
    if (website) {
      setDone(true);
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      whatsapp,
      source: getSource(),
    };

    // Retry a few times so a transient network blip doesn't drop the entry.
    let error = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      ({ error } = await supabase.from("giveaway_entries").insert(payload));
      if (!error) break;
      console.error(`Giveaway insert failed (attempt ${attempt}/3):`, error);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 700));
    }
    setSubmitting(false);

    if (error) {
      setSubmitError("Couldn't submit your entry. Please try again.");
      return;
    }
    setDone(true);
  }

  return (
    <div className="bg-black">
      {/* Hero section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Hero background */}
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${asset("hero.jpg")})`,
            backgroundPosition: "62% center",
          }}
        />
        {/* Dark gradient scrim — darker top and bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />

        {/* Transparent menu bar overlaid on the hero */}
        <Header />

        {/* Content */}
        <main className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center gap-7 px-5 pb-12 pt-28 sm:pt-12">
        {done ? (
          <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md">
            <h2 className="font-display text-6xl leading-none text-brand">
              YOU'RE IN
            </h2>
            <p className="mt-4 text-white/80">
              Good luck. Winner announced soon — keep an eye on your inbox and
              WhatsApp.
            </p>
          </div>
        ) : (
          <>
            {/* Headline block */}
            <div className="flex flex-col items-center text-center">
              <span className="font-display text-[6rem] leading-[0.82] text-brand sm:text-[7rem]">
                WIN
              </span>
              <span className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                The Ultimate Experience In
              </span>
              <span className="outline-text font-display text-6xl leading-[0.85] sm:text-7xl">
                INDONESIA
              </span>
              <span className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                For You + A Mate
              </span>
            </div>

            {/* Offer line */}
            <div className="text-center">
              <p className="text-balance text-xl font-semibold leading-snug text-white sm:text-2xl">
                Win the Ultimate Indonesia Experience for you + a mate
              </p>
              <p className="mt-1.5 text-sm text-white/70">
                Enter your details below to go in the draw. We'll contact the
                winner by email or phone.
              </p>
            </div>

            {/* Urgency cue */}
            {countdown ? (
              <div className="flex items-center gap-5">
                <CountdownUnit value={countdown.days} label="Days" />
                <CountdownUnit value={countdown.hours} label="Hours" />
                <CountdownUnit value={countdown.minutes} label="Mins" />
              </div>
            ) : (
              <p className="text-balance text-xs font-semibold uppercase leading-snug tracking-wide text-brand sm:text-sm">
                Entries close soon — get your name in the draw.
              </p>
            )}

            {/* Form card */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md"
            >
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className={`${inputClass} ${
                      errors.name ? "border-red-500" : "border-white/20"
                    } focus:border-brand`}
                  />
                  {errors.name && <FieldError>{errors.name}</FieldError>}
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    className={`${inputClass} ${
                      errors.email ? "border-red-500" : "border-white/20"
                    } focus:border-brand`}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </div>

                <div>
                  <div
                    className={`phone-field flex items-center rounded-xl border bg-black/40 px-4 py-3 ${
                      errors.whatsapp ? "border-red-500" : "border-white/20"
                    }`}
                  >
                    <PhoneInput
                      international
                      defaultCountry="ID"
                      value={whatsapp}
                      onChange={(value) => setWhatsapp(value || "")}
                      placeholder="WhatsApp number"
                    />
                  </div>
                  {errors.whatsapp && (
                    <FieldError>{errors.whatsapp}</FieldError>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-brand py-4 text-base font-extrabold uppercase tracking-wide text-black transition active:scale-[0.99] disabled:opacity-60"
              >
                {submitting ? "Entering..." : "Enter the Giveaway"}
              </button>

              {submitError && (
                <div className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white">
                  {submitError}
                </div>
              )}

              <p className="mt-3 text-center text-[0.7rem] leading-snug text-white/50">
                By entering you agree to be contacted about this giveaway and
                Mad Monkey offers.
              </p>
            </form>
          </>
        )}
        </main>
      </section>

      <Footer />
    </div>
  );
}
