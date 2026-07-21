// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the email CTA.
//
// Gmail compose (web) is the primary path; the anchor keeps `mailtoUrl` as its
// href so the button still works with JS disabled and when the popup is blocked.
// This module is also imported by contact-inject.ts (a Vite plugin running in
// Node) to build the same link for public/drone_nursery.html — so nothing here
// may touch `window` at module scope.
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_TO = "Agunglaksono4308@gmail.com";

export const EMAIL_SUBJECT = "Peluang Kolaborasi — dari Portofolio Agung Laksono";

export const EMAIL_BODY = [
  "Halo Pak Agung,",
  "",
  "Saya [Nama] dari [Perusahaan/Instansi].",
  "Saya menemukan portofolio Anda dan tertarik untuk berdiskusi mengenai:",
  "[ ] Peluang kerja / rekrutmen",
  "[ ] Kolaborasi reklamasi & revegetasi",
  "[ ] Proyek karbon terverifikasi",
  "[ ] Pengembangan sistem monitoring berbasis AI",
  "",
  "Pesan:",
  "",
  "",
  "Terima kasih,",
  "[Nama] — [Kontak]",
].join("\n");

export const gmailComposeUrl =
  `https://mail.google.com/mail/?view=cm&fs=1` +
  `&to=${encodeURIComponent(EMAIL_TO)}` +
  `&su=${encodeURIComponent(EMAIL_SUBJECT)}` +
  `&body=${encodeURIComponent(EMAIL_BODY)}`;

export const mailtoUrl =
  `mailto:${EMAIL_TO}?subject=${encodeURIComponent(EMAIL_SUBJECT)}` +
  `&body=${encodeURIComponent(EMAIL_BODY)}`;

// contact-inject.ts imports this module, so it is type-checked under
// tsconfig.node.json too — which has lib ["ES2023"] and therefore no `window`.
// Reaching the browser globals through a narrow local type keeps the file valid
// in both projects without adding "DOM" to the Node lib, which would let the
// real build scripts reference browser APIs unchecked.
type BrowserWindow = {
  open(url: string, target: string): { opener: unknown } | null;
  location: { href: string };
};

/**
 * Open Gmail compose in a new tab, falling back to the OS mail client.
 *
 * NOTE: `window.open()` returns null whenever "noopener" appears in the features
 * string — that is spec behaviour, not a blocked popup. Passing it there would
 * make the fallback fire on every *successful* click, opening Gmail AND the
 * desktop mail client at once. So the opener is severed manually instead, which
 * keeps `null` meaning exactly one thing: the popup was actually blocked.
 */
export function openEmail(e: { preventDefault: () => void }) {
  e.preventDefault();
  const win = globalThis as unknown as BrowserWindow;
  const w = win.open(gmailComposeUrl, "_blank");
  if (w) w.opener = null;
  else win.location.href = mailtoUrl;
}
