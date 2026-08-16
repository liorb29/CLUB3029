import { db } from "@/lib/db";

export async function getActiveTasks() {
  return db.task.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true },
  });
}

export type TaskListItem = Awaited<ReturnType<typeof getActiveTasks>>[number];
