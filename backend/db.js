const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "wisuda.db"));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS registrants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT,
      nim TEXT UNIQUE,
      tempat_lahir TEXT,
      tanggal_lahir TEXT,
      nik TEXT,
      fakultas TEXT,
      program_studi TEXT,
      nama_ibu TEXT,
      alamat TEXT,
      ktp TEXT,
      akta TEXT,
      kk TEXT,
      bukti_pelunasan TEXT,
      skripsi TEXT,
      surat_bebas_pustaka TEXT,
      artikel_jurnal TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
