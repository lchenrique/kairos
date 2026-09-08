-- Cria a Rede e preserva a igreja existente como primeira unidade.
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "Organization" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES (
    'legacy-organization',
    COALESCE((SELECT "name" FROM "Church" WHERE "id" = 'default'), 'Rede Kairos'),
    'rede-kairos',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

CREATE TABLE "OrganizationUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "defaultChurchId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OrganizationUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrganizationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ChurchUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChurchUser_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChurchUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Church" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL DEFAULT 'legacy-organization',
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT 'sede',
    "isHeadquarters" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "theme" TEXT DEFAULT 'light',
    "timezone" TEXT DEFAULT 'America/Sao_Paulo',
    "dateFormat" TEXT DEFAULT 'DD/MM/YYYY',
    "timeFormat" TEXT DEFAULT 'HH:mm',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Church_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Church" ("address", "createdAt", "dateFormat", "email", "id", "logo", "name", "phone", "theme", "timeFormat", "timezone", "updatedAt", "isHeadquarters")
SELECT "address", "createdAt", "dateFormat", "email", "id", "logo", "name", "phone", "theme", "timeFormat", "timezone", "updatedAt", true FROM "Church";
DROP TABLE "Church";
ALTER TABLE "new_Church" RENAME TO "Church";
CREATE INDEX "Church_organizationId_status_idx" ON "Church"("organizationId", "status");
CREATE UNIQUE INDEX "Church_organizationId_slug_key" ON "Church"("organizationId", "slug");

CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "location" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "recurrenceRule" TEXT,
    "reminderMinutes" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdAt", "description", "endDate", "id", "location", "recurrenceRule", "reminderMinutes", "startDate", "status", "title", "type", "updatedAt")
SELECT "createdAt", "description", "endDate", "id", "location", "recurrenceRule", "reminderMinutes", "startDate", "status", "title", "type", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_churchId_startDate_idx" ON "Event"("churchId", "startDate");
CREATE INDEX "Event_churchId_status_idx" ON "Event"("churchId", "status");

CREATE TABLE "new_FinanceEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL DEFAULT 'default',
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinanceEntry_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FinanceEntry" ("amountCents", "category", "createdAt", "description", "id", "notes", "occurredAt", "paymentMethod", "type", "updatedAt")
SELECT "amountCents", "category", "createdAt", "description", "id", "notes", "occurredAt", "paymentMethod", "type", "updatedAt" FROM "FinanceEntry";
DROP TABLE "FinanceEntry";
ALTER TABLE "new_FinanceEntry" RENAME TO "FinanceEntry";
CREATE INDEX "FinanceEntry_churchId_type_occurredAt_idx" ON "FinanceEntry"("churchId", "type", "occurredAt");
CREATE INDEX "FinanceEntry_churchId_category_idx" ON "FinanceEntry"("churchId", "category");

CREATE TABLE "new_Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "meetingDay" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Group_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("createdAt", "description", "endTime", "id", "location", "meetingDay", "name", "startTime", "type", "updatedAt")
SELECT "createdAt", "description", "endTime", "id", "location", "meetingDay", "name", "startTime", "type", "updatedAt" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE INDEX "Group_churchId_type_idx" ON "Group"("churchId", "type");
CREATE UNIQUE INDEX "Group_churchId_meetingDay_startTime_endTime_location_key" ON "Group"("churchId", "meetingDay", "startTime", "endTime", "location");

CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "birthDate" DATETIME,
    "baptismDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "profession" TEXT,
    "maritalStatus" TEXT DEFAULT 'SINGLE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "image" TEXT,
    CONSTRAINT "Member_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("address", "baptismDate", "birthDate", "createdAt", "email", "id", "image", "maritalStatus", "name", "notes", "phone", "profession", "status", "updatedAt")
SELECT "address", "baptismDate", "birthDate", "createdAt", "email", "id", "image", "maritalStatus", "name", "notes", "phone", "profession", "status", "updatedAt" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE INDEX "Member_churchId_status_idx" ON "Member"("churchId", "status");

CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "churchId" TEXT NOT NULL DEFAULT 'default',
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Setting_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Setting" ("createdAt", "description", "id", "key", "updatedAt", "value")
SELECT "createdAt", "description", "id", "key", "updatedAt", "value" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
CREATE UNIQUE INDEX "Setting_churchId_key_key" ON "Setting"("churchId", "key");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE INDEX "OrganizationUser_userId_idx" ON "OrganizationUser"("userId");
CREATE UNIQUE INDEX "OrganizationUser_organizationId_userId_key" ON "OrganizationUser"("organizationId", "userId");
CREATE INDEX "ChurchUser_userId_idx" ON "ChurchUser"("userId");
CREATE UNIQUE INDEX "ChurchUser_churchId_userId_key" ON "ChurchUser"("churchId", "userId");

-- Concede aos usuários existentes acesso à Rede e à primeira unidade.
INSERT INTO "OrganizationUser" ("id", "organizationId", "userId", "role", "defaultChurchId", "createdAt", "updatedAt")
SELECT lower(hex(randomblob(16))), 'legacy-organization', "id", "role", 'default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "User";

INSERT INTO "ChurchUser" ("id", "churchId", "userId", "role", "createdAt", "updatedAt")
SELECT lower(hex(randomblob(16))), 'default', "id", "role", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "User";

