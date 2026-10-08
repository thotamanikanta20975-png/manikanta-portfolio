"use client";
import { useState } from "react";
import { PROFILE } from "@/lib/data";
import CopyChip from "@/components/ui/CopyChip";
import { useScrollTo } from "@/lib/scroll";

const css = `
.big{font-size:clamp(46px,9.5vw,150px);line-height:.95}
.big .w{display:inline-block;white-space:nowrap}
.big .ch{display:inline-block;transition:transform .35s var(--ease)}
.big .ch.hop{transform:translateY(-.14em)}
.contact-top{display:flex;gap:24px;align-items:flex-end;flex-wrap:wrap}
.mail{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:44px}
.mail a{font-size:clamp(20px,3.4vw,40px);font-weight:600;letter-spacing:-.03em;text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:2px;overflow-wrap:anywhere}
.clinks{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.badge{position:relative;width:132px;height:132px;margin-left:auto;overflow:hidden;border-radius:50%;flex:none}
.badge svg{width:100%;height:100%;animation:spin 18s linear infinite}
.badge b{position:absolute;inset:0;display:grid;place-items:center;font-size:26px}
@keyframes spin{to{transform:rotate(360deg)}}
.foot{border-top:1px solid var(--line);margin-top:96px;padding-block:28px 40px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:13px;color:var(--mute)}
.foot a{text-decoration:none}.foot a:hover{color:var(--ink)}
`;

function HopText({ text, italic }: { text: string; italic?: boolean }) {
  const [hop, setHop] = useState<string | null>(null);
  const words = text.split(" ");
  return (
    <span className={italic ? "it" : undefined}>
      {words.map((w, wi) => (
        <span key={wi}>
          <span className="w">
            {[...w].map((c, ci) => {
              const k = `${wi}-${ci}`;
              return <span key={k} className={`ch${hop === k ? " hop" : ""}`} onPointerEnter={() => { setHop(k); setTimeout(() => setHop((h) => (h === k ? null : h)), 320); }}>{c}</span>;
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const go = useScrollTo();
  return (
    <section id="contact" className="section" aria-labelledby="contact-h">
      <style>{css}</style>
      <div className="wrap">
        <span className="tag">05 — Contact</span>
        <div className="contact-top">
          <h2 id="contact-h" className="big" aria-label="Let's build something together.">
            <span aria-hidden="true"><HopText text="Let's build" /><br /><HopText text="something" /> <HopText text="together." italic /></span>
          </h2>
          <div className="badge" aria-hidden="true">
            <svg viewBox="0 0 120 120"><defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text fontFamily="var(--font-mono), monospace" fontSize="10.5" letterSpacing="3.2" fill="#0d0d0d"><textPath href="#circ">SAY HELLO · SAY HELLO · SAY HELLO · </textPath></text></svg>
            <b>↗</b>
          </div>
        </div>
        <div className="mail">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <CopyChip value={PROFILE.email} />
        </div>
        <div className="clinks">
          <a className="btn btn-line" href={PROFILE.phoneHref}>{PROFILE.phone}</a>
          <a className="btn btn-line" href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
          <a className="btn btn-line" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="btn btn-line" href={PROFILE.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
        </div>
        <footer className="foot">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>Built with Next.js</span>
          <a href="#top" onClick={(e) => { e.preventDefault(); go("top"); }}>Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
