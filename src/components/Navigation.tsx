"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { useScrollTo } from "@/lib/scroll";

const css = `
.progress{position:fixed;top:0;left:0;height:2px;width:100%;background:var(--ink);transform-origin:0 50%;z-index:120}
.nav{position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;z-index:100;padding:18px var(--gutter);display:flex;justify-content:space-between;align-items:center;gap:16px;pointer-events:none}
.nav>*{pointer-events:auto}
.who{display:flex;align-items:center;gap:12px;text-decoration:none}
.mark{width:42px;height:42px;border-radius:50%;border:1.5px solid var(--ink);display:grid;place-items:center;font-family:var(--font-mono);font-size:12px;font-weight:500;background:var(--paper);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.who:hover .mark{transform:rotate(360deg)}
.nav.scrolled .mark{background:var(--ink);color:#fff}
.who .nm{font-weight:600;font-size:15px;letter-spacing:-.02em;transition:opacity .5s var(--ease)}
.nav.scrolled .who .nm{opacity:0}
.links{position:relative;display:none;gap:2px;padding:5px;border-radius:999px;border:1px solid transparent;transition:background .5s var(--ease),border-color .5s var(--ease),box-shadow .5s}
.nav.scrolled .links{background:rgba(255,255,255,.72);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-color:var(--line);box-shadow:0 10px 30px rgba(0,0,0,.06)}
.links a{position:relative;z-index:1;padding:8px 16px;border-radius:999px;font-size:14px;font-weight:500;text-decoration:none;color:var(--ink-2);transition:color .4s var(--ease)}
.links a.on{color:#fff}
.ind{position:absolute;top:5px;bottom:5px;left:0;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
.menu-btn{padding:10px 18px;border-radius:999px;background:var(--ink);color:#fff;font-weight:600;font-size:14px}
@media (min-width:880px){.links{display:flex}.menu-btn.open-btn{display:none}}
.overlay{position:fixed;inset:0;z-index:110;background:var(--paper);clip-path:circle(0% at calc(100% - 50px) 40px);transition:clip-path .9s var(--ease),visibility 0s .9s;visibility:hidden;display:flex;flex-direction:column;justify-content:center;gap:8px;padding:var(--gutter)}
.overlay.open{clip-path:circle(150% at calc(100% - 50px) 40px);visibility:visible;transition:clip-path .9s var(--ease)}
.overlay a{font-size:clamp(40px,11vw,72px);font-weight:700;letter-spacing:-.045em;text-decoration:none;display:flex;gap:16px;align-items:baseline;opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
.overlay.open a{opacity:1;transform:none}
.overlay a small{font-family:var(--font-mono);font-size:13px;color:var(--mute);letter-spacing:0;font-weight:400}
.overlay .close{position:absolute;top:18px;right:var(--gutter)}
`;

export default function Navigation() {
  const progress = useScrollProgress();
  const go = useScrollTo();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState({ x: 0, w: 0, show: false });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
        else if (e.target.id === NAV[0].id && e.boundingClientRect.top > 0) setActive(null);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      const a = active ? linkRefs.current[active] : null;
      setInd(a ? { x: a.offsetLeft, w: a.offsetWidth, show: true } : (s) => ({ ...s, show: false }));
    };
    place(); window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); openRef.current?.focus(); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const nav = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); go(id); };

  return (
    <>
      <style>{css}</style>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <a className="who" href="#top" onClick={nav("top")} aria-label="Back to top">
          <span className="mark" aria-hidden="true">{PROFILE.initials}</span>
          <span className="nm">{PROFILE.name}</span>
        </a>
        <nav className="links" aria-label="Sections">
          <span className="ind" style={{ width: ind.w, transform: `translateX(${ind.x}px)`, opacity: ind.show ? 1 : 0 }} aria-hidden="true" />
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} ref={(el) => { linkRefs.current[n.id] = el; }} className={active === n.id ? "on" : ""} aria-current={active === n.id ? "true" : undefined} onClick={nav(n.id)}>{n.label}</a>
          ))}
        </nav>
        <button ref={openRef} className="menu-btn open-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>Menu</button>
      </header>
      <div id="menu" className={`overlay${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <button ref={closeRef} className="menu-btn close" onClick={() => { setOpen(false); openRef.current?.focus(); }}>Close</button>
        {NAV.map((n, i) => (
          <a key={n.id} href={`#${n.id}`} onClick={nav(n.id)} tabIndex={open ? 0 : -1} style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}>
            <small>{String(i + 1).padStart(2, "0")}</small>{n.label}
          </a>
        ))}
      </div>
    </>
  );
}
