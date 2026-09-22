# Boring Planet Reel — Remotion Project

Dark cinematic, Apple HIG × Netflix kinetic-typography style motion graphic,
fully driven by `audio_data.json` (transcript timing, beats, energy, key,
structure boundaries). No hardcoded timing — every animation reads real data.

## File map (what goes where)

```
boring-planet-reel/
├── package.json                        → npm dependencies + scripts
├── tsconfig.json                       → TypeScript config
├── remotion.config.ts                  → Remotion render settings
├── public/
│   ├── audio.mp3                       ⚠️ YOU MUST ADD THIS (see below)
│   └── PUT_AUDIO_HERE.txt              → placeholder note, delete after adding audio
├── src/
│   ├── index.ts                        → Remotion entry point
│   ├── Root.tsx                        → registers the composition, computes duration
│   ├── data/
│   │   └── audioData.json              → your uploaded analysis (copied as-is)
│   ├── utils/
│   │   ├── audioMath.ts                → energy/bass/beat/segment lookups from JSON
│   │   └── seededRandom.ts             → deterministic randomness for particles
│   ├── components/
│   │   ├── BackgroundMood.tsx          → dark teal→amber mood, shifts on structure_boundaries
│   │   ├── GlowPulse.tsx               → center glow ring, pulses on rhythm.beat_times
│   │   ├── ParticleField.tsx           → 2-depth drifting dust (parallax)
│   │   ├── LightLeakSweep.tsx          → warm light streak at each scene change
│   │   ├── GrainOverlay.tsx            → flickering film grain (SVG turbulence)
│   │   └── Vignette.tsx                → dark frame edges, keeps focus centered
│   ├── scenes/
│   │   └── WordCaption.tsx             → one transcript word, punch-in or soft reveal
│   └── compositions/
│       └── BoringPlanet.tsx            → assembles all layers + <Audio>
└── .github/workflows/render.yml        → GitHub Actions render pipeline
```

## ⚠️ One manual step before this runs

`audio_data.json` contains only the **analysis** (word timings, beat times,
energy curve) — not the sound itself. Put your real audio file at:

```
public/audio.mp3
```

Its length and timing must match the JSON (it already does, since the JSON
was extracted from it). Then delete `public/PUT_AUDIO_HERE.txt`.

## Design decisions (why it looks the way it does)

- **Apple HIG motion principle**: every animation is triggered by real data
  (a beat, a word boundary, a structure change) — never motion for its own
  sake. Easing uses spring/ease-out curves, not linear or bouncy overshoot.
- **Netflix kinetic-typography principle**: "no dragons", "no wizards" etc.
  get a hard punch-in (spring, overshoot, glow) because they're the emphasis
  words; connective words ("a", "no", "we") get a soft, quiet reveal — pacing
  contrast is what makes the punch words land.
- **Dark cinematic teal→orange grade**: background shifts from near-black
  teal (the "empty planet" tension) to warm amber ("instead we have idiots")
  to a bright flash on "Woohoo!" — driven by `structure_boundaries`, not
  guessed cut points.
- **Extra non-text elements**: parallax dust particles, a bass-reactive glow
  ring, film grain, a light-leak sweep on every scene change, and a vignette
  — so the reel isn't just text on a flat background.

## Run locally (preview)

```bash
npm install
npm start
```
Opens Remotion Studio at a local URL where you can scrub the timeline live.

## Render locally

```bash
npm run render
```
Outputs `out/boring-planet.mp4`.

## Render via GitHub Actions

1. Push this whole folder to a GitHub repo (make sure `public/audio.mp3`
   is committed — check it's not in `.gitignore`).
2. Go to the repo's **Actions** tab → **Render Boring Planet Reel** →
   **Run workflow**.
3. When it finishes, download the video from the run's **Artifacts** section
   (`boring-planet-reel.zip`, containing `boring-planet.mp4`).

The workflow also runs automatically on every push to `main` that touches
`src/`, `public/`, or the workflow file itself.

## If you want to change the look later

- Colors: `src/components/BackgroundMood.tsx` → `SEGMENT_COLORS` array.
- Which words get the "punch" style: `src/compositions/BoringPlanet.tsx` →
  `EMPHASIS_WORDS` set.
- Font size / weight: `src/scenes/WordCaption.tsx`.
- Particle count/speed: `src/compositions/BoringPlanet.tsx` where
  `<ParticleField />` is used, or the component itself for tuning.
