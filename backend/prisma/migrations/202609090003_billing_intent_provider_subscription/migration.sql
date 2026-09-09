-- The Checkout and the first payment are distinct Asaas events. Keep their
-- shared subscription id on the intent to reconcile them safely.
ALTER TABLE "BillingIntent" ADD COLUMN "providerSubscriptionId" TEXT;

CREATE UNIQUE INDEX "BillingIntent_providerSubscriptionId_key" ON "BillingIntent"("providerSubscriptionId");
