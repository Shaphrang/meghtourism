"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User } from "@supabase/supabase-js";

type Agency = {
  id: string;
  name: string;
  slug: string;
  short_description?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  pincode?: string | null;
  gstin?: string | null;
  years_in_service?: number | null;
  social?: Record<string, string> | null;
  show_public_profile: boolean;
};

type Ctx = {
  user: User | null;
  agency: Agency | null;
  refresh: () => Promise<void>;
  loading: boolean;
};

const AgencyContext = createContext<Ctx>({ user: null, agency: null, refresh: async () => {}, loading: true });

export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAgency = async (u: User | null) => {
    if (!u) { setAgency(null); return; }
    const { data, error } = await supabase
      .from("tourism_agencies")
      .select("id,name,slug,short_description,logo_url,cover_image_url,email,phone,whatsapp,website,address,city,district,pincode,gstin,years_in_service,social,show_public_profile")
      .eq("owner_user_id", u.id)
      .single();
    if (!error) setAgency(data as Agency);
  };

  const refresh = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    await fetchAgency(user);
  };

  useEffect(() => { (async () => { setLoading(true); await refresh(); setLoading(false); })(); }, []);

  return (
    <AgencyContext.Provider value={{ user, agency, refresh, loading }}>
      {children}
    </AgencyContext.Provider>
  );
}

export const useAgency = () => useContext(AgencyContext);
