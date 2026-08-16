import { z } from "zod";
import {
  ACTIVITY_ACTIONS,
  ACTIVITY_SOURCES,
  MESSAGE_PROVIDERS,
  OUTBOUND_MESSAGE_STATUSES,
  PENDING_INTERACTION_STATUSES,
  PRIORITIES,
  RECURRENCE_MODES,
  REMINDER_CHANNELS,
  REMINDER_STATUSES,
  REMINDER_TYPES,
  TASK_STATUSES,
  type Priority,
} from "@/lib/types";

// סכימות Zod אלה מקבילות ל-union types ב-lib/types.ts, ומיועדות לוולידציה
// בגבולות הקלט: Server Actions ומודול הפרסר העברי (lib/parser/, milestone עתידי).

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const prioritySchema = z
  .number()
  .int()
  .refine((value): value is Priority => (PRIORITIES as readonly number[]).includes(value), {
    message: `Priority must be one of: ${PRIORITIES.join(", ")}`,
  });
export const recurrenceModeSchema = z.enum(RECURRENCE_MODES);

export const activityActionSchema = z.enum(ACTIVITY_ACTIONS);
export const activitySourceSchema = z.enum(ACTIVITY_SOURCES);

export const reminderTypeSchema = z.enum(REMINDER_TYPES);
export const reminderChannelSchema = z.enum(REMINDER_CHANNELS);
export const reminderStatusSchema = z.enum(REMINDER_STATUSES);

export const messageProviderSchema = z.enum(MESSAGE_PROVIDERS);
export const outboundMessageStatusSchema = z.enum(OUTBOUND_MESSAGE_STATUSES);

export const pendingInteractionStatusSchema = z.enum(
  PENDING_INTERACTION_STATUSES,
);
