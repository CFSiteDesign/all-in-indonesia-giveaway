import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase.js";

function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) setError(error.message);
    // On success, onAuthStateChange in <Admin> swaps in the dashboard.
  }

  const fieldClass =
    "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-5">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h1 className="font-display text-5xl leading-none text-brand">ADMIN</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Mad Monkey — ALL IN Indonesia Giveaway
        </p>

        <div className="mt-7 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className={fieldClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-brand py-3 text-sm font-extrabold uppercase tracking-wide text-black transition active:scale-[0.99] disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("giveaway_entries")
      .select("*")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setLoadError(error.message);
        else setEntries(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sources = useMemo(() => {
    const counts = {};
    for (const e of entries) {
      const key = e.source || "direct";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = entries;
    if (q) {
      rows = rows.filter(
        (e) =>
          (e.name || "").toLowerCase().includes(q) ||
          (e.email || "").toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => {
      const diff = new Date(a.created_at) - new Date(b.created_at);
      return sortAsc ? diff : -diff;
    });
  }, [entries, search, sortAsc]);

  function exportCsv() {
    const headers = ["name", "email", "whatsapp", "source", "created_at"];
    const escape = (value) => {
      const s = String(value ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = entries.map((e) =>
      [e.name, e.email, e.whatsapp, e.source, e.created_at]
        .map(escape)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giveaway-entries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function pickWinner() {
    if (entries.length === 0) return;
    setWinner(entries[Math.floor(Math.random() * entries.length)]);
  }

  const btnClass =
    "rounded-lg px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99]";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-5 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Total entries
            </p>
            <p className="font-display text-7xl leading-none text-brand">
              {entries.length}
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className={`${btnClass} border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white`}
          >
            Log out
          </button>
        </div>

        {/* Source breakdown */}
        {sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {sources.map(([source, count]) => (
              <span
                key={source}
                className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-sm"
              >
                <span className="text-neutral-400">{source}</span>{" "}
                <span className="font-semibold text-brand">{count}</span>
              </span>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="min-w-[200px] flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-brand focus:outline-none"
          />
          <button
            onClick={exportCsv}
            className={`${btnClass} border border-neutral-800 bg-neutral-900 text-white hover:border-brand`}
          >
            Export CSV
          </button>
          <button
            onClick={pickWinner}
            className={`${btnClass} bg-brand font-extrabold uppercase tracking-wide text-black`}
          >
            Pick a winner
          </button>
        </div>

        {/* Winner card */}
        {winner && (
          <div className="mt-6 rounded-xl border-2 border-brand bg-brand/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">
              Winner
            </p>
            <p className="mt-1 text-2xl font-bold">{winner.name}</p>
            <p className="text-neutral-300">{winner.email}</p>
            <p className="text-neutral-300">{winner.whatsapp}</p>
          </div>
        )}

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">WhatsApp</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th
                  onClick={() => setSortAsc((v) => !v)}
                  className="cursor-pointer select-none px-4 py-3 font-medium hover:text-white"
                >
                  Date {sortAsc ? "▲" : "▼"}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    Loading entries...
                  </td>
                </tr>
              )}
              {!loading && loadError && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-red-400"
                  >
                    {loadError}
                  </td>
                </tr>
              )}
              {!loading && !loadError && visible.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    {entries.length === 0
                      ? "No entries yet."
                      : "No entries match your search."}
                  </td>
                </tr>
              )}
              {visible.map((e) => (
                <tr key={e.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3 text-neutral-300">{e.email}</td>
                  <td className="px-4 py-3 text-neutral-300">{e.whatsapp}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                      {e.source || "direct"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {formatDate(e.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-500">
        Loading...
      </div>
    );
  }

  return session ? <Dashboard /> : <Login />;
}
