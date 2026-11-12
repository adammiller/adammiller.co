/**
 * Site-wide identity and metadata.
 *
 * The headline lives here so it can be swapped in one place: every page title,
 * meta description, Open Graph tag and JSON-LD `jobTitle` reads from it.
 */
export const SITE = {
  url: "https://adammiller.co",
  name: "Adam Miller",
  headline: "Staff Software Engineer, Full-Stack & Platform",
  location: "Pittsburgh, PA",
  locationLine: "Pittsburgh, PA · Remote",
  email: "acm6603@gmail.com",
  linkedin: "https://www.linkedin.com/in/adammillerrr",

  /** Home page <title>. */
  homeTitle: "Adam Miller — Staff Software Engineer, Full-Stack & Platform",
  homeDescription:
    "Adam Miller is a staff-level software engineer in Pittsburgh who builds the platforms other engineers build on: CLIs, codemods, CI/CD, services and agent tooling for 1,000+ engineers at Netflix.",

  /** Resume page <title> and description. */
  resumeTitle: "Resume — Adam Miller, Staff Software Engineer",
  resumeDescription:
    "Resume for Adam Miller, Staff Software Engineer: nearly 20 years building products and the platforms behind them, most recently at Netflix.",

  /** Home page intro paragraph. */
  intro:
    "I build the platforms other engineers build on. For nearly 20 years I've worked across the stack, from data models and Node.js services to CLIs, CI/CD and the web front end. Most recently at Netflix's JS Platform org, which serves 1,000+ engineers and 900+ JavaScript applications, I built the codemod tooling that moves the whole fleet across breaking changes, scoped a CI/CD overhaul for the busiest monorepo, and led the platform's shift to agentic development. I'm looking for a Staff or Principal engineering role where I can make the engineers around me faster — platform, developer productivity, AI tooling or product engineering.",

  /** "Get in touch" closer on the home page. */
  closer:
    "I'm looking for a Staff or Principal engineering role where I can make the engineers around me faster — platform, developer productivity, AI tooling or product engineering. Remote from Pittsburgh, or in a Pittsburgh office.",

  /** JSON-LD `knowsAbout`. */
  knowsAbout: [
    "Developer platforms",
    "Developer productivity",
    "Build systems and CI/CD",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "Agent-native developer tooling",
  ],
} as const;

export const mailto = `mailto:${SITE.email}`;

/** Person JSON-LD shared by every page. */
export function personJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.headline,
    description,
    url: `${SITE.url}/`,
    email: mailto,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pittsburgh",
      addressRegion: "PA",
      addressCountry: "US",
    },
    sameAs: [SITE.linkedin],
    knowsAbout: SITE.knowsAbout,
  };
}
