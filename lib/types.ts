// Prisma לא תומך ב-enum על SQLite (ראה PRD §3).
// כל שדה "enum" מיוצג ב-DB כ-String; הטיפוסים כאן הם ה-union types התואמים
// לערכים המתועדים בתגובות שליד כל שדה ב-prisma/schema.prisma.
// הולידציה המקבילה (Zod) נמצאת ב-lib/validation.ts.

// --- Task ---
export const TASK_STATUSES = [
  "todo",
  "in_progress",
  "done",
  "cancelled",
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// 1=דחוף, 2=גבוה, 3=בינוני, 4=רגיל (ברירת מחדל)
export const PRIORITIES = [1, 2, 3, 4] as const;
export type Priority = (typeof PRIORITIES)[number];

export const RECURRENCE_MODES = ["scheduled", "completion"] as const;
export type RecurrenceMode = (typeof RECURRENCE_MODES)[number];

// --- TaskActivity ---
export const ACTIVITY_ACTIONS = [
  "created",
  "updated",
  "completed",
  "reopened",
  "status_changed",
  "priority_changed",
  "due_changed",
  "project_changed",
  "title_changed",
  "note_changed",
  "tag_added",
  "tag_removed",
  "subtask_added",
  "recurrence_completed",
  "deleted",
  "restored",
] as const;
export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export const ACTIVITY_SOURCES = ["manual", "whatsapp", "system"] as const;
export type ActivitySource = (typeof ACTIVITY_SOURCES)[number];

// --- Reminder (פאזה 2) ---
export const REMINDER_TYPES = ["relative", "absolute"] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export const REMINDER_CHANNELS = ["whatsapp"] as const;
export type ReminderChannel = (typeof REMINDER_CHANNELS)[number];

export const REMINDER_STATUSES = [
  "pending",
  "sent",
  "failed",
  "cancelled",
] as const;
export type ReminderStatus = (typeof REMINDER_STATUSES)[number];

// --- OutboundMessage / InboundMessage (פאזה 2) ---
export const MESSAGE_PROVIDERS = ["green_api"] as const;
export type MessageProvider = (typeof MESSAGE_PROVIDERS)[number];

export const OUTBOUND_MESSAGE_STATUSES = [
  "queued",
  "sent",
  "delivered",
  "failed",
] as const;
export type OutboundMessageStatus = (typeof OUTBOUND_MESSAGE_STATUSES)[number];

// --- PendingInteraction (פאזה 2) ---
export const PENDING_INTERACTION_STATUSES = [
  "awaiting",
  "resolved",
  "expired",
] as const;
export type PendingInteractionStatus =
  (typeof PENDING_INTERACTION_STATUSES)[number];
