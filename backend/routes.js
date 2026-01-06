const express = require("express");
const router = express.Router();
const db = require("../db");

// middleware admin
function adminAuth(req, res, next) {
  if (req.header("x-admin-key") !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// REGISTER
router.post("/register", (req, res) => {
  const {
    nama,
    nim,
    tempat_lahir,
    tanggal_lahir,
    nik,
    fakultas,
    program_studi,
    nama_ibu,
  } = req.body;

  if (!nama || !nim) {
    return res.status(400).json({ error: "nama dan nim harus diisi" });
  }

  const stmt = db.prepare(`
    INSERT INTO registrants 
    (nama, nim, tempat_lahir, tanggal_lahir, nik, fakultas, program_studi, nama_ibu, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `);

  stmt.run(
    nama,
    nim,
    tempat_lahir || "",
    tanggal_lahir || "",
    nik || "",
    fakultas || "",
    program_studi || "",
    nama_ibu || "",
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({ error: "NIM sudah terdaftar" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );

  stmt.finalize();
});

// GET ALL (admin)
router.get("/registrants", adminAuth, (req, res) => {
  db.all(`SELECT * FROM registrants ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CEK STATUS (public)
router.get("/status/:nim", (req, res) => {
  db.get(
    `SELECT nama, nim, status FROM registrants WHERE nim = ?`,
    [req.params.nim],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json(row);
    }
  );
});

// UPDATE STATUS (admin)
router.patch("/registrants/:id/status", adminAuth, (req, res) => {
  const { status } = req.body;
  const allowedStatus = ["pending", "approved", "rejected"];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ error: "Status tidak valid" });
  }

  db.run(
    `UPDATE registrants SET status=? WHERE id=?`,
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Tidak ditemukan" });

      res.json({ success: true });
    }
  );
});

module.exports = router;
