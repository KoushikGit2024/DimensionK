import rawProjects from "@/content/projects.json";
import rawProfile from "@/content/profile.json";
import rawSkills from "@/content/skills.json";
import rawEducation from "@/content/education.json";
import {
  ProjectSchema,
  ProfileSchema,
  SkillCategorySchema,
  EducationEntrySchema,
  type Project,
  type Profile,
  type SkillCategory,
  type EducationEntry,
} from "@/schemas/content";
import { z } from "zod";

export function getProjects(): Project[] {
  const parsed = z.array(ProjectSchema).safeParse(rawProjects);
  if (!parsed.success) {
    console.error("Projects validation failed:", parsed.error.format());
    throw new Error("Invalid projects.json schema");
  }
  return parsed.data;
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getProfile(): Profile {
  const parsed = ProfileSchema.safeParse(rawProfile);
  if (!parsed.success) {
    console.error("Profile validation failed:", parsed.error.format());
    throw new Error("Invalid profile.json schema");
  }
  return parsed.data;
}

export function getSkillCategories(): SkillCategory[] {
  const parsed = z.array(SkillCategorySchema).safeParse(rawSkills);
  if (!parsed.success) {
    console.error("Skills validation failed:", parsed.error.format());
    throw new Error("Invalid skills.json schema");
  }
  return parsed.data;
}

export function getEducation(): EducationEntry[] {
  const parsed = z.array(EducationEntrySchema).safeParse(rawEducation);
  if (!parsed.success) {
    console.error("Education validation failed:", parsed.error.format());
    throw new Error("Invalid education.json schema");
  }
  return parsed.data;
}

