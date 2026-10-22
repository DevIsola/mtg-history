/** Semantic relationship categories. Colors distinguish ties; they do not imply factions. */
export const RELATIONSHIP_COLORS = Object.freeze({
  family: Object.freeze({ label: 'Family', description: 'Kinship', light: '#88581e', dark: '#f2c26e' }),
  friendship: Object.freeze({ label: 'Friendship', description: 'Personal bond', light: '#146d58', dark: '#6bd9ba' }),
  alliance: Object.freeze({ label: 'Alliance', description: 'Cooperation', light: '#225f92', dark: '#86bbf2' }),
  rivalry: Object.freeze({ label: 'Conflict', description: 'Opposition', light: '#a73e46', dark: '#ef9498' }),
  mentorship: Object.freeze({ label: 'Mentorship', description: 'Teaching', light: '#66499b', dark: '#c0a4f3' }),
  creation: Object.freeze({ label: 'Creation', description: 'Creator and creation', light: '#815735', dark: '#ddb082' }),
});

export function relationshipColor(category, dark = false) {
  const entry = RELATIONSHIP_COLORS[category];
  return entry ? entry[dark ? 'dark' : 'light'] : dark ? '#b7cbd0' : '#46585c';
}
export function relationshipLabel(category) {
  return RELATIONSHIP_COLORS[category]?.label ?? 'Documented connection';
}
