// src/components/contactReveal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Phone, MessageCircle, Copy, Mail, Globe } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  whatsapp?: string | null;  // defaults to phone if not passed
  storageKey?: string;
  message?: string;
  className?: string;
  onReveal?: () => void | Promise<void>;
};

export default function ContactReveal({
  phone,
  email,
  website,
  whatsapp,
  storageKey,
  message = "Want direct owner contact? No brokers, save money!",
  className,
  onReveal,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  const key = useMemo(() => {
    if (storageKey) return storageKey;
    const id = (phone || email || website || "").toString().trim();
    return id ? `contact-revealed-${id}` : null;
  }, [phone, email, website, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !key) return;
    if (localStorage.getItem(key) === "true") setRevealed(true);
  }, [key]);

  const handleReveal = async () => {
    setRevealed(true);
    if (typeof window !== "undefined" && key) {
      localStorage.setItem(key, "true");
    }
    try {
      await onReveal?.();
    } catch {}
  };

  // formatters
  const whatsappNumber = (whatsapp || phone || "").replace(/\D/g, "");
  const prettyUrl = (u?: string | null) =>
    (u || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

  const copyPhone = () => {
    const val = (phone || "").toString().trim();
    if (!val) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(val).then(() => toast.success("Number copied"));
    }
  };

  return (
    <div
      className={cn(
        // smaller, minimal/glassy container
        "rounded-xl border border-gray-200/80 bg-white/75 shadow-sm p-3",
        "backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      {!revealed ? (
        <div className="space-y-2 text-center">
          <h3 className="text-sm font-semibold">Contact Owner</h3>
          {!!message && <p className="text-xs text-gray-600">{message}</p>}
          <Button
            onClick={handleReveal}
            className="w-full h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
          >
            Reveal Contact
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {/* Phone */}
          {phone ? (
            <div className="relative group">
              <a
                href={`tel:${phone}`}
                className="
                  flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80
                  hover:bg-gray-50 transition p-2.5
                "
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500">Call</div>
                  <div className="text-sm font-medium text-gray-900 truncate">{phone}</div>
                </div>
              </a>
              <button
                onClick={copyPhone}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Copy number"
                title="Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          ) : null}

          {/* WhatsApp */}
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60
                hover:bg-emerald-50 transition p-2.5
              "
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-emerald-700">WhatsApp</div>
                <div className="text-sm font-medium text-emerald-800 truncate">
                  {phone || `+${whatsappNumber}`}
                </div>
              </div>
            </a>
          ) : null}

          {/* Email */}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="
                flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80
                hover:bg-gray-50 transition p-2.5
              "
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Email</div>
                <div className="text-sm font-medium text-gray-900 truncate">{email}</div>
              </div>
            </a>
          ) : null}

          {/* Website */}
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80
                hover:bg-gray-50 transition p-2.5
              "
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center">
                <Globe size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">Website</div>
                <div className="text-sm font-medium text-gray-900 truncate">{prettyUrl(website)}</div>
              </div>
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
}
