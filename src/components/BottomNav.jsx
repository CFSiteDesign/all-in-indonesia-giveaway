// Replica of the Mad Monkey site menu bar — a fixed mobile-style bottom tab bar.

const TEAL = "#1FB5A5";
const MAD_MONKEY_URL = "https://madmonkeyhostels.com/";

function HomeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="12" cy="10" r="3.25" />
      <path d="M5.7 19a6.7 6.7 0 0 1 12.6 0" />
    </svg>
  );
}

function ChatIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-12.8 7.2L3 21l1.4-4.1A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

const items = [
  { label: "Home", href: MAD_MONKEY_URL, Icon: HomeIcon, active: true },
  {
    label: "Search",
    href: "https://madmonkeyhostels.com/destination",
    Icon: SearchIcon,
  },
  { label: "Login", href: MAD_MONKEY_URL, Icon: UserIcon },
  { label: "Live Chat", href: MAD_MONKEY_URL, Icon: ChatIcon },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white shadow-[0_-2px_14px_rgba(0,0,0,0.14)] lg:hidden">
      <ul className="mx-auto flex max-w-[480px] items-stretch">
        {items.map(({ label, href, Icon, active }) => (
          <li key={label} className="flex-1">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col items-center gap-1 py-2.5"
              style={{ color: active ? TEAL : "#7a7a7a" }}
            >
              {active && (
                <span
                  className="absolute left-1/2 top-0 h-1 w-10 -translate-x-1/2 rounded-b-full"
                  style={{ backgroundColor: TEAL }}
                />
              )}
              <Icon className="h-6 w-6" />
              <span className="text-xs font-semibold">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
