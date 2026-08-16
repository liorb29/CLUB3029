"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { logActivity, logActivities } from "@/lib/activity/log";
import { diffTaskFields } from "@/lib/activity/diff";
import {
  createTaskInputSchema,
  updateTaskInputSchema,
  type UpdateTaskInput,
} from "@/lib/validation";

const HOME_PATH = "/";

// נקראת דרך client wrapper (AddTaskForm, startTransition) — לכן מחזירה
// { error } במקום throw. שגיאת throw בתוך startTransition לא נתפסת
// ע"י app/error.tsx (זה תופס רק שגיאות render).
export async function createTask(formData: FormData): Promise<{ error?: string }> {
  const priorityRaw = formData.get("priority");
  const parsed = createTaskInputSchema.safeParse({
    title: formData.get("title"),
    priority: priorityRaw ? Number(priorityRaw) : undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "קלט לא תקין" };
  }
  const { title, priority } = parsed.data;

  await db.$transaction(async (tx) => {
    const task = await tx.task.create({ data: { title, priority: priority ?? 4 } });
    await logActivity(tx, task.id, { action: "created", newValue: task.title });
  });

  revalidatePath(HOME_PATH);
  return {};
}

// נקראת דרך client wrapper (EditableTitle) — אותה סיבה, מחזירה { error }.
export async function updateTask(
  id: string,
  patch: UpdateTaskInput,
): Promise<{ error?: string }> {
  const parsed = updateTaskInputSchema.safeParse(patch);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "קלט לא תקין" };
  }

  await db.$transaction(async (tx) => {
    const before = await tx.task.findUniqueOrThrow({
      where: { id },
      select: { title: true, description: true, priority: true },
    });
    const entries = diffTaskFields(before, parsed.data);
    if (entries.length === 0) return;
    await tx.task.update({ where: { id }, data: parsed.data });
    await logActivities(tx, id, entries);
  });

  revalidatePath(HOME_PATH);
  return {};
}

// מופעלת כ-<form action={completeTask.bind(null, id)}> טהור, בלי client
// wrapper — throw כאן (למשל id לא קיים) נתפס ע"י app/error.tsx.
export async function completeTask(id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const before = await tx.task.findUniqueOrThrow({
      where: { id },
      select: { status: true },
    });
    if (before.status === "done") return; // אידמפוטנטי — הגנה מלחיצה כפולה
    await tx.task.update({
      where: { id },
      data: { status: "done", completedAt: new Date() },
    });
    await logActivity(tx, id, {
      action: "completed",
      field: "status",
      oldValue: before.status,
      newValue: "done",
    });
  });
  revalidatePath(HOME_PATH);
}

export async function reopenTask(id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const before = await tx.task.findUniqueOrThrow({
      where: { id },
      select: { status: true },
    });
    if (before.status !== "done") return;
    await tx.task.update({
      where: { id },
      data: { status: "todo", completedAt: null },
    });
    await logActivity(tx, id, {
      action: "reopened",
      field: "status",
      oldValue: before.status,
      newValue: "todo",
    });
  });
  revalidatePath(HOME_PATH);
}

export async function deleteTask(id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const before = await tx.task.findUniqueOrThrow({
      where: { id },
      select: { deletedAt: true },
    });
    if (before.deletedAt !== null) return;
    await tx.task.update({ where: { id }, data: { deletedAt: new Date() } });
    await logActivity(tx, id, { action: "deleted" });
  });
  revalidatePath(HOME_PATH);
}

// לא בשימוש ב-UI של M3 (אין עדיין עמוד סל מיחזור — זה M9), אבל שכבת
// ה-Server Actions נבנית מלאה מהתחלה לפי התוכנית.
export async function restoreTask(id: string): Promise<void> {
  await db.$transaction(async (tx) => {
    const before = await tx.task.findUniqueOrThrow({
      where: { id },
      select: { deletedAt: true },
    });
    if (before.deletedAt === null) return;
    await tx.task.update({ where: { id }, data: { deletedAt: null } });
    await logActivity(tx, id, { action: "restored" });
  });
  revalidatePath(HOME_PATH);
}
