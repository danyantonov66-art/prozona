-- CreateTable
CREATE TABLE "ServiceSuggestion" (
  "id" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'bg',
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ServiceSuggestion_pkey" PRIMARY KEY ("id")
);
