/** Semantic relationship categories. Colors distinguish ties; they do not imply factions. */
export const RELATIONSHIP_COLORS = Object.freeze({
  family: Object.freeze({ label: 'Family', description: 'Kinship', light: '#995000', dark: '#ffc36a' }),
  friendship: Object.freeze({ label: 'Friendship', description: 'Personal bond', light: '#006957', dark: '#64f0cc' }),
  alliance: Object.freeze({ label: 'Alliance', description: 'Cooperation', light: '#1b57a6', dark: '#78b9ff' }),
  rivalry: Object.freeze({ label: 'Conflict', description: 'Opposition', light: '#ac1736', dark: '#ff8296' }),
  mentorship: Object.freeze({ label: 'Mentorship', description: 'Teaching', light: '#6533a6', dark: '#d5a4ff' }),
  creation: Object.freeze({ label: 'Creation', description: 'Creator and creation', light: '#93327f', dark: '#ff99df' }),
});

export function relationshipColor(category, dark = false) {
  const entry = RELATIONSHIP_COLORS[category];
  return entry ? entry[dark ? 'dark' : 'light'] : dark ? '#b7cbd0' : '#46585c';
}
export function relationshipLabel(category) {
  return RELATIONSHIP_COLORS[category]?.label ?? 'Documented connection';
}

/** Distinct line patterns supplement hue in the graph. */
export function relationshipDash(category) {
  return { family: false, friendship: [12, 5], alliance: [3, 5],
    rivalry: [16, 4, 3, 4], mentorship: [2, 6], creation: [12, 4, 2, 4] }[category] ?? false;
}
