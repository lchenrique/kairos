-- Webhook delivery is at-least-once. Persist provider event ids so retries are
-- harmless before changing any subscription entitlement.
CREATE TABLE "PaymentWebhookEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "provider" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentWebhookEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "PaymentWebhookEvent_provider_providerEventId_key" ON "PaymentWebhookEvent"("provider", "providerEventId");
CREATE INDEX "PaymentWebhookEvent_userId_idx" ON "PaymentWebhookEvent"("userId");
