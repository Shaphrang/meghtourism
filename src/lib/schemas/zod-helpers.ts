import { z } from "zod";

// Phone: loose but useful (international or Indian)
export const PhoneZ = z.string().regex(
  /^(\+?\d{1,3}[- ]?)?\d{7,14}$/,
  "Enter a valid phone number"
);

// ISO datetime string (keep your interface 'string')
export const ISODateZ = z.string().refine(
  (s) => !s || !Number.isNaN(Date.parse(s)),
  "Invalid date format"
);

// Public URL (keep simple; you can tighten later)
export const PublicUrlZ = z.string().url("Enter a valid URL");

// Coerce number from string like "7"
export const IntCoerceZ = z.coerce.number().int().min(1, "Must be ≥ 1");
export const NonNegNumberCoerceZ = z.coerce.number().min(0, "Must be ≥ 0");
