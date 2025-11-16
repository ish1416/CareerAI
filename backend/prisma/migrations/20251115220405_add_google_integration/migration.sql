-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "calendarEventId" TEXT,
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "interviewLocation" TEXT,
ADD COLUMN     "nextAction" TEXT,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'applied';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleTokens" TEXT;
