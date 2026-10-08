"use client";
import { useEffect, useRef, useState } from "react";
import { ID_CARD, PROFILE, QUICK_FACTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { TechLogo } from "@/components/ui/TechLogo";

const css = `
.about-grid{display:grid;gap:56px;grid-template-columns:1fr;align-items:stretch}
@media (min-width:1080px){.about-grid{grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:48px}}
.about-l{display:flex;flex-direction:column;gap:22px;justify-content:center}
.about-l h2{font-size:clamp(40px,4.6vw,64px)}
.about-l p{color:var(--ink-2);font-size:17px}
.row-btns{display:flex;flex-wrap:wrap;gap:10px}
.lanyard{position:relative;display:flex;flex-direction:column;align-items:center;min-height:560px}
@media (min-width:1080px){.lanyard{margin-top:calc(-1 * clamp(96px,14vh,160px))}}
.strap{width:30px;height:clamp(56px,22vh,200px);background:var(--ink);overflow:hidden;position:relative;border-radius:0 0 4px 4px}
.strap span{position:absolute;left:50%;top:0;writing-mode:vertical-rl;transform:translateX(-50%);font-family:var(--font-mono);font-size:10px;color:#cfcfcf;white-space:nowrap;letter-spacing:.12em;animation:strap 14s linear infinite}
@keyframes strap{to{transform:translate(-50%,-50%)}}
.clip{width:46px;height:30px;border-radius:8px;background:#b8b8b8;border:1px solid #8a8a8a;position:relative;margin-top:-4px;box-shadow:inset 0 2px 0 rgba(255,255,255,.6),inset 0 -6px 8px rgba(0,0,0,.12)}
.clip::after{content:"";position:absolute;left:50%;bottom:-10px;width:14px;height:16px;transform:translateX(-50%);border:3px solid #8f8f8f;border-top:0;border-radius:0 0 8px 8px}
.swing{transform-origin:50% -230px;will-change:transform;margin-top:6px}
.idcard{width:300px;height:404px;perspective:1200px;cursor:pointer;display:block}
.inner{display:block;position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .9s var(--ease)}
.idcard.flip .inner{transform:rotateY(180deg)}
@media (hover:hover){.idcard:hover .inner{transform:rotateY(180deg)}}
.face{position:absolute;inset:0;border-radius:22px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line),0 30px 60px rgba(0,0,0,.12);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column;text-align:left}
.back{transform:rotateY(180deg);padding:26px;gap:14px}
.band{background:var(--ink);color:#fff;font-family:var(--font-mono);font-size:11px;letter-spacing:.2em;padding:12px 18px;display:flex;justify-content:space-between;align-items:center}
.band i{width:22px;height:6px;border-radius:3px;background:var(--paper)}
.photo{display:block;margin:18px auto 0;width:128px;height:156px;border-radius:16px;padding:3px;background:linear-gradient(145deg,#d9d6d0,#8d8b86);box-shadow:0 0 0 6px rgba(13,13,13,.04),0 10px 30px rgba(13,13,13,.10)}
.photo img{width:100%;height:100%;object-fit:cover;object-position:50% 12%;border-radius:13px;display:block;transition:transform .8s var(--ease);background:#efefed}
.idcard:hover .photo img{transform:scale(1.06)}
.idname{display:block;text-align:center;margin-top:14px;font-weight:700;font-size:16px;letter-spacing:-.02em}
.idrole{display:block;text-align:center;color:var(--mute);font-size:13px}
.idrows{display:grid;margin:12px 22px 0;gap:4px;font-size:12px}
.idrows>span{display:flex;justify-content:space-between;gap:12px;border-top:1px dashed var(--line);padding-top:4px}
.idrows>span>span:first-child{font-family:var(--font-mono);color:var(--mute);font-size:11px}
.idfoot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;padding:0 22px 18px}
.barcode{height:28px;width:140px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 5px,transparent 5px 8px,var(--ink) 8px 11px,transparent 11px 12px)}
.holo{width:38px;height:38px;border-radius:50%;background:conic-gradient(#e7e7e7,#b9b9b9,#f5f5f5,#9c9c9c,#e7e7e7);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
.back h3{font-size:22px}
.back ul{margin:0;padding:0;list-style:none;display:grid;gap:10px;font-size:13.5px;color:var(--ink-2)}
.back li{display:flex;gap:10px}.back li::before{content:"—";color:var(--faint)}
.sig{margin-top:auto;border-top:1px solid var(--ink);padding-top:8px;font-family:var(--font-serif);font-style:italic;font-size:22px}
.found{font-family:var(--font-mono);font-size:10.5px;color:var(--mute);overflow-wrap:anywhere}
.hint{font-family:var(--font-mono);font-size:11px;color:var(--faint);margin-top:14px;text-align:center}
.facts{display:flex;flex-direction:column;justify-content:center}
.facts h3{font-family:var(--font-mono);font-weight:400;font-size:12px;letter-spacing:.04em;color:var(--mute);text-transform:uppercase;margin-bottom:12px}
.fact{display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
.fact:last-child{border-bottom:1px solid var(--line)}
.fact dt{font-family:var(--font-mono);font-size:12px;color:var(--mute);padding-top:2px}
.fact dd{margin:0;font-weight:500;overflow-wrap:anywhere}
.quote{margin-top:24px;font-family:var(--font-serif);font-style:italic;font-size:24px;line-height:1.25;color:var(--ink-2)}
`;

export default function About() {
  const swing = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const vel = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ang = 0, lastX: number | null = null, lastT = 0, raf = 0;
    const t0 = performance.now();
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && swing.current) {
        const dx = e.clientX - lastX, dt = Math.max(8, now - lastT);
        const r = swing.current.getBoundingClientRect();
        if (Math.abs(e.clientY - (r.top + r.height / 2)) < 420) vel.current += Math.max(-2, Math.min(2, dx / dt)) * 0.9;
      }
      lastX = e.clientX; lastT = now;
    };
    const loop = (now: number) => {
      const idle = Math.sin((now - t0) / 1400) * 1.2;
      vel.current += -ang * 0.035; vel.current *= 0.92; ang = Math.max(-22, Math.min(22, ang + vel.current));
      if (swing.current) swing.current.style.transform = `rotate(${(ang + idle).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  const doFlip = () => { setFlip((f) => !f); vel.current += 3; };

  return (
    <section id="about" className="section" aria-labelledby="about-h">
      <style>{css}</style>
      <div className="wrap">
        <span className="tag">01 — About</span>
        <div className="about-grid">
          <div className="about-l">
            <h2 id="about-h" className="rv">Hi, I&apos;m <span className="it">{PROFILE.firstName}.</span></h2>
            <p className="rv" style={{ ["--i" as string]: 1 }}>{PROFILE.summary}</p>
            <p className="rv" style={{ ["--i" as string]: 2 }}>{PROFILE.extraLine}</p>
            <div className="row-btns rv" style={{ ["--i" as string]: 3 }}>
              <a className="btn btn-ink" href={PROFILE.github} target="_blank" rel="noopener noreferrer"><TechLogo logo="github" mono />GitHub</a>
              <a className="btn btn-line" href={PROFILE.instagram} target="_blank" rel="noopener noreferrer"><TechLogo logo="instagram" mono />Instagram</a>
            </div>
          </div>

          <div className="lanyard">
            <div className="strap" aria-hidden="true"><span>{`${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `.repeat(3)}</span></div>
            <div className="clip" aria-hidden="true" />
            <div className="swing" ref={swing}>
              <div className={`idcard${flip ? " flip" : ""}`} role="button" tabIndex={0} aria-pressed={flip}
                aria-label={`Developer ID card of ${PROFILE.name}. Press Enter to flip.`}
                onClick={doFlip} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doFlip(); } }}>
                <span className="inner">
                  <span className="face front">
                    <span className="band">DEVELOPER ID<i aria-hidden="true" /></span>
                    <span className="photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={480} height={600} />
                    </span>
                    <span className="idname">{PROFILE.name}</span>
                    <span className="idrole">{PROFILE.role}</span>
                    <span className="idrows">
                      {ID_CARD.rows.map(([k, v]) => <span key={k}><span>{k}</span><span>{v}</span></span>)}
                    </span>
                    <span className="idfoot"><span className="barcode" aria-hidden="true" /><span className="holo" aria-hidden="true" /></span>
                  </span>
                  <span className="face back">
                    <h3>What I am</h3>
                    <ul>{ID_CARD.back.map((l) => <li key={l}>{l}</li>)}</ul>
                    <span className="sig">{PROFILE.firstName}</span>
                    <span className="found">If found, say hello · {PROFILE.email}</span>
                  </span>
                </span>
              </div>
            </div>
            <p className="hint">Hover, tap or press Enter to flip</p>
          </div>

          <div className="facts">
            <h3>Quick facts</h3>
            <dl style={{ margin: 0 }}>
              {QUICK_FACTS.map(([k, v], i) => (
                <div className="fact rv" key={k} style={{ ["--i" as string]: i }}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <p className="quote rv">Automation that takes repetitive work off people&apos;s hands.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
