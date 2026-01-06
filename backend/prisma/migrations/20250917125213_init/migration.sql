/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `berkas` on the `Pendaftar` table. All the data in the column will be lost.
  - You are about to drop the column `fakultas` on the `Pendaftar` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Pendaftar` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Admin";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pendaftar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ttl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pendaftar" ("createdAt", "email", "id", "nama", "ttl") SELECT "createdAt", "email", "id", "nama", "ttl" FROM "Pendaftar";
DROP TABLE "Pendaftar";
ALTER TABLE "new_Pendaftar" RENAME TO "Pendaftar";
CREATE UNIQUE INDEX "Pendaftar_email_key" ON "Pendaftar"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
