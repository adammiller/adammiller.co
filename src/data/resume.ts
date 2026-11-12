import data from "./resume.json";

export interface Role {
  title: string;
  /** The employer header carries the dates when an employer has a single role. */
  start?: string;
  end?: string;
  /** One-line version of the role for the home page list. */
  homeSummary: string;
  /** Lead-in paragraph shown above the bullets. */
  intro?: string;
  bullets: string[];
}

export interface Employer {
  company: string;
  start: string;
  end: string;
  roles: Role[];
}

export interface EarlierRole {
  title: string;
  start: string;
  end: string;
  description: string;
}

export interface Resume {
  summary: string;
  experience: Employer[];
  earlier: EarlierRole[];
  earlierRange: { start: string; end: string };
  skills: { label: string; items: string }[];
  education: { degree: string; school: string };
}

/** Typed view of `resume.json`, so `optional` fields are checked rather than inferred. */
export const resume: Resume = data as Resume;
