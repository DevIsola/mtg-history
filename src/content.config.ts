import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chapters = defineCollection({
  loader: glob({
    pattern: "**/*.md",
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
  }),
});

export const collections = {
  chapters,
};
