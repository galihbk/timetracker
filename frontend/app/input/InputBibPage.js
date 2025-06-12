'use client'

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function InputBibPage() {
  const searchParams = useSearchParams();
  const lokasi = searchParams.get("lokasi") || "Tanpa Lokasi";
  const [bib, setBib] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bib) return;

    try {
      await axios.post("http://localhost:5000/api/bib/submit", {
        lokasi,
        bib,
        waktu: new Date().toISOString(),
      });

      setMessage(`BIB ${bib} berhasil disimpan!`);
      setBib("");
    } catch (err) {
      setMessage("Gagal menyimpan data.");
      console.error(err);
    }
  };

  return (
    <main className="page-wrapper">
      <h1>Input BIB di {lokasi}</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={bib}
            onChange={(e) => setBib(e.target.value)}
            placeholder="Masukkan BIB"
          />
        </div>
        <button type="submit" className="btn-submit">
          Simpan
        </button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
