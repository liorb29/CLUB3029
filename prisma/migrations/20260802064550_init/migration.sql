-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "priority" INTEGER NOT NULL DEFAULT 4,
    "dueDate" DATETIME,
    "hasDueTime" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "recurrenceRule" TEXT,
    "recurrenceMode" TEXT NOT NULL DEFAULT 'scheduled',
    "sortOrder" REAL NOT NULL DEFAULT 0,
    "projectId" TEXT,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "sortOrder" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TaskActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "field" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskActivity_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "offsetMinutes" INTEGER,
    "remindAt" DATETIME,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" DATETIME,
    "providerMessageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OutboundMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT,
    "reminderId" TEXT,
    "toNumber" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'green_api',
    "providerMessageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "idempotencyKey" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" DATETIME
);

-- CreateTable
CREATE TABLE "InboundMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromNumber" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'green_api',
    "providerMessageId" TEXT NOT NULL,
    "rawPayload" TEXT NOT NULL,
    "parsedIntent" TEXT,
    "relatedTaskId" TEXT,
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME
);

-- CreateTable
CREATE TABLE "PendingInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "promptMessageId" TEXT,
    "expectedActions" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'awaiting',
    "expiresAt" DATETIME,
    "resolvedByMessageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "whatsappNumber" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Jerusalem',
    "weekStartsOn" INTEGER NOT NULL DEFAULT 0,
    "defaultReminderOffsetMin" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_TaskTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TaskTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TaskTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_parentId_idx" ON "Task"("parentId");

-- CreateIndex
CREATE INDEX "Task_deletedAt_idx" ON "Task"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "TaskActivity_taskId_idx" ON "TaskActivity"("taskId");

-- CreateIndex
CREATE INDEX "TaskActivity_createdAt_idx" ON "TaskActivity"("createdAt");

-- CreateIndex
CREATE INDEX "Reminder_status_idx" ON "Reminder"("status");

-- CreateIndex
CREATE INDEX "Reminder_remindAt_idx" ON "Reminder"("remindAt");

-- CreateIndex
CREATE INDEX "Reminder_taskId_idx" ON "Reminder"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "OutboundMessage_idempotencyKey_key" ON "OutboundMessage"("idempotencyKey");

-- CreateIndex
CREATE INDEX "OutboundMessage_status_idx" ON "OutboundMessage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InboundMessage_providerMessageId_key" ON "InboundMessage"("providerMessageId");

-- CreateIndex
CREATE INDEX "InboundMessage_relatedTaskId_idx" ON "InboundMessage"("relatedTaskId");

-- CreateIndex
CREATE INDEX "PendingInteraction_status_idx" ON "PendingInteraction"("status");

-- CreateIndex
CREATE INDEX "PendingInteraction_taskId_idx" ON "PendingInteraction"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "_TaskTags_AB_unique" ON "_TaskTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskTags_B_index" ON "_TaskTags"("B");
