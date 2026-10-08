"use client";
import { useState } from "react";

export default function CopyChip({ value, label = "Copy" }: { value: string; label?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setState("ok"); }
    catch { setState("fail"); }
    setTimeout(() => setState("idle"), 1800);
  };
  return (
    <>
      <button type="button" className="copy-chip" onClick={copy} aria-label={`${label}: ${value}`}>
        {state === "ok" ? "Copied ✓" : state === "fail" ? "Select to copy" : label}
      </button>
      <span aria-live="polite" className="sr-only">{state === "ok" ? "Copied to clipboard" : ""}</span>
      <style>{`.copy-chip{padding:9px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);background:var(--card);font-family:var(--font-mono);font-size:12px;transition:background .4s var(--ease),color .4s var(--ease)}.copy-chip:hover{background:var(--ink);color:#fff}`}</style>
    </>
  );
}
