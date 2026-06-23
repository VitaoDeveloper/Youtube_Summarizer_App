/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Summary_userId_videoId_key" ON "Summary"("userId", "videoId");
