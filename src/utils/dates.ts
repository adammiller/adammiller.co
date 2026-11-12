const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Format a stored date such as `"2026-02"` (or a bare year, `"2009"`).
 * `style: "long"` → `"February 2026"`, `"short"` → `"Feb 2026"`.
 */
export function formatMonth(value: string, style: "long" | "short" = "long"): string {
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!month || !name) return year;
  return style === "short" ? `${name.slice(0, 3)} ${year}` : `${name} ${year}`;
}
