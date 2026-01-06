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
    "nik" TEXT,
    "nim" TEXT,
    "namaIbu" TEXT,
    "alamat" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ktp" TEXT,
    "akta" TEXT,
    "kk" TEXT,
    "buktiPelunasan" TEXT,
    "skripsi" TEXT,
    "suratBebasPustaka" TEXT,
    "artikelJurnal" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pendaftar" ("createdAt", "email", "fakultas", "id", "nama", "prodi", "ttl") SELECT "createdAt", "email", "fakultas", "id", "nama", "prodi", "ttl" FROM "Pendaftar";
DROP TABLE "Pendaftar";
ALTER TABLE "new_Pendaftar" RENAME TO "Pendaftar";
CREATE UNIQUE INDEX "Pendaftar_email_key" ON "Pendaftar"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
