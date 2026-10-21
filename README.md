# adammiller.co

Personal homepage and resume for Adam Miller, built with [Astro](https://astro.build).

## Pages

- `/` — home page: title, intro and selected experience.
- `/resume` — full resume, printable as a two-page US Letter document.

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start the dev server at `localhost:4321`    |
| `npm run build`   | Build the static site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |
| `npm run check`   | Run Astro's type and content checks         |

## Resume PDF

The "Download PDF" link points to `/adam-miller-resume.pdf`, served from
`public/adam-miller-resume.pdf`. Keep the filename lowercase — the link and the
deployed filesystem are both case-sensitive, so `Adam-Miller-Resume.pdf` would
404 in production even though it resolves on a Mac's default disk.

## Structure

```text
src/
  layouts/BaseLayout.astro   shared head, navigation, footer
  pages/index.astro          home page
  pages/resume.astro         resume page
  styles/global.css          design tokens, components, responsive + print styles
public/
  favicon.svg
  apple-touch-icon.png
  headshot_sq.jpg            header avatar
  og.png                     Open Graph / Twitter card image
```

## Design notes

- Self-hosted Newsreader (display) and Inter (text) via Fontsource; no external
  font requests at runtime.
- All page metadata lives in `src/layouts/BaseLayout.astro`, with per-page
  title, description and Person JSON-LD passed in by each page.
- The resume uses one `h1`, `section`/`h2` blocks, an `article` per role, real
  nested lists and `<time>` elements. Print styles are at the end of
  `src/styles/global.css`.
