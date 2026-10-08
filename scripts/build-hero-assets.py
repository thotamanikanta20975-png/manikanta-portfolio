#!/usr/bin/env python3
"""Turn the talking intro video into a seamless looping hero clip.

Usage:
    python scripts/build-hero-assets.py scripts/intro.mp4 [--photo scripts/photo.png]

Steps
 1. Crop tightly around the person (auto-detected, or pass --crop W:H:X:Y) and scale to 768 px wide.
 2. Whiten the off-white studio backdrop so it blends into the page with mix-blend-mode: multiply.
 3. Seamless loop: the last 0.5 s of the picture cross-fades into the first 0.5 s (ffmpeg xfade).
    Audio is cross-faded sample-accurately in numpy inside the same window, switching
    in the silent gap between the last word and the first word, so there is no click
    and no clipped syllable. The clip is never stretched or retimed, so lips stay in sync.
 4. Export public/hero/hero.mp4 (H.264, CRF 24, AAC 96k, faststart) and hero.webm (VP9 CRF 36, Opus 80k).
 5. Export public/portrait-bust.webp (480x600) and public/og.jpg (1200x630).
"""
import argparse, json, os, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
XF = 0.5          # cross-fade length in seconds
SR = 48000

def run(*a): subprocess.run(a, check=True)
def probe(src):
    o = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height,codec_type:format=duration', '-of', 'json', src]))
    v = [s for s in o['streams'] if s['codec_type'] == 'video'][0]
    return v['width'], v['height'], float(o['format']['duration'])

def detect_crop(src, w, h):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', 'fps=4,scale=320:-1', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    sh = int(round(h * 320 / w)); fr = np.frombuffer(raw, np.uint8).reshape(-1, sh, 320).astype(int)
    bg = np.median(fr[:, :, :12]); dark = (fr < bg - 40).any(0)
    cols = np.where(dark.sum(0) > sh * 0.04)[0]
    cx = int((cols.min() + cols.max()) / 2 * w / 320)
    ch = h; cw = int(round(ch * 0.8 / 2) * 2)          # 768:960 aspect
    x = max(0, min(w - cw, cx - cw // 2))
    return cw, ch, x, 0

def speech_gap(audio, start, end):
    """index (relative to start) of the quietest 10 ms inside [start, end)"""
    seg = audio[start:end]; win = int(SR * 0.01)
    e = [np.abs(seg[i:i + win]).mean() for i in range(0, len(seg) - win, win)]
    return int(np.argmin(e) * win)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--crop'); ap.add_argument('--photo')
    ap.add_argument('--levels', type=float, default=0.905, help='input white point, lower = whiter backdrop')
    a = ap.parse_args()
    w, h, dur = probe(a.src)
    cw, ch, cx, cy = map(int, a.crop.split(':')) if a.crop else detect_crop(a.src, w, h)
    print(f'crop {cw}:{ch}:{cx}:{cy}')
    L = a.levels
    vf = f'crop={cw}:{ch}:{cx}:{cy},scale=768:-2:flags=lanczos,colorlevels=rimax={L}:gimax={L}:bimax={L-0.015},format=yuv420p'
    T = min(dur, 10.0)
    tmp = tempfile.mkdtemp()
    # --- video: body [XF, T-XF] then xfade(tail [T-XF, T] -> head [0, XF]); loop wraps back to XF seamlessly
    body, tail, head = (os.path.join(tmp, n) for n in ('body.mp4', 'tail.mp4', 'head.mp4'))
    enc = ['-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast']
    run('ffmpeg', '-v', 'error', '-y', '-i', a.src, '-vf', f'trim={XF}:{T-XF},setpts=PTS-STARTPTS,{vf}', *enc, body)
    run('ffmpeg', '-v', 'error', '-y', '-i', a.src, '-vf', f'trim={T-XF}:{T},setpts=PTS-STARTPTS,{vf}', *enc, tail)
    run('ffmpeg', '-v', 'error', '-y', '-i', a.src, '-vf', f'trim=0:{XF},setpts=PTS-STARTPTS,{vf}', *enc, head)
    xf = os.path.join(tmp, 'xf.mp4')
    run('ffmpeg', '-v', 'error', '-y', '-i', tail, '-i', head, '-filter_complex', f'[0:v][1:v]xfade=transition=fade:duration={XF}:offset=0,format=yuv420p', *enc, xf)
    lst = os.path.join(tmp, 'l.txt'); open(lst, 'w').write(f"file '{body}'\nfile '{xf}'\n")
    loopv = os.path.join(tmp, 'loop.mp4')
    run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', loopv)
    # --- audio: same structure, sample accurate, switch inside the silent gap with 15 ms ramps
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    au = np.frombuffer(pcm, np.float32).copy(); n = int(T * SR); au = np.pad(au, (0, max(0, n - len(au))))[:n]
    x = int(XF * SR)
    t_seg, h_seg = au[n - x:n].copy(), au[:x].copy()
    g = speech_gap(np.abs(t_seg) + np.abs(h_seg), 0, x)   # quietest point where both sides are silent
    r = int(SR * 0.015); gt = np.ones(x); gh = np.zeros(x)
    gt[g:] = 0; gh[g:] = 1
    lo, hi = max(0, g - r), min(x, g + r)
    ramp = np.linspace(0, 1, hi - lo)
    gt[lo:hi] = np.cos(ramp * np.pi / 2); gh[lo:hi] = np.sin(ramp * np.pi / 2)
    mix = t_seg * gt + h_seg * gh
    loopa = np.concatenate([au[x:n - x], mix]).astype(np.float32)
    wav = os.path.join(tmp, 'a.f32')
    loopa.tofile(wav)
    start_hint = round((len(loopa) - x + g) / SR, 3)
    print(f'loop length {len(loopa)/SR:.3f}s, audio switch at +{g/SR:.3f}s, first-play start hint {start_hint}s')
    os.makedirs(os.path.join(PUB, 'hero'), exist_ok=True)
    run('ffmpeg', '-v', 'error', '-y', '-i', loopv, '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', wav, '-map', '0:v', '-map', '1:a',
        '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-ac', '1', '-movflags', '+faststart', '-shortest',
        os.path.join(PUB, 'hero', 'hero.mp4'))
    run('ffmpeg', '-v', 'error', '-y', '-i', loopv, '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', wav, '-map', '0:v', '-map', '1:a',
        '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '80k', '-shortest',
        os.path.join(PUB, 'hero', 'hero.webm'))
    # poster = the frame shown at the first-play start point
    run('ffmpeg', '-v', 'error', '-y', '-ss', str(start_hint), '-i', os.path.join(PUB, 'hero', 'hero.mp4'), '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', os.path.join(PUB, 'portrait-poster.webp'))
    json.dump({'loopSeconds': round(len(loopa) / SR, 3), 'firstPlayStart': start_hint}, open(os.path.join(PUB, 'hero', 'hero.json'), 'w'))
    # --- stills
    from PIL import Image, ImageDraw, ImageFont
    still = os.path.join(tmp, 's.png')
    run('ffmpeg', '-v', 'error', '-y', '-ss', '4', '-i', a.src, '-frames:v', '1', '-vf', vf.replace(',format=yuv420p', ''), still)
    s = Image.open(still).convert('RGB')
    if a.photo:
        p = Image.open(a.photo).convert('RGBA'); bg = Image.new('RGBA', p.size, (238, 236, 232, 255)); bg.alpha_composite(p); bust = bg.convert('RGB')
    else:
        bw = int(s.width * 0.62); bust = s.crop(((s.width - bw) // 2, 0, (s.width + bw) // 2, int(bw * 1.25)))
    W2, H2 = bust.size; tr = 480 / 600
    if W2 / H2 > tr: nw = int(H2 * tr); bust = bust.crop(((W2 - nw) // 2, 0, (W2 + nw) // 2, H2))
    else: bust = bust.crop((0, 0, W2, int(W2 / tr)))
    bust.resize((480, 600), Image.LANCZOS).save(os.path.join(PUB, 'portrait-bust.webp'), quality=88)
    og = Image.new('RGB', (1200, 630), (244, 242, 238)); fig = s.resize((int(s.width * 630 / s.height), 630), Image.LANCZOS)
    og.paste(fig, (1200 - fig.width - 40, 0))
    d = ImageDraw.Draw(og)
    def font(sz, bold=True):
        for f in ['/usr/share/fonts/opentype/inter/Inter-Bold.otf' if bold else '/usr/share/fonts/opentype/inter/Inter-Regular.otf',
                  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
            if os.path.exists(f): return ImageFont.truetype(f, sz)
        return ImageFont.load_default()
    d.text((70, 210), 'Thota Naga', font=font(64), fill=(13, 13, 13))
    d.text((70, 285), 'Manikanta', font=font(64), fill=(13, 13, 13))
    d.text((70, 380), 'AI Automation Developer', font=font(34, False), fill=(119, 117, 111))
    og.save(os.path.join(PUB, 'og.jpg'), quality=88)
    print('done')

if __name__ == '__main__':
    main()
