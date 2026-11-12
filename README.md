# adammiller.co

Personal homepage and resume for Adam Miller, built with [Astro](https://astro.build).

## Pages

- `/` — home page: intro, selected work and selected experience.
- `/resume` — full resume, printable as a two-page US Letter document.
- `/robots.txt`, `/sitemap-index.xml` (via `@astrojs/sitemap`) and `/llms.txt` are generated from the same content files the pages use.

## Commands

| Command            | Action                                                        |
| ------------------ | ------------------------------------------------------------- |
| `npm install`      | Install dependencies (downloads Chrome for headless rendering) |
| `npm run dev`      | Start the dev server at `localhost:4321`                      |
| `npm run build`    | Build the static site to `./dist/`, then regenerate the PDF   |
| `npm run preview`  | Preview the production build locally                          |
| `npm run check`    | Run Astro's type and content checks                           |
| `npm run og`       | Regenerate `public/og.png` from `scripts/og-template.html`    |
| `npm run resume:pdf` | Rebuild and refresh `public/adam-miller-resume.pdf`         |

## Content

All copy lives in `src/data/`, not in the page components:

| File                        | Holds                                                        |
| --------------------------- | ------------------------------------------------------------ |
| `src/data/site.ts`          | Headline, location, email, page titles and meta descriptions, JSON-LD |
| `src/data/resume.json`      | Summary, experience, earlier roles, skills, education        |
| `src/data/selected-work.json` | The four "Selected work" cards on the home page            |

The headline is set once in `site.ts`; every `<title>`, meta description, Open
Graph tag and JSON-LD `jobTitle` reads from it. The home page's "Selected
experience" rows and `/llms.txt` are derived from `resume.json` and
`selected-work.json`, so they can't drift from the resume.

`src/data/resume.ts` adds TypeScript types on top of `resume.json` (roles at a
single-role employer inherit the employer's dates).

## Resume PDF

`npm run build` prints `/resume` to `dist/adam-miller-resume.pdf` with headless
Chromium (Letter, no browser header/footer, two pages max — the script fails the
build if the resume grows past two).

`public/adam-miller-resume.pdf` is the committed copy, served in `npm run dev`
and used as the fallback if Chromium can't launch on a build host. Run
`npm run resume:pdf` after changing resume copy so the committed copy matches,
and commit the refreshed file.

Keep the filename lowercase — the link and the deployed filesystem are both
case-sensitive, so `Adam-Miller-Resume.pdf` would 404 in production even though
it resolves on a Mac's default disk.

## Open Graph image

`public/og.png` is 2400×1260 (a 1200×630 card at 2×), rendered from
`scripts/og-template.html` with the same fonts and palette as the site. Run
`npm run og` after changing the headline or the bottom-line copy in the
template.

## Structure

```text
src/
  data/                      site copy, resume and selected-work content
  layouts/BaseLayout.astro   shared head, navigation, footer
  pages/index.astro          home page
  pages/resume.astro         resume page
  pages/llms.txt.ts          llms.txt, generated from src/data
  pages/robots.txt.ts        robots.txt
  styles/global.css          design tokens, components, responsive + print styles
  utils/dates.ts             month formatting shared by both pages
scripts/
  generate-og.mjs            renders public/og.png
  generate-pdf.mjs           prints dist/adam-miller-resume.pdf
  og-template.html           the social card layout
  lib/static-server.mjs      tiny server for the headless renderers
public/
  favicon.svg
  apple-touch-icon.png
  headshot_sq.jpg            header avatar
  og.png                     Open Graph / Twitter card image
  adam-miller-resume.pdf     committed resume PDF
```

## Design notes

- Self-hosted Newsreader (display) and Inter (text) via Fontsource; no external
  font requests at runtime.
- All page metadata lives in `src/layouts/BaseLayout.astro`, with per-page
  title, description and Person JSON-LD passed in by each page.
- The resume uses one `h1`, `section`/`h2` blocks, an `article` per role, real
  nested lists and `<time>` elements. Print styles are at the end of
  `src/styles/global.css`.
