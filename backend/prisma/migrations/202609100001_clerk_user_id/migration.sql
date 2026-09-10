ALTER TABLE "User" RENAME COLUMN "authCentralSubject" TO "clerkUserId";
DROP INDEX "User_authCentralSubject_key";
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
