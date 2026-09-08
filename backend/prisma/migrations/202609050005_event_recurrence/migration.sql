ALTER TABLE "Event" ADD COLUMN "recurrenceEndDate" DATETIME;
ALTER TABLE "Event" ADD COLUMN "recurrenceExceptions" TEXT NOT NULL DEFAULT '[]';
