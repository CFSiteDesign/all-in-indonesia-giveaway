import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { supabase } from "../lib/supabase.js";
import { asset } from "../lib/asset.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";

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
    } else if (!isValidPhoneNumber(whatsapp)) {
      next.whatsapp = "Enter a valid number, including country code.";
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
    const { error } = await supabase.from("giveaway_entries").insert({
      name: name.trim(),
      email: email.trim(),
      whatsapp,
      source: getSource(),
    });
    setSubmitting(false);

    if (error) {
      setSubmitError("Something went wrong. Please try again.");
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
        <main className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center gap-7 px-5 pb-24 pt-12">
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
              <p className="text-lg font-semibold text-white">
                Win the Ultimate Indonesia Experience for you + a&nbsp;mate
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
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
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
                      errors.name ? "border-white/70" : "border-white/20"
                    } focus:border-brand`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-white">{errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    autoComplete="email"
                    className={`${inputClass} ${
                      errors.email ? "border-white/70" : "border-white/20"
                    } focus:border-brand`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-white">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div
                    className={`phone-field flex items-center rounded-xl border bg-black/40 px-4 py-3 ${
                      errors.whatsapp ? "border-white/70" : "border-white/20"
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
                    <p className="mt-1.5 text-xs text-white">
                      {errors.whatsapp}
                    </p>
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
                <p className="mt-3 text-center text-xs text-white">
                  {submitError}
                </p>
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
      <BottomNav />
    </div>
  );
}
