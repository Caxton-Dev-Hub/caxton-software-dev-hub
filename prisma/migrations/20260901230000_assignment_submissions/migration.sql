-- Assessed work: a learner hands in, a mentor marks, the learner resubmits.
-- The curriculum itself (assignments, briefs, rubrics) stays in
-- src/content/scheme.ts; only the transactional side lands here.

-- CreateEnum
CREATE TYPE "SubmissionState" AS ENUM ('SUBMITTED', 'CHANGES_REQUESTED', 'ACCEPTED');

-- CreateTable
-- Each attempt is its own row. Resubmission is the normal path through a
-- rubric, so the history has to survive: the second attempt is marked against
-- what the first one was told.
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "url" TEXT NOT NULL,
    "notes" TEXT,
    "aiDeclaration" TEXT,
    "state" "SubmissionState" NOT NULL DEFAULT 'SUBMITTED',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentReview" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "verdict" "SubmissionState" NOT NULL,
    "comment" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentReview_pkey" PRIMARY KEY ("id")
);

-- One hand-in per attempt, so a double-submit cannot create two rows to mark.
CREATE UNIQUE INDEX "Submission_userId_assignmentId_attempt_key" ON "Submission"("userId", "assignmentId", "attempt");

-- The marking queue reads "everything awaiting a mark on this course".
CREATE INDEX "Submission_courseSlug_state_idx" ON "Submission"("courseSlug", "state");

-- The learner's own view reads "my work on this course".
CREATE INDEX "Submission_userId_courseSlug_idx" ON "Submission"("userId", "courseSlug");

-- A submission carries at most one mark; a resubmission is a new attempt row.
CREATE UNIQUE INDEX "AssignmentReview_submissionId_key" ON "AssignmentReview"("submissionId");

CREATE INDEX "AssignmentReview_reviewerId_idx" ON "AssignmentReview"("reviewerId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssignmentReview" ADD CONSTRAINT "AssignmentReview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- A mentor's account is never hard-deleted while their marks stand, so this
-- restricts rather than cascades: losing the feedback would be worse.
ALTER TABLE "AssignmentReview" ADD CONSTRAINT "AssignmentReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
