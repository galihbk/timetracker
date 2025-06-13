const express = require("express");
const pool = require("../db");
const { DateTime } = require("luxon");

module.exports = (io) => {
  const router = express.Router();
  router.post("/start", async (req, res) => {
  const { waktu } = req.body;

  if (!waktu) {
    return res
      .status(400)
      .json({ success: false, message: "Waktu tidak dikirim" });
  }

  try {
    const pesertaRes = await pool.query("SELECT bib, kategori FROM peserta");
    const peserta = pesertaRes.rows;

    if (peserta.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Tidak ada peserta ditemukan." });
    }

    for (const row of peserta) {
      let waktuStart = DateTime.fromISO(waktu); // dari frontend dalam format ISO
      if (row.kategori === "14K") {
        waktuStart = waktuStart.plus({ minutes: 30 });
      } else if (row.kategori === "7K") {
        waktuStart = waktuStart.plus({ minutes: 45 });
      }
      const waktuFinal = waktuStart.toISO(); // convert kembali ke format ISO

      const cek = await pool.query(
        "SELECT id FROM timer WHERE bib = $1 AND lokasi = 'Start' LIMIT 1",
        [row.bib]
      );

      if (cek.rows.length > 0) {
        await pool.query(
          "UPDATE timer SET waktu = $1 WHERE bib = $2 AND lokasi = 'Start'",
          [waktuFinal, row.bib]
        );
      } else {
        await pool.query(
          "INSERT INTO timer (bib, lokasi, waktu) VALUES ($1, 'Start', $2)",
          [row.bib, waktuFinal]
        );
      }
    }

    res.json({
      success: true,
      message:
        "Waktu start berhasil diinput atau diperbarui untuk semua peserta.",
    });
  } catch (err) {
    console.error("Gagal proses START:", err);
    res
      .status(500)
      .json({ success: false, message: "Gagal menyimpan data", errors: err });
  }
});

  router.post("/submit", async (req, res) => {
    const { bib, lokasi, waktu } = req.body;
    try {
      const result = await pool.query(
        "INSERT INTO timer (bib, lokasi, waktu) VALUES ($1, $2, $3) RETURNING *",
        [bib, lokasi, waktu]
      );
      io.emit("new_bib", result.rows[0]);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.get("/leaderboard", async (req, res) => {
  try {
    const waktuRes = await pool.query(`
      SELECT p.bib, p.kategori, p.nama, p.gender, p.kelas, t.lokasi, t.waktu
      FROM peserta p
      LEFT JOIN timer t ON p.bib = t.bib
      ORDER BY p.bib, t.waktu ASC
    `);

    const pesertaMap = {};
    const lokasiKategoriMap = {}; // { "14K": [Start, Km 1, Finish] }

    waktuRes.rows.forEach(({ bib, nama, kategori, gender, kelas, lokasi, waktu }) => {
      if (!bib || !lokasi || !kategori) return;

      // Inisialisasi peserta
      if (!pesertaMap[bib]) {
        pesertaMap[bib] = {
          bib,
          nama,
          gender,
          kelas,
          kategori,
          lokasi: {},
        };
      }

      // Simpan waktu per lokasi
      pesertaMap[bib].lokasi[lokasi] = waktu;

      // Simpan urutan lokasi berdasarkan kemunculan
      if (!lokasiKategoriMap[kategori]) lokasiKategoriMap[kategori] = [];

      if (!lokasiKategoriMap[kategori].includes(lokasi)) {
        lokasiKategoriMap[kategori].push(lokasi);
      }
    });

    const lokasiFinal = lokasiKategoriMap;

    // Hitung total waktu per peserta (Finish - Start)
    const data = Object.values(pesertaMap).map((peserta) => {
      const lokasiUrut = lokasiFinal[peserta.kategori] || [];
      const waktuArr = lokasiUrut
        .map((loc) => new Date(peserta.lokasi[loc]))
        .filter((d) => !isNaN(d));

      let totalWaktu = null;
      if (waktuArr.length >= 2) {
        totalWaktu = waktuArr[waktuArr.length - 1] - waktuArr[0];
      }

      return {
        ...peserta,
        totalWaktu,
      };
    });

    res.json({ lokasi: lokasiFinal, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


  return router;
};
