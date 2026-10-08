import { BRAND } from "@/lib/logos";

const CONCEPT: Record<string, React.ReactNode> = {
  css: (<><path d="M7 4h10l-1 14-4 2-4-2z" /><path d="M9 8h6l-.4 6-2.6 1-2.6-1" /></>),
  webhooks: (<><circle cx="12" cy="6" r="2.5" /><circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" /><path d="M11 8.5 7.3 14.8M13 8.5l3.7 6.3M8.5 17h7" /></>),
  api: (<path d="M8 6 3 12l5 6M16 6l5 6-5 6M14 4l-4 16" />),
  agent: (<><rect x="5" y="7" width="14" height="11" rx="3" /><circle cx="9.5" cy="12.5" r="1" /><circle cx="14.5" cy="12.5" r="1" /><path d="M12 7V4M10 4h4" /></>),
  prompt: (<><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>),
};

export function isBrand(key?: string): key is keyof typeof BRAND {
  return !!key && key in BRAND;
}

export function TechLogo({ logo, concept, size = 16, title, mono }: { logo?: string; concept?: string; size?: number; title?: string; mono?: boolean }) {
  if (isBrand(logo)) {
    const b = BRAND[logo];
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
        <path fill={mono ? "currentColor" : `#${b.hex}`} d={b.path} />
      </svg>
    );
  }
  const c = concept && CONCEPT[concept];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} aria-label={title}>
      {c || <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

export function brandHex(logo?: string) {
  return isBrand(logo) ? `#${BRAND[logo].hex}` : "#0d0d0d";
}
