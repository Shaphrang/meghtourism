"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ItineraryFormModal from "./ItineraryFormModal";

/* ---------- helpers ---------- */
function publicImageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/images/${encodeURI(path)}`;
}

/* ---------- simple icons (no extra deps) ---------- */
function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  );
}
function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path strokeWidth="2" strokeLinecap="round" d="m20 20-2.5-2.5" />
    </svg>
  );
}

/* ---------- types (list projection) ---------- */
type ItinListRow = {
  id: string;
  title: string | null;
  days: number | null;
  starting_point: string | null;
  ending_point: string | null;
  image: string | null;
  approval_status: "pending" | "approved" | "rejected" | null;
  updated_at: string | null;
  created_at: string | null;
};

type StatusTab = "all" | "approved" | "pending" | "rejected";

export default function DashboardClient({ agency }: { agency: any }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [itins, setItins] = useState<ItinListRow[] | null>(null);
  const [loadingItins, setLoadingItins] = useState(true);
  const [itinsError, setItinsError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [initialForEdit, setInitialForEdit] = useState<Partial<ItinListRow> | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<StatusTab>("all");

  // FAB -> inline button switch
  const [atBottom, setAtBottom] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/agency/login");
  };

  const refreshList = async () => {
    setLoadingItins(true);
    setItinsError(null);
    try {
      const { data, error } = await supabase
        .from("itineraries")
        .select(
          "id,title,days,starting_point,ending_point,image,approval_status,updated_at,created_at"
        )
        .eq("provider_id", agency.id)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("[Agency Dashboard] fetch itineraries error:", error);
        setItinsError(`(${error.code ?? ""}) ${error.message}`);
        setItins([]);
      } else {
        setItins((data ?? []) as ItinListRow[]);
      }
    } finally {
      setLoadingItins(false);
    }
  };

  useEffect(() => {
    refreshList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency.id]);

  // Observe bottom sentinel to hide/show floating FAB
  useEffect(() => {
    const el = bottomSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setAtBottom(entries[0]?.isIntersecting ?? false),
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const locationText = [agency.city, agency.district].filter(Boolean).join(", ");

  const filtered = useMemo(() => {
    const list = itins ?? [];
    const byTab =
      tab === "all" ? list : list.filter((x) => (x.approval_status ?? "pending") === tab);
    const q = query.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter((x) => {
      const hay = [
        x.title,
        x.starting_point,
        x.ending_point,
        x.approval_status,
        x.days?.toString(),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [itins, query, tab]);

  return (
    <main className="mx-auto w-full max-w-5xl">
      {/* Minimal, professional header */}
      <header className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide/loose opacity-80">Agency</div>
              <div className="text-lg font-semibold truncate">{agency.name}</div>
              <div className="text-[12px] opacity-80 truncate">{locationText || "—"}</div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/"
                className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm backdrop-blur transition"
              >
                Home
              </a>
              <button
                onClick={logout}
                className="rounded-xl bg-white/90 text-slate-900 hover:bg-white px-3 py-1.5 text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Search + Tabs (tight) */}
          <div className="px-4 pb-3">
            <div className="rounded-xl bg-white text-gray-900 shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                <IconSearch className="w-4 h-4 opacity-60" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search itineraries"
                  className="w-full bg-transparent outline-none text-sm py-1"
                />
                {query && (
                  <button
                    className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                    onClick={() => setQuery("")}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="px-2 pb-2">
                <Tabs tab={tab} setTab={setTab} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Agency identity — compact, no logo */}
      <section className="px-4 pt-3">
        <div className="rounded-xl border shadow-sm bg-white p-3">
          {/* Name + location */}
          <div className="min-w-0">
            <div className="font-medium truncate">{agency.name}</div>
            <div className="text-[12px] text-gray-600 truncate">{locationText || "—"}</div>
          </div>

          {/* Row 1: Phone + Email */}
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-gray-500">Phone</div>
              <div className="text-[11px] truncate">{agency.phone || "—"}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-gray-500">Email</div>
              <div className="text-[11px] truncate">{agency.email || "—"}</div>
            </div>
          </div>

          {/* Row 2: Website + GSTIN (same spacing as above) */}
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <div className="text-[11px] text-gray-500">Website</div>
              <div className="text-[11px] truncate">{agency.website || "—"}</div>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-gray-500">GSTIN</div>
              <div className="text-[11px] truncate">{agency.gstin || "—"}</div>
            </div>
          </div>

          {/* Edit profile (below, aligned left) */}
          <div className="mt-3">
            <button
              onClick={() => router.push("/agency/profile")}
              className="text-[12px] rounded-lg border px-3 py-1.5 hover:bg-gray-50"
              title="Edit profile"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>
 

      {/* Itineraries */}
      <section className="px-4 mt-4">
        {/* Error */}
        {itinsError && (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 px-3 py-2 text-sm">
            Couldn’t load itineraries: {itinsError}
          </div>
        )}

        {/* Loading skeleton */}
        {loadingItins && (
          <ul className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="rounded-xl border p-3 bg-white shadow-sm animate-pulse">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty */}
        {!loadingItins && (filtered?.length ?? 0) === 0 && !itinsError && (
          <div className="text-center py-10">
            <div className="mx-auto w-14 h-14 rounded-xl bg-gray-100 grid place-items-center mb-2.5">
              <IconPlus className="w-6 h-6 text-gray-500" />
            </div>
            <div className="text-gray-800 font-medium">No itineraries yet</div>
            <div className="text-sm text-gray-600">Tap “Add itinerary” to create your first one.</div>
          </div>
        )}

        {/* List */}
        {!loadingItins && (filtered?.length ?? 0) > 0 && (
          <ul className="grid gap-3">
            {filtered!.map((it) => {
              const img = publicImageUrl(it.image);
              const subtitle =
                (it.days || 0) > 0
                  ? `${it.days!} day${it.days! > 1 ? "s" : ""} · ${it.starting_point || "—"} → ${
                      it.ending_point || "—"
                    }`
                  : `${it.starting_point || "—"} → ${it.ending_point || "—"}`;
              return (
                <li
                  key={it.id}
                  className="rounded-xl border shadow-sm bg-white overflow-hidden active:scale-[0.997] transition-transform"
                >
                  <button
                    className="w-full text-left"
                    onClick={() => {
                      setModalMode("edit");
                      setEditingRowId(it.id);
                      setInitialForEdit(it);
                      setShowModal(true);
                    }}
                    title="Edit itinerary"
                  >
                    <div className="p-3 flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 ring-1 ring-black/5">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-[11px] text-gray-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium truncate">{it.title || "Untitled itinerary"}</div>
                          <StatusBadge s={it.approval_status || "pending"} />
                        </div>
                        <div className="text-xs text-gray-600 truncate mt-0.5">{subtitle}</div>
                        <div className="text-[11px] text-gray-500 truncate mt-0.5">
                          Updated {new Date(it.updated_at ?? it.created_at ?? "").toLocaleString()}
                        </div>
                      </div>

                      <IconChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Inline “Add itinerary” at bottom (appears when scrolled to the end) */}
        <div ref={bottomSentinelRef} className="h-8" />
        <div className={`mt-3 ${atBottom ? "block" : "hidden"}`}>
          <button
            onClick={() => {
              setModalMode("create");
              setEditingRowId(null);
              setInitialForEdit(null);
              setShowModal(true);
            }}
            className="w-full h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 text-white text-sm font-medium shadow active:scale-[0.99] transition"
          >
            Add itinerary
          </button>
        </div>
      </section>

      {/* Floating Action Button (hidden when bottom inline button is visible) */}
      {!atBottom && (
        <button
          onClick={() => {
            setModalMode("create");
            setEditingRowId(null);
            setInitialForEdit(null);
            setShowModal(true);
          }}
          className="fixed bottom-5 right-5 rounded-full shadow-lg shadow-indigo-500/15 bg-gradient-to-br from-indigo-600 to-slate-900 text-white flex items-center gap-2 pl-4 pr-4 h-12 active:scale-95 transition"
          aria-label="Add itinerary"
          title="Add itinerary"
        >
          <IconPlus className="w-5 h-5" />
          <span className="text-sm font-medium">Add itinerary</span>
        </button>
      )}

      {/* Modal (create/edit) */}
      {showModal && (
        <ItineraryFormModal
          open={showModal}
          mode={modalMode}
          providerId={agency.id}
          rowId={editingRowId || undefined}
          initial={initialForEdit || undefined}
          onClose={() => setShowModal(false)}
          onSaved={refreshList}
        />
      )}
    </main>
  );
}

/* ---------- UI bits ---------- */

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-gray-700 bg-gray-50">
      {label}
    </span>
  );
}

function StatusBadge({ s }: { s: "pending" | "approved" | "rejected" | string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
  };
  const cls = map[s] || "bg-gray-100 text-gray-700 border-gray-200";
  const label = s || "pending";
  return (
    <span className={`inline-block rounded-full text-[11px] px-2 py-0.5 border ${cls}`}>
      {label}
    </span>
  );
}

function Tabs({ tab, setTab }: { tab: StatusTab; setTab: (t: StatusTab) => void }) {
  const tabs: { key: StatusTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "approved", label: "Approved" },
    { key: "pending", label: "Pending" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg bg-gray-100 p-1">
      {tabs.map((t) => {
        const active = tab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={[
              "text-xs font-medium rounded-md px-2 py-1.5 transition",
              active ? "bg-white shadow ring-1 ring-black/5" : "text-gray-600 hover:bg-gray-200",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
