-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timeAmount" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "whenWasCompleted" TEXT NOT NULL,
    "type" TEXT
);
INSERT INTO "new_Workout" ("completed", "id", "name", "timeAmount", "whenWasCompleted") SELECT "completed", "id", "name", "timeAmount", "whenWasCompleted" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
