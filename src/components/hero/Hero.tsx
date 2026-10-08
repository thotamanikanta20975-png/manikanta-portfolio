"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { useScrollTo } from "@/lib/scroll";

// first-play start point inside the loop's cross-fade, so the first visit hears "Hi, I'm Manikanta"
// (written by scripts/build-hero-assets.py into public/hero/hero.json)
const FIRST_PLAY_START = 9.15;

const css = `
.hero{position:relative;padding-top:96px;padding-bottom:32px;overflow:hidden}
.stage{position:relative;display:grid;justify-items:center}
.ghost{position:absolute;top:10%;left:50%;transform:translateX(-50%);font-size:clamp(70px,15.5vw,230px);font-weight:800;letter-spacing:-.06em;line-height:.85;color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13);white-space:nowrap;user-select:none;pointer-events:none}
.figure{position:relative;height:min(96svh,1040px);max-height:calc(100svh - 120px);aspect-ratio:768/960;max-width:92vw}
@media (max-width:720px){.figure{height:62svh}.copy{margin-top:12px}.loc{font-size:11px;text-align:left}}
.figure video,.figure img{width:100%;height:100%;object-fit:contain;display:block;mix-blend-mode:multiply;
  -webkit-mask-image:linear-gradient(to bottom,#000 78%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);
  -webkit-mask-composite:source-in;mask-image:linear-gradient(to bottom,#000 78%,transparent),linear-gradient(to right,transparent,#000 6%,#000 94%,transparent);mask-composite:intersect}
.sound{position:absolute;right:4%;bottom:18%;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;z-index:2;transition:transform .5s var(--ease)}
.sound:hover{transform:scale(1.06)}
.sound svg{width:16px;height:16px}
.sound.ping::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:1.5px solid var(--ink);animation:ping 1.8s var(--ease) infinite}
@keyframes ping{0%{transform:scale(.85);opacity:.6}100%{transform:scale(1.5);opacity:0}}
.copy{display:grid;gap:22px;justify-items:center;text-align:center;margin-top:-56px;position:relative}
.hero h1{font-size:clamp(44px,7.5vw,112px)}
.lede{font-size:18px;color:var(--ink-2);max-width:560px}
.ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.loc{font-family:var(--font-mono);font-size:12px;color:var(--mute);display:inline-flex;gap:10px;align-items:center}
.loc i{width:7px;height:7px;border-radius:50%;background:var(--ink);display:inline-block;animation:blink 2.4s infinite}
@keyframes blink{50%{opacity:.25}}
`;

export default function Hero() {
  const vid = useRef<HTMLVideoElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const hero = useRef<HTMLElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);
  const userMuted = useRef(false);
  const go = useScrollTo();

  useEffect(() => {
    const v = vid.current; if (!v) return;
    let started = false;
    const begin = async () => {
      if (!started) { try { v.currentTime = FIRST_PLAY_START; } catch {} started = true; }
      v.muted = false;
      try { await v.play(); setSoundOn(true); setBlocked(false); }
      catch { v.muted = true; setSoundOn(false); setBlocked(true); try { await v.play(); } catch {} }
    };
    if (v.readyState >= 1) begin(); else v.addEventListener("loadedmetadata", begin, { once: true });

    const unlock = (ev: Event) => {
      if (btn.current && ev.target instanceof Node && btn.current.contains(ev.target)) return;
      if (userMuted.current || !v.muted) return;
      v.muted = false; setSoundOn(true); setBlocked(false);
      if (visible.current) v.play().catch(() => {});
      ["pointerdown", "keydown", "touchend"].forEach((ev) => window.removeEventListener(ev, unlock));
    };
    ["pointerdown", "keydown", "touchend"].forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));

    const io = new IntersectionObserver(([e]) => {
      visible.current = e.intersectionRatio >= 0.35;
      if (visible.current) v.play().catch(() => {}); else v.pause();
    }, { threshold: [0, 0.35, 0.6, 1] });
    if (hero.current) io.observe(hero.current);
    return () => { io.disconnect(); ["pointerdown", "keydown", "touchend"].forEach((ev) => window.removeEventListener(ev, unlock)); };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = vid.current; if (!v) return;
    if (v.muted) { v.muted = false; userMuted.current = false; setSoundOn(true); setBlocked(false); v.play().catch(() => {}); }
    else { v.muted = true; userMuted.current = true; setSoundOn(false); }
  };

  return (
    <section ref={hero} className="hero" id="top" aria-label="Introduction">
      <style>{css}</style>
      <div className="stage">
        <div className="ghost" aria-hidden="true">{PROFILE.firstName.toUpperCase()}</div>
        <div className="figure">
          <video ref={vid} muted loop playsInline preload="auto" poster="/portrait-poster.webp" aria-label={`${PROFILE.name} introducing himself: Hi, I'm Manikanta. I'm an AI automation developer. I build WhatsApp AI assistants, smart n8n workflows, and automations that save businesses hours every day.`}>
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
          <button ref={btn} className={`sound${blocked ? " ping" : ""}`} onClick={toggle} aria-label={soundOn ? "Mute the introduction" : "Play the introduction with sound"} aria-pressed={soundOn}>
            {soundOn
              ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
              : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11a.6.6 0 0 0 .9.5l9-5.5a.6.6 0 0 0 0-1l-9-5.5a.6.6 0 0 0-.9.5Z" /></svg>}
          </button>
        </div>
      </div>
      <div className="wrap copy">
        <span className="loc"><i aria-hidden="true" />Amalapuram, Andhra Pradesh · Available for projects</span>
        <h1>
          <span className="rv-mask"><span>AI Automation</span></span>
          <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span><span className="it">Developer.</span></span></span>
        </h1>
        <p className="lede rv" style={{ ["--i" as string]: 2 }}>I build WhatsApp AI assistants and n8n workflows that take repetitive work off people&apos;s hands.</p>
        <div className="ctas rv" style={{ ["--i" as string]: 3 }}>
          <a className="btn btn-ink" href="#work" onClick={(e) => { e.preventDefault(); go("work"); }}>Explore work
            <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66 149.66l-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z" /></svg>
          </a>
          <a className="btn btn-line" href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Let&apos;s talk</a>
        </div>
      </div>
    </section>
  );
}
