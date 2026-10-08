"use client";
import { useEffect, useState } from "react";
import { SKILLS, SKILL_GROUPS } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { TechLogo, brandHex, isBrand } from "@/components/ui/TechLogo";

const css = `
.skills-wrap{display:grid;gap:28px;grid-template-columns:1fr}
@media (min-width:1080px){.skills-wrap{grid-template-columns:minmax(0,1fr) 320px}}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.chipf{padding:8px 14px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);font-size:13px;font-weight:500;transition:background .4s var(--ease),color .4s var(--ease)}
.chipf[aria-pressed="true"]{background:var(--ink);color:#fff}
.ptable{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
@media (min-width:720px){.ptable{grid-template-columns:repeat(8,minmax(0,1fr))}}
.el{aspect-ratio:1/1.08;background:var(--card);border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:9px;display:flex;flex-direction:column;justify-content:space-between;text-align:left;min-width:0;opacity:0;transform:translateY(14px);transition:transform .5s var(--ease),box-shadow .5s var(--ease),opacity .6s var(--ease),background .5s,color .5s}
.ptable.in .el{opacity:1;transform:none}
.ptable.in .el.dim{opacity:.22}
.el .num{font-family:var(--font-mono);font-size:10px;color:var(--faint)}
.el .sym{font-size:clamp(20px,2.4vw,30px);font-weight:700;letter-spacing:-.04em;line-height:1}
.el .nm{display:block;font-size:11px;font-weight:500;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.el .fam{display:block;font-family:var(--font-mono);font-size:9px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.el:hover,.el:focus-visible{transform:translateY(-4px)!important;box-shadow:inset 0 0 0 1px var(--ink),0 16px 30px rgba(0,0,0,.08)}
.el.sel{background:var(--ink);color:#fff}.el.sel .num,.el.sel .fam{color:#bdbdbd}
.inspector{position:sticky;top:96px;align-self:start;padding:26px;display:grid;gap:14px;justify-items:start;min-height:420px}
.logo-tile{width:100%;height:190px;border-radius:18px;background:var(--paper);display:grid;place-items:center;position:relative;overflow:hidden;color:var(--ink)}
.logo-tile .glow{position:absolute;width:170px;height:170px;border-radius:50%;filter:blur(42px);opacity:.25}
.logo-tile svg{position:relative;animation:pop .6s var(--ease)}
@keyframes pop{from{transform:scale(.6);opacity:0}}
.inspector h3{font-size:28px}
.fam2{font-family:var(--font-mono);font-size:12px;color:var(--mute)}
.used{font-size:14px;color:var(--ink-2)}
.used b{display:block;font-family:var(--font-mono);font-weight:400;font-size:11px;color:var(--mute);margin-bottom:4px;text-transform:uppercase}
`;

export default function Skills() {
  const [filter, setFilter] = useState<string>("All");
  const [sel, setSel] = useState(7);
  const [cols, setCols] = useState(8);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => {
    const on = () => setCols(window.innerWidth >= 720 ? 8 : 4);
    on(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on);
  }, []);
  const s = SKILLS[sel];
  const fams = ["All", ...SKILL_GROUPS];

  return (
    <section id="skills" className="section" aria-labelledby="skills-h">
      <style>{css}</style>
      <div className="wrap">
        <span className="tag">02 — Skills</span>
        <h2 id="skills-h" className="h2 rv" style={{ marginBottom: 40 }}>The periodic table of my <span className="it">stack.</span></h2>
        <div className="skills-wrap">
          <div>
            <div className="chips" role="group" aria-label="Filter skills by family">
              {fams.map((f) => (
                <button key={f} className="chipf" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div ref={ref} className={`ptable${inView ? " in" : ""}`}>
              {SKILLS.map((k, i) => (
                <button key={k.name} className={`el${filter !== "All" && k.family !== filter ? " dim" : ""}${i === sel ? " sel" : ""}`}
                  style={{ transitionDelay: inView ? `${(Math.floor(i / cols) + (i % cols)) * 40}ms` : "0ms" }}
                  onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)}
                  aria-label={`${k.name}, ${k.family}`}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sym">{k.sym}</span>
                  <span><span className="nm">{k.name}</span><span className="fam">{k.family}</span></span>
                </button>
              ))}
            </div>
          </div>
          <aside className="card inspector" aria-live="polite">
            <div className="logo-tile" key={s.name}>
              {isBrand(s.logo) && <span className="glow" style={{ background: brandHex(s.logo) }} />}
              <TechLogo logo={s.logo} concept={s.concept} size={isBrand(s.logo) ? 120 : 110} title={`${s.name} logo`} />
            </div>
            <span className="fam2">{String(sel + 1).padStart(2, "0")} · {s.family}</span>
            <h3>{s.name}</h3>
            <div className="used"><b>Used in</b>{s.usedIn.length ? s.usedIn.join(", ") : "Learning and practice"}</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
