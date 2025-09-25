"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  MapPinned,      // Destinations
  BookOpen,       // Itineraries
  Coffee,         // Cafes
  BedDouble,      // Homestays
  UserPlus,       // Register
  Mail            // Contact
} from "lucide-react";

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Item = { href: string; label: string; Icon: React.ComponentType<{ size?: number }> };

const CORE: Record<string, Item> = {
  home:         { href: "/",                   label: "Home",        Icon: HomeIcon },
  destinations: { href: "/destinations",       label: "Destinations",   Icon: MapPinned },
  itineraries:  { href: "/itineraries",        label: "Itineraries", Icon: BookOpen },
  cafes:        { href: "/cafesRestaurants",   label: "Cafes",       Icon: Coffee },
  homestays:    { href: "/homestays",          label: "Homestays",   Icon: BedDouble },
  register:     { href: "/register",           label: "Register",    Icon: UserPlus },
  contact:      { href: "/contact",            label: "Contact",     Icon: Mail },
};

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Homepage: Register • Home • Contact
  const HOME_ITEMS: Item[] = [CORE.register, CORE.home, CORE.contact];

  // Other pages (fixed order): Destinations • Itineraries • Home • Cafes • Homestays
  const OTHER_ITEMS: Item[] = [
    CORE.destinations,
    CORE.itineraries,
    CORE.home,
    CORE.cafes,
    CORE.homestays,
  ];

  const items = isHomePage ? HOME_ITEMS : OTHER_ITEMS;

  const colCount = items.length;
  const gridStyle: React.CSSProperties = { gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` };

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t z-40"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="px-6 py-2 grid text-[9px]" style={gridStyle}>
        {items.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cx(
              "relative flex flex-col items-center transition-colors",
              isActive(href) ? "text-emerald-700 font-medium" : "text-gray-600"
            )}
          >
            <Icon size={20} />
            {label}
            {isActive(href) && (
              <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-emerald-600" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
