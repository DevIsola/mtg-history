import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chapterSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    eraId: z.string(),
    order: z.number().int().positive(),
    plane: z.string(),

    relatedSets: z.array(
      z.object({
        name: z.string(),
        year: z.number().int(),
      }),
    ),

    chronology: z.object({
      storyPeriod: z.string(),
      storyDetail: z.string(),
      publicationHistory: z.string(),
    }),

    cardIds: z.array(reference("cards")).min(1),

    // Printing metadata lives in cards collection; positions match cardIds.
    cards: z.array(z.object({ significance: z.string().min(1) })).min(1),

    sources: z
      .array(
        z.object({
          title: z.string(),
          kind: z.enum(["official", "book"]),
          author: z.string().optional(),
          year: z.number().int().optional(),
          url: z.url().optional(),
        }),
      )
      .default([]),
  });

const chapters = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/chapters",
  }),

  schema: chapterSchema,
});

const chaptersPt = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/chapters-pt" }),
  schema: chapterSchema,
});

/**
 * Canonical entity records live in one JSON file per character, event, or tie.
 * Existing src/data/*.ts imports remain as generated compatibility adapters.
 */
// A card is an exact Scryfall printing (not an Oracle card). File IDs are UUIDs.
const cards = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/cards" }),
  schema: z.object({
    name: z.string().min(1),
    setCode: z.string().min(2),
    collectorNumber: z.string().min(1),
    artist: z.string().min(1),
  }),
});

const characters = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/characters" }),
  schema: z.object({
    name: z.string().min(1),
    title: z.string(),
    origin: z.string(),
    role: z.string(),
    summary: z.string(),
    biography: z.array(z.string()),
    chapterIds: z.array(reference("chapters")).min(1),
    featuredCardId: reference("cards"),
    featuredCard: z.object({ significance: z.string().min(1) }),
    source: z.object({ title: z.string(), url: z.url() }),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/events" }),
  schema: z.object({
    title: z.string().min(1),
    chapterId: reference("chapters"),
    summary: z.string(),
    narrative: z.array(z.string()),
    characterIds: z.array(reference("characters")),
    cardId: reference("cards"),
  }),
});

const relationships = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/relationships" }),
  schema: z.object({
    a: reference("characters"),
    b: reference("characters"),
    category: z.enum(["family", "friendship", "alliance", "rivalry", "mentorship", "creation"]),
    labelForA: z.string(),
    labelForB: z.string(),
    context: z.string(),
    chapterId: reference("chapters"),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/glossary" }),
  schema: z.object({
    term: z.string().min(2),
    summary: z.string().min(12),
    details: z.string().min(12),
    chapterId: reference("chapters"),
  }),
});

export const collections = { chapters, chaptersPt, cards, characters, events, relationships, glossary };
