/*
  Warnings:

  - You are about to drop the column `workoutId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_UserToWorkout" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserToWorkout_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserToWorkout_B_fkey" FOREIGN KEY ("B") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWorkout_AB_unique" ON "_UserToWorkout"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWorkout_B_index" ON "_UserToWorkout"("B");
