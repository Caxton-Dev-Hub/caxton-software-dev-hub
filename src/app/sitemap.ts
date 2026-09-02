import type { MetadataRoute } from "next";

import { hasWork, site } from "@/content/site";
import { courses } from "@/content/courses";
import { mentorshipPlans } from "@/content/mentorship";
import { projects } from "@/content/projects";
import { posts } from "@/content/posts";
import { legalDocs } from "@/content/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // /work is listed only when it has something on it; see the note in
  // src/content/projects.ts. Submitting an empty page to search engines is a
  // quality signal nobody needs.
  const staticPages = [
    ...(hasWork ? [{ path: "/work", priority: 0.8 }] : []),
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/courses", priority: 0.9 },
    { path: "/mentorship", priority: 0.9 },
    { path: "/verify", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/insights", priority: 0.6 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...courses.map((course) => ({
      url: `${site.url}/courses/${course.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...mentorshipPlans.map((plan) => ({
      url: `${site.url}/mentorship/${plan.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/insights/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...legalDocs.map((doc) => ({
      url: `${site.url}/legal/${doc.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
