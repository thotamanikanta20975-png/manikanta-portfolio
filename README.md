# Thota Naga Manikanta — Portfolio

A light, single-page "talking video" portfolio built with **Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis**. White, black and gray only; real brand logos keep their colours.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type check + lint)
npm start        # serve the production build
```

### Deploy free on Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo → **Deploy** (no settings needed).
3. Optional: set `NEXT_PUBLIC_SITE_URL` to your final URL so social previews use the right address.

## Sections

| # | Section | Component | Data in `src/lib/data.ts` |
|---|---------|-----------|---------------------------|
| – | Hero (talking video, ghost name, CTAs) | `components/hero/Hero.tsx` | `PROFILE` |
| 01 | About — hanging lanyard ID card + quick facts | `components/sections/About.tsx` | `PROFILE`, `ID_CARD`, `QUICK_FACTS` |
| 02 | Skills — periodic table + inspector | `components/sections/Skills.tsx` | `SKILLS`, `SKILL_GROUPS` |
| 03 | Work — expanding accordion gallery | `components/sections/Work.tsx` | `PROJECTS` |
| 04 | Experience — scroll-drawn timeline | `components/sections/Experience.tsx` | `EXPERIENCE`, `EDUCATION` |
| 05 | Contact + footer | `components/sections/Contact.tsx` | `PROFILE` |

**Not included yet (no data provided):** Certifications, Achievements, Education and a Résumé download.
To add them, fill `CERTIFICATIONS`, `ACHIEVEMENTS` or `EDUCATION` in `src/lib/data.ts` and ask for the matching section component.
All text comes from details supplied by Manikanta and from his public GitHub repos; nothing is invented.

## Rebuild the hero video

The intro video lives in `scripts/intro.mp4`. To regenerate the looping hero clip:

```bash
pip install numpy pillow   # ffmpeg must be installed
npm run hero               # = python3 scripts/build-hero-assets.py scripts/intro.mp4 --crop 576:720:352:0 --photo scripts/photo.png
```

What the script does:

1. Crops to the person (`--crop W:H:X:Y`, or auto-detects) and scales to 768 px wide.
2. Whitens the studio backdrop (`colorlevels`, tune with `--levels`) so `mix-blend-mode: multiply` blends it into the page.
3. Makes a seamless loop: the last 0.5 s of picture cross-fades into the first 0.5 s (ffmpeg `xfade`); audio is cross-faded sample-accurately in numpy, switching in the silent gap between words. Nothing is stretched, so lips stay in sync.
4. Writes `public/hero/hero.webm` (VP9 + Opus) and `public/hero/hero.mp4` (H.264 + AAC), plus `hero.json` with the loop length and the first-play start point.
5. Writes `public/portrait-bust.webp` (ID card photo), `public/portrait-poster.webp` and `public/og.jpg`.

If you replace the video, copy `firstPlayStart` from `public/hero/hero.json` into `FIRST_PLAY_START` in `Hero.tsx`.

### Video behaviour

- Tries to play with sound; if the browser blocks it, plays muted and unlocks sound on the first tap, click or key press.
- Pauses when less than 35 % of the hero is visible and resumes when you scroll back.
- One round ink button toggles sound (▶ off / ❚❚ on), with a soft ping ring while autoplay is blocked.

## Project structure

```
src/app/            layout.tsx (metadata, OG, fonts, themeColor #f4f2ee), page.tsx, globals.css
src/components/     App.tsx, Navigation.tsx, hero/Hero.tsx, sections/*.tsx, ui/*.tsx
src/lib/            data.ts, hooks.ts, scroll.tsx (Lenis + scrollToTarget), logos.ts
src/fonts/          Inter Tight, Instrument Serif, JetBrains Mono (woff2, self-hosted)
public/hero/        hero.mp4, hero.webm
public/logos/       brand SVGs + licence
scripts/            build-hero-assets.py, intro.mp4, photo.png
```

## Credits and licences

- **Brand logos:** [Simple Icons](https://simpleicons.org) — CC0 1.0 (see `public/logos/LICENSE.md` and `DISCLAIMER.md`). Logos are trademarks of their owners and are used only to name the technologies.
- **Fonts:** Inter Tight, Instrument Serif and JetBrains Mono — SIL Open Font License 1.1 (see `src/fonts/LICENSE-*.txt`).
