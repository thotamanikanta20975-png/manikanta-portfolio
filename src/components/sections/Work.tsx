"use client";
import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import { TechLogo } from "@/components/ui/TechLogo";

const css = `
.acc{display:flex;gap:10px;height:min(78svh,600px)}
.panel{position:relative;flex:1;min-width:0;border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;cursor:pointer;transition:flex .9s var(--ease),box-shadow .5s}
.panel.open{flex:8;cursor:default;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px rgba(0,0,0,.08)}
.spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;transition:opacity .4s;width:100%}
.panel.open .spine{opacity:0;pointer-events:none}
.spine .n{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.spine .t{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:17px;letter-spacing:-.02em;white-space:nowrap}
.spine .plus{width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;font-size:18px;transition:transform .5s var(--ease)}
.spine:hover .plus{transform:rotate(90deg)}
.content{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:28px;padding:36px;opacity:0;transition:opacity .5s .15s;pointer-events:none}
.panel.open .content{opacity:1;pointer-events:auto}
.content .k{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.content h3{font-size:clamp(30px,3.2vw,46px);margin:10px 0 14px}
.content p{color:var(--ink-2);font-size:15.5px}
.feat{list-style:none;padding:0;margin:18px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;font-size:14px}
.feat li{display:flex;gap:8px}.feat li::before{content:"✓";font-weight:700}
.tech{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px}
.tech span{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:12px;font-weight:500}
.plinks{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.viz{position:relative;border-radius:20px;background:var(--paper);overflow:hidden;display:grid;place-items:center;clip-path:inset(0 100% 0 0 round 20px);transition:clip-path 1.1s var(--ease) .2s}
.panel.open .viz{clip-path:inset(0 0 0 0 round 20px)}
.viz .lbl{position:absolute;top:12px;left:12px;font-family:var(--font-mono);font-size:10px;color:var(--mute);background:var(--card);padding:4px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);z-index:2}
.viz img{height:92%;width:auto;max-width:92%;object-fit:contain;border-radius:14px;box-shadow:0 20px 40px rgba(0,0,0,.12)}
.mini{width:84%;background:var(--card);border-radius:16px;box-shadow:inset 0 0 0 1px var(--line),0 20px 40px rgba(0,0,0,.08);padding:18px;display:grid;gap:10px;font-size:12px}
.mini .bar{height:8px;border-radius:4px;background:var(--soft)}
.steps-ui{display:grid;gap:8px}
.steps-ui div{display:flex;align-items:center;gap:10px}
.steps-ui i{width:14px;height:14px;border-radius:50%;border:2px solid var(--ink);flex:none}
.steps-ui .done i{background:var(--ink)}
.steps-ui .todo{color:var(--faint)}.steps-ui .todo i{border-color:var(--faint)}
.kbd{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}
.kbd span{aspect-ratio:1;border-radius:5px;box-shadow:inset 0 0 0 1px var(--line);display:grid;place-items:center;font-family:var(--font-mono);font-size:10px}
.kbd span.hot{background:var(--ink);color:#fff;animation:press 1.6s infinite}
@keyframes press{50%{transform:scale(.88)}}
.bubble{padding:8px 12px;border-radius:12px;background:var(--soft);max-width:80%}
.bubble.me{justify-self:end;background:var(--ink);color:#fff}
@media (max-width:900px){
  .acc{flex-direction:column;height:auto}
  .panel{flex:none!important;min-height:76px}
  .spine{position:relative;flex-direction:row;padding:24px 22px}
  .spine .t{writing-mode:horizontal-tb;transform:none}
  .panel.open .spine{display:none}
  .content{position:relative;grid-template-columns:1fr;padding:24px;display:none}
  .panel.open .content{display:grid}
  .viz{min-height:320px}
  .feat{grid-template-columns:1fr}
}
`;

function Viz({ p }: { p: Project }) {
  if (p.viz === "screenshot") return (<>
    <span className="lbl">Real screenshot</span>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/work/hospital-booking.jpg" alt="WhatsApp chat in Telugu confirming an appointment booked by the AI receptionist" width={432} height={570} loading="lazy" />
  </>);
  if (p.viz === "food") return (<>
    <span className="lbl">Illustrative UI</span>
    <div className="mini" aria-hidden="true"><b>Donation · 18 meals</b>
      <div className="steps-ui"><div className="done"><i />Posted by donor</div><div className="done"><i />Matched to an NGO</div><div className="done"><i />Accepted by NGO</div><div><i />Volunteer assigned</div><div className="todo"><i />Picked up</div><div className="todo"><i />Delivered</div></div>
      <div className="bar" style={{ width: "70%" }} /></div>
  </>);
  if (p.viz === "keyboard") return (<>
    <span className="lbl">Illustrative UI</span>
    <div className="mini" aria-hidden="true"><b>Pinch to press</b>
      <div className="kbd">{"QWERTYUIOPASDFGHJKL;ZXCVBNM,./".split("").map((k, i) => <span key={i} className={k === "H" ? "hot" : ""}>{k}</span>)}</div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>Index fingertip → cursor · thumb + index → press</span></div>
  </>);
  if (p.viz === "chat") return (<>
    <span className="lbl">Illustrative UI</span>
    <div className="mini" aria-hidden="true"><div className="bubble me">Can I book a cleaning on Friday?</div><div className="bubble">Sure. Friday has 11:00 AM and 4:30 PM free. Which one works for you?</div><div className="bubble me">4:30 PM</div><div className="bubble">Booked for Friday at 4:30 PM.</div></div>
  </>);
  return (<>
    <span className="lbl">Illustrative UI</span>
    <div className="mini" aria-hidden="true"><b>Today&apos;s appointments</b>
      <div><b style={{ fontSize: 11 }}>Doctor A (3)</b><div className="bar" style={{ marginTop: 6, width: "90%" }} /><div className="bar" style={{ marginTop: 6, width: "75%" }} /><div className="bar" style={{ marginTop: 6, width: "60%" }} /></div>
      <div><b style={{ fontSize: 11 }}>Doctor B (2)</b><div className="bar" style={{ marginTop: 6, width: "80%" }} /><div className="bar" style={{ marginTop: 6, width: "55%" }} /></div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>Sent on Telegram at 8:00 AM</span></div>
  </>);
}

export default function Work() {
  const [open, setOpen] = useState(0);
  const [hoverOpen, setHoverOpen] = useState(false);
  useEffect(() => { setHoverOpen(window.matchMedia("(hover: hover) and (min-width: 901px)").matches); }, []);

  return (
    <section id="work" className="section" aria-labelledby="work-h">
      <style>{css}</style>
      <div className="wrap">
        <span className="tag">03 — Selected work</span>
        <h2 id="work-h" className="h2 rv" style={{ marginBottom: 40 }}>Things I&apos;ve <span className="it">built.</span></h2>
        <div className="acc">
          {PROJECTS.map((p, i) => (
            <article key={p.id} className={`panel${open === i ? " open" : ""}`} onMouseEnter={() => hoverOpen && setOpen(i)} aria-labelledby={`p-${p.id}`}>
              <button className="spine" onClick={() => setOpen(i)} onFocus={() => setOpen(i)} aria-expanded={open === i} aria-controls={`pc-${p.id}`} tabIndex={open === i ? -1 : 0}>
                <span className="n">{p.index}</span><span className="t">{p.spine}</span><span className="plus" aria-hidden="true">+</span>
              </button>
              <div className="content" id={`pc-${p.id}`} aria-hidden={open !== i}>
                <div style={{ minWidth: 0, overflow: "auto" }}>
                  <span className="k">{p.index} — {p.kicker}</span>
                  <h3 id={`p-${p.id}`}>{p.title}</h3>
                  <p>{p.description}</p>
                  <ul className="feat">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <div className="tech">{p.tech.map((t) => <span key={t.label}><TechLogo logo={t.logo} size={12} />{t.label}</span>)}</div>
                  <div className="plinks">
                    {p.demo && <a className="btn btn-ink" href={p.demo} target="_blank" rel="noopener noreferrer" tabIndex={open === i ? 0 : -1}>Live demo ↗</a>}
                    {p.github && <a className={`btn ${p.demo ? "btn-line" : "btn-ink"}`} href={p.github} target="_blank" rel="noopener noreferrer" tabIndex={open === i ? 0 : -1}>View on GitHub ↗</a>}
                  </div>
                </div>
                <div className="viz"><Viz p={p} /></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
