"use client";

import React, { useEffect, useState } from "react";
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
 
/* ---------- types (list projection) ---------- */
type ItinListRow = {
  id: string;
  title: string | null;
  days: number | null;
  starting_point: string | null;
  ending_point: string | null;
  image: string | null;
  approval_status: string | null;
  updated_at: string | null;
  created_at: string | null;
};

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

  const locationText = [agency.city, agency.district].filter(Boolean).join(", ");

  return (
    <main className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[11px] text-gray-500">Agency</div>
            <div className="text-base font-semibold truncate">{agency.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/agency/profile" className="rounded-xl border px-3 py-1.5 text-sm">
              Profile
            </a>
            <button onClick={logout} className="rounded-xl bg-gray-900 text-white px-3 py-1.5 text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile summary (read-only) */}
      <section className="px-4 pt-3">
        <div className="rounded-2xl border shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Info label="Name" value={agency.name} />
              <Info label="Location" value={locationText || "—"} />
              <Info label="Phone" value={agency.phone || "—"} />
              <Info label="Email" value={agency.email || "—"} />
              <Info label="Website" value={agency.website || "—"} />
              <Info label="GSTIN" value={agency.gstin || "—"} />
            </div>
            <div className="w-24 shrink-0">
              <div className="text-sm font-medium mb-1">Profile</div>
              <div className="aspect-square rounded-xl border overflow-hidden bg-gray-50">
                {agency.logo_url ? (
                  <img src={publicImageUrl(agency.logo_url) ?? ""} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-[11px] text-gray-500">No image</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-sm font-medium">Description</div>
            <div className="mt-1 rounded-xl border p-3 text-sm min-h-[56px]">
              {agency.short_description || <span className="text-gray-500">No description</span>}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES label */}
      <div className="px-4 mt-4">
        <h2 className="text-[11px] font-semibold tracking-wider text-gray-500">SERVICES</h2>
      </div>

      {/* Itineraries */}
      <section className="px-4 mt-2 pb-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Itineraries</div>
          <button
            onClick={() => {
              setModalMode("create");
              setEditingRowId(null);
              setInitialForEdit(null);
              setShowModal(true);
            }}
            className="rounded-xl bg-gray-900 text-white px-4 py-2 text-sm"
          >
            Create Itinerary
          </button>
        </div>

        {/* Error banner */}
        {itinsError && (
          <div className="mb-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-3 py-2 text-sm">
            Couldn’t load itineraries: {itinsError}
          </div>
        )}

        {/* Loading */}
        {loadingItins && (
          <ul className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="rounded-2xl border p-3 animate-pulse bg-gray-50 h-20" />
            ))}
          </ul>
        )}

        {/* Empty */}
        {!loadingItins && (itins?.length ?? 0) === 0 && !itinsError && (
          <div className="text-sm text-gray-600">No itineraries yet. Create your first itinerary.</div>
        )}

        {/* List */}
        {!loadingItins && (itins?.length ?? 0) > 0 && (
          <ul className="grid gap-3">
            {itins!.map((it) => {
              const img = publicImageUrl(it.image);
              return (
                <li key={it.id} className="rounded-2xl border shadow-sm p-3 flex items-center gap-3 bg-white">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden">
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[11px] text-gray-500">No image</div>
                    )}
                  </div>

                  <button
                    className="flex-1 text-left min-w-0"
                    onClick={() => {
                      setModalMode("edit");
                      setEditingRowId(it.id);
                      setInitialForEdit(it);
                      setShowModal(true);
                    }}
                    title="Edit itinerary"
                  >
                    <div className="font-medium truncate">{it.title || "Untitled itinerary"}</div>
                    <div className="text-xs text-gray-600 truncate">
                      {(it.days || 0) > 0 ? `${it.days!} day${it.days! > 1 ? "s" : ""}` : "—"} ·{" "}
                      {it.starting_point || "—"} → {it.ending_point || "—"}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      Updated {new Date(it.updated_at ?? it.created_at ?? "").toLocaleString()}
                    </div>
                  </button>

                  <div className="text-right shrink-0">
                    <span className="inline-block rounded-full text-xs px-2 py-1 border">
                      {it.approval_status || "pending"}
                    </span>
                    <div className="mt-2">
                      <button
                        className="text-xs rounded-lg border px-2 py-1"
                        onClick={() => {
                          setModalMode("edit");
                          setEditingRowId(it.id);
                          setInitialForEdit(it);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3 bg-white">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm mt-1 truncate">{value || "—"}</div>
    </div>
  );
}
