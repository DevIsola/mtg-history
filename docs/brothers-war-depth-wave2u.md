# Wave 2U — The people inside the Brothers' War

## Editorial purpose

This wave deepens the existing historical chapter without adding cards, events, characters, relationships, or unsupported historical dates. The three additions follow civilians, young pilots, ordinary soldiers, and postwar builders whose lives are obscured by the famous Urza–Mishra rivalry. All the pre-existing eleven curated printing IDs and original event links must remain unchanged.

## Primary stories and claim boundaries

- [The Brothers' War — Episode 3: Sword One](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-3-sword-one), Miguel Lopez, 2022. Opens in **28 AR** during Kroog's fall. Follows Sanwell, other trainee pilots, Llora, and Tawnos as newly assigned sword-pattern avengers defend evacuation routes against Mishra's dragon engines. This does not make *The Fall of Kroog* a literal portrait of the pilots.
- [The Brothers' War — Episode 4: The Ink of Empires](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-4-the-ink-of-empires), Miguel Lopez, 2022. Opens in **44 AR** among Farid, Karrak, and other Fallaji troops outside Tomakul. Supports the account of trench warfare, hunger, fever, conscripts, and changing machine tactics; the account does not establish dates for other war campaigns.
- [The Brothers' War — Episode 2: The Beginning](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-2-the-beginning), Miguel Lopez, 2022. Uses the **69 AR** aftermath to contrast Tawnos's Penregon civilian machines with their repurposing for war and dwindling powerstone supplies. Kayla's response and the problem of settlement and climate are separate from the final battle on Argoth.
- [The Brothers' War — Episode 5: As Cruel, As Necessary](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-5-as-cruel-as-necessary), Miguel Lopez and Jeff Grubb, 2022. Uses a **4562 AR** present-day time-travel frame to look backward to the final Sylex event. That frame is not the historical year of the explosion.

The established [1998 novel *The Brothers' War*](https://magic.wizards.com/en/news/magic-story/the-brothers-war-episode-1-the-end) remains listed as a book in the chapter. The 2022 episodes supply supplementary narrative viewpoints rather than a blanket certification of every novel detail. We have not inferred dates or exact ages beyond those explicitly stated in the cited scenes.

## Acceptance checklist

1. Read the three new subsections in narrative order: Kroog (28 AR), long Fallaji campaign (44 AR), Penregon aftermath (69 AR).
2. Confirm that chapter bibliographies reference the exact official URLs for Episodes 3 and 4. Episode 2 is already listed; do not duplicate it.
3. Confirm that the final subsection separates the 4562 AR temporal-investigation frame from the ancient war.
4. Inspect the entire chapter's eleven existing images and accompanying significance. No new card is curated by this change.
5. Run `node --test scripts/brothers-war-depth-wave2u.test.mjs`, `pnpm run verify && pnpm exec playwright test`, and inspect the chapter on mobile and desktop before merging.

Expected project metrics remain ten chapters, 88 characters, 133 events, 118 relationships, 133 canonical card printings and 135 chapter-card references. No provenance review count is changed.
