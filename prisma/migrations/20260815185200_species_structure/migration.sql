-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Species" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "habitat" TEXT,
    "status" TEXT,
    "slug" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Species" ("category", "createdAt", "description", "habitat", "id", "image", "name", "scientificName", "slug", "status", "updatedAt") SELECT "category", "createdAt", "description", "habitat", "id", "image", "name", "scientificName", "slug", "status", "updatedAt" FROM "Species";
DROP TABLE "Species";
ALTER TABLE "new_Species" RENAME TO "Species";
CREATE UNIQUE INDEX "Species_slug_key" ON "Species"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
