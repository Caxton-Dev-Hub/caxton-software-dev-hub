-- Track what an instalment learner still owes on a seat.
-- Existing rows are seats that were paid in full, so a zero default is the
-- correct backfill: nobody who already enrolled owes anything.
ALTER TABLE "Enrollment"
  ADD COLUMN "balanceKobo" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "balanceDueAt" TIMESTAMP(3);

-- Arrears reporting reads "everyone with a balance", so index it.
CREATE INDEX "Enrollment_balanceKobo_idx" ON "Enrollment"("balanceKobo");
