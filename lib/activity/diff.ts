import type { ActivityAction } from "@/lib/types";

export interface ActivityEntry {
  action: ActivityAction;
  field?: string;
  oldValue?: unknown;
  newValue?: unknown;
}

// שדות שעוברים דרך diffTaskFields()/updateTask() הגנרי.
// status לא נכלל בכוונה: completeTask/reopenTask הן פעולות ייעודיות
// עם ActivityAction משלהן ("completed"/"reopened"), לא "status_changed".
//
// priority מוקלד כ-number (לא Priority) כי הצד "before" מגיע ישירות
// מ-Prisma (עמודת Int רגילה) — האכיפה של 1-4 כבר קרתה קודם דרך Zod
// (prioritySchema) בגבול הקלט של ה-Server Action; המודול הזה עושה diff
// מבני טהור ולא צריך לאכוף שוב את הטווח.
export interface DiffableTaskFields {
  title?: string;
  description?: string | null;
  priority?: number;
}

const FIELD_TO_ACTION: Record<keyof DiffableTaskFields, ActivityAction> = {
  title: "title_changed",
  description: "note_changed",
  priority: "priority_changed",
};

function valuesEqual(a: unknown, b: unknown): boolean {
  return a === b;
}

// `after` מכיל רק מפתחות שהיו חלק מהקלט בפועל (שדות .optional() שלא
// סופקו נעדרים מהאובייקט המפורסר) — זה מה שמאפשר להבחין בין "שדה
// לא נגע" (נעדר מ-after) לבין "שדה אופס במפורש ל-null".
export function diffTaskFields(
  before: DiffableTaskFields,
  after: DiffableTaskFields,
): ActivityEntry[] {
  const entries: ActivityEntry[] = [];
  for (const key of Object.keys(FIELD_TO_ACTION) as (keyof DiffableTaskFields)[]) {
    if (!(key in after)) continue;
    const oldValue = before[key] ?? null;
    const newValue = after[key] ?? null;
    if (!valuesEqual(oldValue, newValue)) {
      entries.push({ action: FIELD_TO_ACTION[key], field: key, oldValue, newValue });
    }
  }
  return entries;
}
