export interface ReportIssueInput {
  chapterId: string;
  chapterTitle: string;
  category: string;
  pageUrl: string;
}
export interface IssueCategory { readonly id: string; readonly label: string; }
export const ISSUE_CATEGORIES: readonly IssueCategory[];
export function reportIssueUrl(input: ReportIssueInput): string;
