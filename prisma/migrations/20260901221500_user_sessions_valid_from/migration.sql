-- Stateless-session revocation lever. Any JWT issued before this instant is
-- rejected. Existing users default to now(), which leaves current sessions
-- valid — a deploy should not sign everybody out.
ALTER TABLE "User"
  ADD COLUMN "sessionsValidFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
