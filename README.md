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

## Adding the resume PDF

The "Download PDF" link points to `/Adam-Miller-Resume.pdf`. Drop the file here:

```text
public/Adam-Miller-Resume.pdf
```

Astro copies `public/` to the site root at build time, so the link will resolve
at `https://adammiller.co/Adam-Miller-Resume.pdf`.

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
