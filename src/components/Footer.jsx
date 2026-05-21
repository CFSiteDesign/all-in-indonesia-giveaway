// Replica of the Mad Monkey site footer.

const SITE = "https://madmonkeyhostels.com";

// Footer links — real hrefs taken from the live Mad Monkey site.
const linkGroups = {
  rulesLegal: {
    heading: "Rules & Legal",
    links: [
      { label: "Tour & Groups", href: `${SITE}/groups/` },
      { label: "No Sex Tourists", href: `${SITE}/no-sex-tourists/` },
      { label: "Cancellation Policy", href: `${SITE}/cancellation-policy/` },
      { label: "Privacy Policy", href: `${SITE}/privacy-policy/` },
      { label: "Terms & Conditions", href: `${SITE}/terms-and-conditions/` },
    ],
  },
  partner: {
    heading: "Partner With Us",
    links: [
      { label: "Investor", href: `${SITE}/partners/investors/` },
      { label: "Property Partners", href: `${SITE}/partners/property-partners/` },
      { label: "Content Creators", href: `${SITE}/creative-hub/` },
      { label: "Travel Agencies", href: `${SITE}/partners/travel-agents/` },
      {
        label: "Tour Operators & Suppliers",
        href: `${SITE}/partners/suppliers/`,
      },
    ],
  },
  career: {
    heading: "Career",
    links: [{ label: "We're Hiring", href: `${SITE}/career/` }],
  },
  press: {
    heading: "Press",
    links: [{ label: "Mad Monkey Press Releases", href: `${SITE}/press-releases/` }],
  },
  blog: {
    heading: "Travel Blog",
    links: [{ label: "Mad Monkey's Travel Blog", href: `${SITE}/our-blog/` }],
  },
  guests: {
    heading: "Guests",
    links: [
      // E-Sim Deals is plain text on the live site (no link).
      { label: "E-Sim Deals", href: null },
      { label: "Creator Hub Stays", href: `${SITE}/creatorhub/` },
    ],
  },
};

const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/madmonkeyhostels/",
    src: "/social/instagram.svg",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@madmonkeyhostels",
    src: "/social/tiktok.svg",
  },
  {
    name: "X",
    href: "https://twitter.com/madmonkeyhostel",
    src: "/social/x.webp",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/MadMonkeyHostels",
    src: "/social/facebook.svg",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCkUGlFdhp5Ndk68j_QRS1kw",
    src: "/social/youtube.svg",
  },
];

function LinkGroup({ heading, links }) {
  return (
    <div>
      <p className="text-base font-bold text-white">{heading}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] text-white/55 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <span className="text-[15px] text-white/55">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-32">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src="/mm-head-outlined.png"
              alt="Mad Monkey"
              className="h-11 w-auto"
            />
            <p className="mt-3 font-montserrat text-2xl font-extrabold tracking-tight">
              Mad Monkey
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="transition-transform hover:-translate-y-0.5"
                >
                  <img
                    src={s.src}
                    alt={s.name}
                    className="h-9 w-9 rounded-lg"
                  />
                </a>
              ))}
            </div>
            <p className="mt-7 text-xs tracking-wide text-white/40">
              ALL RIGHTS RESERVED © MAD MONKEY. 2026
            </p>
          </div>

          {/* Rules & Legal + Partner With Us */}
          <div className="space-y-10">
            <LinkGroup {...linkGroups.rulesLegal} />
            <LinkGroup {...linkGroups.partner} />
          </div>

          {/* Career + Press + Travel Blog + Guests */}
          <div className="space-y-10">
            <LinkGroup {...linkGroups.career} />
            <LinkGroup {...linkGroups.press} />
            <LinkGroup {...linkGroups.blog} />
            <LinkGroup {...linkGroups.guests} />
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-base font-bold text-white">Stay Updated with Us</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Name *"
                className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-neutral-300 py-3 text-sm font-bold uppercase tracking-wide text-neutral-900 transition hover:bg-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
