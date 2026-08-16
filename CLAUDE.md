# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

מערכת ניהול משימות אישית (personal task management system). מאפשרת ליצור, לארגן ולעקוב אחר משימות אישיות. בהמשך תחובר ל-Green API לשליחת תזכורות בוואטסאפ.

Repo: https://github.com/liorb29/CLUB3029

## Tech Stack

- **Next.js 14** (App Router)
- **Prisma** (ORM)
- **SQLite** (database)
- **Tailwind CSS** (styling)
- **shadcn/ui** (UI components)
- **Green API** — WhatsApp reminders (future integration)

## Project-specific Claude config

תחת `.claude/` יושבים agents, skills ו-commands מותאמים לפרויקט:

- `.claude/agents/` — subagents מותאמים לפרויקט
- `.claude/skills/` — skills מותאמים לפרויקט
- `.claude/commands/` — slash commands מותאמים לפרויקט

> **Status:** M1–M3 הושלמו. פרויקט Next.js פעיל עם Prisma/SQLite (סכימה מלאה, כולל טבלאות פאזה 2 ללא לוגיקה), ו-CRUD משימות בסיסי (יצירה/עריכה/השלמה/מחיקה רכה) עם שכבת `TaskActivity` אחידה. הרץ `npm run dev` להעלאה מקומית. Milestones הבאים לפי `PRD-task-manager.md`: פרויקטים/תגיות/תת-משימות, תצוגות, פרסר עברי + Quick Add, ועוד.
