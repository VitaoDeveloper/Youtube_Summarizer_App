/*
  Warnings:

  - Added the required column `llmProvider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('OpenAI', 'Anthropic', 'Google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "llmProvider" "Provider" NOT NULL;
