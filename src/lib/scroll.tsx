"use client";
import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

const LenisCtx = createContext<{ current: Lenis | null }>({ current: null });

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    ref.current = lenis;
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); ref.current = null; };
  }, []);
  return <LenisCtx.Provider value={ref}>{children}</LenisCtx.Provider>;
}

export function useLenis() { return useContext(LenisCtx); }

/** scroll to a section id (or "top"), through Lenis when it runs */
export function scrollToTarget(lenis: Lenis | null, id: string) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  const offset = -72;
  if (lenis) { lenis.scrollTo(target as HTMLElement | number, { offset: typeof target === "number" ? 0 : offset }); return; }
  const top = typeof target === "number" ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function useScrollTo() {
  const ref = useLenis();
  return (id: string) => scrollToTarget(ref.current, id);
}
