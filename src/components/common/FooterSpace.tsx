// src/components/nav/FooterSpacer.tsx
export default function FooterSpacer() {
  // tweak 64px if your footer is taller/shorter
  return <div style={{ height: "calc(64px + env(safe-area-inset-bottom))" }} />;
}
