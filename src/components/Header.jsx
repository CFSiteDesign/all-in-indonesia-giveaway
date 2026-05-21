// Menu bar — transparent, overlaid on the hero.

import { useState } from "react";
import { asset } from "../lib/asset.js";

const SITE = "https://madmonkeyhostels.com";

// Real Mad Monkey routes (from the site's primary navigation).
const LINKS = {
  home: `${SITE}/`,
  ourStory: `${SITE}/our-story`,
  hostels: `${SITE}/destination`,
  experience: `${SITE}/tours-events`,
  madLoyalty: `${SITE}/madloyalty`,
  login: `${SITE}/login`,
  bookNow: `${SITE}/booking`,
};

// Top-level menu links (caret = dropdown on the real site).
const navLinks = [
  { label: "Our Story", href: LINKS.ourStory },
  { label: "Hostels", href: LINKS.hostels, caret: true },
  { label: "Experience", href: LINKS.experience, caret: true },
  { label: "Mad Loyalty", href: LINKS.madLoyalty },
];

const mobileItems = [
  { label: "Our Story", href: LINKS.ourStory },
  { label: "Hostels", href: LINKS.hostels },
  { label: "Experience", href: LINKS.experience },
  { label: "Mad Loyalty", href: LINKS.madLoyalty },
  { label: "Login", href: LINKS.login },
];

function Caret({ className = "h-2.5 w-2.5" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m2.5 4 3.5 3.5L9.5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {/* Logo */}
        <a
          href={LINKS.home}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Mad Monkey"
        >
          <img src={asset("mm-logo.webp")} alt="Mad Monkey" className="h-9 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white"
            >
              {l.label}
              {l.caret && <Caret />}
            </a>
          ))}
          <a
            href={LINKS.login}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white"
          >
            Login
          </a>
          <a
            href={LINKS.bookNow}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2 text-sm font-bold text-black transition hover:brightness-95"
          >
            Book Now <Caret />
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6 18 18M18 6 6 18" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="bg-black/90 px-5 py-3 backdrop-blur-md lg:hidden">
          <div className="flex flex-col">
            {mobileItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/10 py-3 text-sm font-medium text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href={LINKS.bookNow}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-black"
            >
              Book Now
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
