/*
  Warnings:

  - You are about to alter the column `timeAmount` on the `Workout` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "Trainers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timeAmount" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "whenWasCompleted" TEXT NOT NULL,
    "type" TEXT
);
INSERT INTO "new_Workout" ("completed", "id", "name", "timeAmount", "type", "whenWasCompleted") SELECT "completed", "id", "name", "timeAmount", "type", "whenWasCompleted" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "trainersId" INTEGER,
    CONSTRAINT "User_trainersId_fkey" FOREIGN KEY ("trainersId") REFERENCES "Trainers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
