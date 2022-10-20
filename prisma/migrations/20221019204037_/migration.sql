/*
  Warnings:

  - You are about to drop the `_UserToWorkout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_UserToWorkout_B_index";

-- DropIndex
DROP INDEX "_UserToWorkout_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserToWorkout";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timeAmount" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "whenWasCompleted" TEXT NOT NULL,
    "type" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("completed", "id", "name", "timeAmount", "type", "whenWasCompleted") SELECT "completed", "id", "name", "timeAmount", "type", "whenWasCompleted" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
