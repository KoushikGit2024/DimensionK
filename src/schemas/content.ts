import { z } from "zod";

export const ExternalLinkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
  kind: z.enum([
    "repository",
    "live-demo",
    "documentation",
    "paper",
    "professional",
    "social",
    "other",
  ]),
});

export const ObservatoryCoordinatesSchema = z.object({
  sector: z.string(),
  magnitude: z.string(),
});

export const ProjectStoryDecisionSchema = z.object({
  title: z.string(),
  why: z.string(),
  tradeoff: z.string().optional(),
});

export const ProjectStorySchema = z.object({
  problem: z.string(),
  constraints: z.array(z.string()),
  decisions: z.array(ProjectStoryDecisionSchema),
  hardest: z.string(),
  mistakes: z.string().optional(),
  next: z.string().optional(),
});

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  category: z.enum([
    "developer-tools",
    "real-time-systems",
    "algorithms",
    "web-applications",
    "systems",
  ]),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "prototype", "archived"]),
  summary: z.string().min(10),
  description: z.string().optional(),
  metrics: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  technologies: z.array(z.string()).min(1),
  highlights: z.array(z.string()).optional(),
  story: ProjectStorySchema.optional(),
  previewImage: z.string().nullable().optional(),
  links: z.object({
    github: z.string().url().nullable().optional(),
    demo: z.string().url().nullable().optional(),
  }),
  observatoryCoordinates: ObservatoryCoordinatesSchema.optional(),
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  skills: z.array(
    z.object({
      name: z.string(),
      proficiency: z.enum(["familiar", "working", "strong"]).optional(),
      highlight: z.boolean().optional(),
    })
  ),
});

export const EducationEntrySchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  period: z.string(),
  cgpa: z.string().optional(),
  location: z.string(),
  highlights: z.array(z.string()).optional(),
});

export const ProfileSchema = z.object({
  displayName: z.string(),
  headline: z.string(),
  summary: z.string(),
  statement: z.string().optional(),
  location: z.string(),
  coordinates: z.string(),
  email: z.string().email(),
  links: z.array(ExternalLinkSchema),
});

export type ExternalLink = z.infer<typeof ExternalLinkSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type Profile = z.infer<typeof ProfileSchema>;

