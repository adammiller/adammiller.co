/**
 * llms.txt — a plain-text summary of the site for language models and agents.
 * Generated from the same data files the pages render, so it can't drift.
 */
import type { APIRoute } from "astro";
import { SITE } from "../data/site";
import selectedWork from "../data/selected-work.json";

export const GET: APIRoute = () => {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.headline} · ${SITE.location} (remote)`,
    "",
    SITE.intro,
    "",
    "## Selected work",
    "",
    ...selectedWork.flatMap((item) => [`### ${item.title} — ${item.tag}`, item.body, ""]),
    "## Links",
    "",
    `- [Resume](${SITE.url}/resume)`,
    `- [Resume PDF](${SITE.url}/adam-miller-resume.pdf)`,
    `- [LinkedIn](${SITE.linkedin})`,
    `- Email: ${SITE.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
