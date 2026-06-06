-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "topics" TEXT[],
    "language" TEXT NOT NULL DEFAULT 'pt',
    "length" TEXT NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_slug_key" ON "Summary"("slug");
