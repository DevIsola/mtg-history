import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chapters = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/chapters",
  }),

  schema: z.object({
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

    cards: z
      .array(
        z.object({
          name: z.string(),
          setCode: z.string(),
          collectorNumber: z.string(),
          scryfallId: z.uuid(),
          artist: z.string(),
          significance: z.string(),
        }),
      )
      .default([]),

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
  }),
});

export const collections = {
  chapters,
};
