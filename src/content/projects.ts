export type Project = {
  slug: string;
  client: string;
  title: string;
  sector: string;
  year: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
};

/**
 * Delivered client work, newest first.
 *
 * Empty: Caxton is pre-launch and has shipped no paid client project yet.
 * Illustrative case studies used to live here and were removed rather than
 * dressed up — a studio asking a Nigerian business for a deposit cannot afford
 * to be caught inventing a track record.
 *
 * Everything downstream keys off this being empty. Adding the first real
 * engagement brings back the Work band on the landing page, the /work pages,
 * the footer link, the nav item, and the sitemap entries, with no other edit.
 */
export const projects: Project[] = [];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
