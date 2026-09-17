import { z } from "zod";

const localeSchema = z.enum(["pt-BR", "en", "es", "fr", "ja"]);
const requiredText = z.string().trim().min(1).max(240);
const optionalUrl = z.url().max(2048).nullable();

export const portfolioSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  code: z.string().regex(/^[a-z0-9-]{3,60}$/),
  name: requiredText,
  status: z.enum(["draft", "published", "archived"]),
  defaultLocale: localeSchema,
  enabledLocales: z.array(localeSchema).min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  publishedAt: z.iso.datetime().nullable(),
});

export const linkActionSchema = z.object({
  label: requiredText,
  href: z.string().trim().min(1).max(2048),
  external: z.boolean(),
});

export const mediaReferenceSchema = z.object({
  path: z.string().trim().min(1).max(2048),
  alt: z.string().trim().min(1).max(240),
});

export const homeContentSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: requiredText,
  subtitle: z.string().trim().max(320),
  description: z.string().trim().max(2000),
  primaryAction: linkActionSchema,
  secondaryAction: linkActionSchema.nullable(),
  socialLinks: z.array(z.object({
    id: z.string().min(1),
    label: requiredText,
    url: z.url().max(2048),
    icon: requiredText,
  })).max(12),
  heroImage: mediaReferenceSchema.nullable(),
});

export const homeFormSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: requiredText,
  subtitle: z.string().trim().max(320),
  description: z.string().trim().max(2000),
  primaryActionLabel: requiredText,
  primaryActionHref: z.string().trim().min(1).max(2048),
  secondaryActionLabel: z.string().trim().max(240),
  secondaryActionHref: z.string().trim().max(2048),
  linkedinUrl: z.union([z.literal(""), z.url().max(2048)]),
  githubUrl: z.union([z.literal(""), z.url().max(2048)]),
}).refine(
  (value) => Boolean(value.secondaryActionLabel) === Boolean(value.secondaryActionHref),
  {
    message: "Informe o texto e o destino do botão secundário.",
    path: ["secondaryActionHref"],
  },
);

export const experienceSchema = z.object({
  id: z.string().min(1),
  company: requiredText,
  role: requiredText,
  startDate: z.iso.date(),
  endDate: z.iso.date().nullable(),
  current: z.boolean(),
  description: z.string().trim().max(5000),
  technologies: z.array(requiredText).max(30),
  order: z.number().int().nonnegative(),
  visible: z.boolean(),
}).refine((value) => value.current ? value.endDate === null : true, {
  message: "Uma experiência atual não pode ter data final.",
  path: ["endDate"],
});

export const projectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]{3,100}$/),
  title: requiredText,
  summary: z.string().trim().min(1).max(1000),
  cover: mediaReferenceSchema.nullable(),
  repositoryUrl: optionalUrl,
  liveUrl: optionalUrl,
  technologies: z.array(requiredText).max(30),
  sections: z.array(z.object({
    id: z.string().min(1),
    anchor: z.string().regex(/^[a-z0-9-]{2,100}$/),
    title: requiredText,
    kind: z.enum(["richText", "image", "gallery", "warning", "legal"]),
    content: z.string().max(50000),
    images: z.array(mediaReferenceSchema).max(30),
    order: z.number().int().nonnegative(),
    visible: z.boolean(),
  })).max(50),
  featured: z.boolean(),
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const technologySchema = z.object({
  id: z.string().min(1),
  name: requiredText,
  icon: requiredText,
  ariaLabel: requiredText,
  startedAt: z.iso.date().nullable(),
  projectIds: z.array(z.string().min(1)).max(100),
  visible: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  institution: requiredText,
  degree: requiredText,
  fieldOfStudy: requiredText,
  startDate: z.iso.date(),
  endDate: z.iso.date().nullable(),
  current: z.boolean(),
  description: z.string().trim().max(5000),
  order: z.number().int().nonnegative(),
  visible: z.boolean(),
}).refine((value) => value.current ? value.endDate === null : true, {
  message: "Uma formação atual não pode ter data final.",
  path: ["endDate"],
});

export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(320),
  phone: z.string().trim().max(30).nullable(),
  subject: z.string().trim().max(160).nullable(),
  message: z.string().trim().min(10).max(5000),
});
