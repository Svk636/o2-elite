# O2 Elite · Daily Architecture
### 日々の設計 — *Design your day before you live it*

> *"Begin by sitting still — let the day arrange itself."*

---

## What is O2 Elite?

O2 Elite is a zero-distraction, **24-hour daily architecture planner** built as a single-file Progressive Web App. It divides your day into four time domains — Morning, Afternoon, Evening, and Night — each containing four structured slots split into two practice phases (A & B). Every slot holds a curated set of microsteps that you can customise, time, and track with a built-in countdown timer.

**Philosophy:** Architecture first. Execution second. Design the day with intention before it begins.

---

## Features

- **Four time domains** — Morning (Awakening), Afternoon (Focus), Evening (Dissolving), Night (Sleep Ritual)
- **Progressive slot unlock** — complete Part A of a slot to reveal the next
- **Split A/B parts** — each slot has two phases with proportional time allocation
- **Microstep timer** — circular progress ring with step-by-step countdown and pause/skip controls
- **Custom microsteps** — add, name, and duration-tag your own steps per slot/part
- **Domain auto-advance** — completed domains automatically move to the next
- **PWA installable** — works offline, add to home screen on iOS & Android
- **Integrated docs** — README + User Manual accessible via the `?` button in the nav bar
- **Zero runtime dependencies** — single `.html` file, no build step, no server required

---

## Four Domains

| Kanji | Domain | Theme | Style |
|-------|-----------|------------|-------|
| 朝 | Morning | Awakening · Physical & Spiritual | 4 slots |
| 午後 | Afternoon | Focus · Deep Work | 4 slots |
| 夕 | Evening | Dissolving · Recovery & Reflection | 4 slots |
| 夜 | Night | Sleep Ritual | 1 slot · 30 min fixed |

---

## Quick Start

1. Open `O2-Elite.html` in any modern browser (Chrome, Safari, Firefox, Edge)
2. Tap a domain in the strip (朝 / 午後 / 夕 / 夜)
3. Select hours for the domain using the **2 · 3 · 4 · 5 · 6** buttons
4. Slots appear — tap **☰ Steps** to expand, **▶ Start** to run the timer
5. Complete Part A → Part B unlocks; complete all slots → domain auto-advances
6. Press **?** in the top bar for the full User Manual

---

## Domain Architecture

Each domain receives **2–6 hours**, split across four slots using one of two ratio styles:

**Morning / Afternoon style (sty: M)**
```
Slot 01 — 1 part  : 2 parts  (short intro / long main)
Slot 02 — 2 parts : 1 part
Slot 03 — 2 parts : 1 part
Slot 04 — 2 parts : 1 part
```

**Evening style (sty: E)**
```
Slot 01 — 2 parts : 1 part
Slot 02 — 1 part  : 2 parts
Slot 03 — 1 part  : 2 parts
Slot 04 — 1 part  : 2 parts
```

Night domain is always **30 minutes fixed**, undivided.

---

## Seeded Microstep Library

The app ships with a full pre-loaded routine across domains:

### Morning · 朝

**🍵 Start & Breakfast**
- Part A (Morning Start): 4 Sati · Drink Water · Sajada · Self Declaration · Stretch · Toilet · Netrasnana · Warm Water · Chankraman · Shauch · Datun · Vajoo
- Part B (Breakfast): Breakfast · Sun Bath · Preparation · Commute

**🧘 Meditation**
- Part A (Aanapan · Vipassna): Aanapan · Vipassna
- Part B (Metta & Kriya): Metta · Warm Water · Gudmasage/Neti/Jaldhauti · Yognidra · Vajoo

**🏃 Exercise**
- Part A (Exercise): Foam Roller · Warm Up · Surya Namaskar · Shadow Boxing · Kicks & Blocks · Gymnastics · Shavasan · Stretch
- Part B (Pranayam & Chief Aim): Kapalbhati · Anulom Vilom · Ujjayi · Bhastrika · Shitli/Shitkari · Bhramri · Vayusar · Agnisar · Uddiyan · Affirm · Visualise · Write · Gratitude Journal

**📖 Study / Practice**
- Part A (Study): Om · Saregama · Barakhadi · AEIOU · Sounds · T&L Vibration · TEF Exercise · Philosophy · Script/Craft
- Part B (Acting Practice): Profile · Diction · Visualisation · Story Telling · Impromptu · Will · Ads · Script · 9 Rasa · Skit · Character Acting

### Evening · 夕

**🌆 Start & Dinner**
- Part A (Evening Commute): Audiobook · Music · Follow Up · Daily Report · Commute
- Part B (Dinner): Vajoo · Metta · Dinner · Walk

**🏋 Pre Workout & Gym**
- Part A (Pre Workout Snacks): Drink Water · Jaccusi · Snacks · Powernap
- Part B (Gym/Cardio): Foam Roller · Warm Up · Suryanamaskar · Pull Ups · Squat · Push Ups · Shoulder Press · Tricep Extensions · Bicep Curl · Crunch · Leg Raise

**📔 Diary & Meditation**
- Part A (Diary): Dairy · Correction · Next Day Goal Setting · Next Day Plan
- Part B (Meditation): Aanapan · Vipassna

**🎉 Celebration & Study**
- Part A (Celebration): Dance · Sing · Q&A
- Part B (Study/Practice): Audition Preparation · Rehearsals · Script/Craft Reading Writing

### Night · 夜

**🌙 Sleep Preparation Ritual**
- Part A (Sleep Ritual): Warm Water · Chankraman · Shauch · Datun · Bath · Tratak · Affirm · Visualise · Write · Gratitude Journal

---

## PWA Installation

### Android / Chrome
1. Open the app in Chrome
2. Tap the **⊕ Install App** link that appears in the top-right nav
3. Confirm — app installs to home screen with standalone fullscreen mode

### iOS / Safari
1. Open the app in Safari
2. Tap the **Share** icon → **"Add to Home Screen"**
3. Tap **Add** — app runs in fullscreen standalone mode

### Desktop
Chrome/Edge: click the install icon in the address bar, or use the **⊕ Install App** link when it appears.

Once installed, O2 Elite is **fully offline-capable** via an inline Service Worker that caches the app shell.

---

## File Structure

```
O2-Elite.html          ← Entire app. One file. No dependencies.
```

The app is intentionally distributed as a single self-contained HTML file:

- No `manifest.json` required — inlined as a data URI
- No `sw.js` required — Service Worker inlined via Blob URL
- No CDN or external assets at runtime (fonts load once and browser-cache)
- No framework, no bundler, no build step

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full PWA + install prompt |
| Edge 90+ | ✅ Full PWA + install prompt |
| Safari 15+ (iOS) | ✅ PWA via Add to Home Screen |
| Firefox 90+ | ✅ Full app (no install prompt) |
| Samsung Internet | ✅ Full PWA + install prompt |

---

## Changelog

### v1.2.0 — Production Release
- Added integrated README & User Manual modal via `?` nav button
- **Fix:** `timerRitual()` now sets `did`, `si`, `part` on timer state — night ritual microstep strikethroughs and done badges now work correctly
- **Fix:** `doneParts.forEach()` delete-while-iterating replaced with safe two-pass deletion
- **Fix:** `timerClose()` re-queries overlay element fresh after render cycles
- **Fix:** `refreshToggleCount()` now preserves `ms-open` CSS state on button after text content update
- **Fix:** `partBHidden` dead variable removed
- **Fix:** footer CSS included inline — no layout breaks when served as standalone HTML file
- **Added:** PWA manifest inlined as data URI — no external `manifest.json` needed
- **Added:** Service Worker inlined via Blob URL — no external `sw.js` needed
- **Added:** `touch-action: manipulation` on all interactive elements (eliminates 300ms tap delay on mobile)
- **Added:** ARIA `role="dialog"` and `aria-modal` on timer and docs overlays
- **Added:** `Escape` key closes timer overlay and docs modal

### v1.1.0
- Domain auto-advance on completion
- Progressive slot unlock via `halfDoneSlots`
- Reopen slot with cascade un-complete
- Custom microstep durations with proportional timer
- PWA install prompt integration

### v1.0.0
- Initial release — four domain planner with split slots and microstep timer

---

## Design Language

O2 Elite uses a **Pure Black Zen** aesthetic:

- **Background:** `#080808` near-absolute black
- **Typography:** DM Serif Display (headings) · Noto Serif JP (Japanese glyphs) · Space Mono (UI & data)
- **Accents:** White at varying opacity only — no colour, only light intensity
- **Domain accent bars:** Full white `0.55` (Morning) fading to near-invisible `0.12` (Night)
- **Grain texture:** Subtle SVG fractalNoise overlay at 40% opacity for depth

---

## License

Personal use. Built for daily consistency.

---

*O2 Elite · Daily Architecture · Consistency*  
*「継続は力なり」— Continuity is power.*
