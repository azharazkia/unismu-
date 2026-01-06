/*
  Warnings:

  - Added the required column `fakultas` to the `Pendaftar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodi` to the `Pendaftar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pendaftar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ttl" TEXT NOT NULL,
    "fakultas" TEXT NOT NULL,
    "prodi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pendaftar" ("createdAt", "email", "id", "nama", "ttl") SELECT "createdAt", "email", "id", "nama", "ttl" FROM "Pendaftar";
DROP TABLE "Pendaftar";
ALTER TABLE "new_Pendaftar" RENAME TO "Pendaftar";
CREATE UNIQUE INDEX "Pendaftar_email_key" ON "Pendaftar"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
