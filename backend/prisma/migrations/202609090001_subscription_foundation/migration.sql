-- Billing stays separate from identity and church data. Existing tenants keep
-- uninterrupted access while the new subscription model is introduced.
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerCustomerId" TEXT,
    "providerSubscriptionId" TEXT,
    "currentPeriodEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");
CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key" ON "Subscription"("providerSubscriptionId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

CREATE TABLE "BillingIntent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "workspaceName" TEXT,
    "provider" TEXT,
    "checkoutId" TEXT,
    "checkoutUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BillingIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "BillingIntent_checkoutId_key" ON "BillingIntent"("checkoutId");
CREATE INDEX "BillingIntent_userId_createdAt_idx" ON "BillingIntent"("userId", "createdAt");
CREATE INDEX "BillingIntent_status_idx" ON "BillingIntent"("status");

-- All existing organizations were provisioned before paid plans existed.
-- Preserve their access and allow the owner to classify them later.
INSERT INTO "Subscription" ("id", "organizationId", "plan", "status", "provider", "createdAt", "updatedAt")
SELECT lower(hex(randomblob(16))), "id", 'COMMUNITY', 'ACTIVE', 'legacy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Organization";
