"use client";
import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollTo } from "@/lib/scroll";

const css = `
.tl{position:relative;max-width:900px;padding-left:44px}
.tl .spine2{position:absolute;left:12px;top:6px;bottom:6px;width:2px;background:var(--soft)}
.tl .spine2 i{position:absolute;inset:0;background:var(--ink);transform-origin:top}
.stop{position:relative;padding-bottom:40px}
.stop::before{content:"";position:absolute;left:-39px;top:6px;width:16px;height:16px;border-radius:50%;background:var(--paper);border:2px solid var(--faint);transition:background .5s var(--ease),border-color .5s var(--ease)}
.stop.lit::before{background:var(--ink);border-color:var(--ink)}
.stop{opacity:.45;transition:opacity .6s var(--ease)}.stop.lit{opacity:1}
.stop .yr{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.stop h3{font-size:clamp(24px,2.6vw,34px);margin:6px 0}
.stop .pl{font-weight:500}
.stop p{color:var(--ink-2);margin-top:8px;max-width:640px}
.nextcard{border:1.5px dashed var(--faint);border-radius:24px;padding:28px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px}
.nextcard h3{font-size:clamp(26px,3vw,40px)}
`;

export default function Experience() {
  const tl = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [lit, setLit] = useState<boolean[]>([]);
  const go = useScrollTo();
  const stops = [...EDUCATION, ...EXPERIENCE];

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = tl.current; if (!el) return;
        const r = el.getBoundingClientRect(), line = window.innerHeight * 0.6;
        setP(Math.min(1, Math.max(0, (line - r.top) / r.height)));
        setLit(Array.from(el.querySelectorAll(".stop")).map((s) => s.getBoundingClientRect().top < line));
      });
    };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="experience" className="section" aria-labelledby="exp-h">
      <style>{css}</style>
      <div className="wrap">
        <span className="tag">04 — Experience</span>
        <h2 id="exp-h" className="h2 rv" style={{ marginBottom: 56 }}>What I&apos;m <span className="it">doing.</span></h2>
        <div className="tl" ref={tl}>
          <div className="spine2" aria-hidden="true"><i style={{ transform: `scaleY(${p})` }} /></div>
          {stops.map((s, i) => (
            <div key={s.title} className={`stop${lit[i] ? " lit" : ""}`}>
              <span className="yr">{s.year}</span>
              <h3>{s.title}</h3>
              <div className="pl">{s.place}</div>
              <p>{s.detail}</p>
            </div>
          ))}
          <div className="nextcard rv">
            <h3>Next — <span className="it">your team?</span></h3>
            <a className="btn btn-ink" href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>Let&apos;s talk</a>
          </div>
        </div>
      </div>
    </section>
  );
}
