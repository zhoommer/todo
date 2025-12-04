-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('WORK', 'PERSONAL', 'URGENT');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "Categories" NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "dueDate" TEXT,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
