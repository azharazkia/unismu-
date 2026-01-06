require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= UPLOAD ================= */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const name = Date.now() + "-" + Math.random().toString(36).slice(2);
    cb(null, name + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ================= ADMIN AUTH ================= */
const ADMIN_KEY = process.env.ADMIN_KEY || "rahasia123";

function adminAuth(req, res, next) {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
}

/* ================= ROUTES ================= */

// REGISTRASI
app.post(
  "/api/pendaftar",
  upload.fields([
    { name: "ktp" },
    { name: "akta" },
    { name: "kk" },
    { name: "bukti_pelunasan" },
    { name: "skripsi" },
    { name: "surat_bebas_pustaka" },
    { name: "artikel_jurnal" },
  ]),
  (req, res) => {
    const b = req.body;
    const f = req.files || {};

    db.run(
      `INSERT INTO registrants (
        nama, nim, tempat_lahir, tanggal_lahir, nik,
        fakultas, program_studi, nama_ibu, alamat,
        ktp, akta, kk, bukti_pelunasan,
        skripsi, surat_bebas_pustaka, artikel_jurnal, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        b.nama,
        b.nim,
        b.tempat_lahir,
        b.tanggal_lahir,
        b.nik,
        b.fakultas,
        b.program_studi,
        b.nama_ibu,
        b.alamat,
        f.ktp?.[0]?.filename || null,
        f.akta?.[0]?.filename || null,
        f.kk?.[0]?.filename || null,
        f.bukti_pelunasan?.[0]?.filename || null,
        f.skripsi?.[0]?.filename || null,
        f.surat_bebas_pustaka?.[0]?.filename || null,
        f.artikel_jurnal?.[0]?.filename || null,
        "pending",
      ],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Registrasi berhasil" });
      }
    );
  }
);

// ADMIN: GET ALL
app.get("/api/admin/pendaftar", adminAuth, (req, res) => {
  db.all(
    "SELECT * FROM registrants ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// ADMIN: UPDATE STATUS
app.put("/api/admin/pendaftar/:id/status", adminAuth, (req, res) => {
  const { status } = req.body;

  if (!["verified", "pending"].includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  db.run(
    "UPDATE registrants SET status=? WHERE id=?",
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Status diperbarui" });
    }
  );
});

// CEK STATUS MAHASISWA
app.get("/api/pendaftar/:nim", (req, res) => {
  db.get(
    "SELECT nama, nim, status FROM registrants WHERE nim=?",
    [req.params.nim],
    (err, row) => {
      if (!row) return res.status(404).json({ message: "NIM tidak ditemukan" });
      res.json(row);
    }
  );
});

module.exports = app;
