import type { Prisma } from "@/lib/generated/prisma/client";
import type { ActivitySource } from "@/lib/types";
import type { ActivityEntry } from "@/lib/activity/diff";

export function encodeActivityValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  return JSON.stringify(value);
}

export async function logActivity(
  tx: Prisma.TransactionClient,
  taskId: string,
  entry: ActivityEntry & { source?: ActivitySource },
): Promise<void> {
  await tx.taskActivity.create({
    data: {
      taskId,
      action: entry.action,
      field: entry.field ?? null,
      oldValue: encodeActivityValue(entry.oldValue),
      newValue: encodeActivityValue(entry.newValue),
      source: entry.source ?? "manual",
    },
  });
}

export async function logActivities(
  tx: Prisma.TransactionClient,
  taskId: string,
  entries: (ActivityEntry & { source?: ActivitySource })[],
): Promise<void> {
  if (entries.length === 0) return;
  await tx.taskActivity.createMany({
    data: entries.map((entry) => ({
      taskId,
      action: entry.action,
      field: entry.field ?? null,
      oldValue: encodeActivityValue(entry.oldValue),
      newValue: encodeActivityValue(entry.newValue),
      source: entry.source ?? "manual",
    })),
  });
}
