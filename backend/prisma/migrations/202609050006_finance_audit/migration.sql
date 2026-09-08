ALTER TABLE "FinanceEntry" ADD COLUMN "createdById" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "createdByName" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "updatedById" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "updatedByName" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "deletedAt" DATETIME;
ALTER TABLE "FinanceEntry" ADD COLUMN "deletedById" TEXT;
ALTER TABLE "FinanceEntry" ADD COLUMN "deletedByName" TEXT;

CREATE INDEX "FinanceEntry_churchId_deletedAt_idx" ON "FinanceEntry"("churchId", "deletedAt");
