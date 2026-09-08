-- Auth Central is the identity authority. Existing accounts are linked on
-- their first successful Central login; no password data is copied there.
ALTER TABLE "User" ADD COLUMN "authCentralSubject" TEXT;
CREATE UNIQUE INDEX "User_authCentralSubject_key" ON "User"("authCentralSubject");
