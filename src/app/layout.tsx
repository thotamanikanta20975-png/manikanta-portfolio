import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const interTight = localFont({
  src: [{ path: "../fonts/InterTight-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-display", display: "swap",
});
const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif", display: "swap",
});
const mono = localFont({
  src: [{ path: "../fonts/JetBrainsMono-Variable.woff2", weight: "100 800", style: "normal" }],
  variable: "--font-mono", display: "swap",
});

const title = "Thota Naga Manikanta — AI Automation Developer";
const description = "AI Automation Developer from Amalapuram, Andhra Pradesh. WhatsApp AI assistants, n8n workflows and web apps.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: { title, description, images: [{ url: "/og.jpg", width: 1200, height: 630 }], type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f4f2ee", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrument.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
