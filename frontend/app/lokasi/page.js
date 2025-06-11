"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputLokasiPage() {
  const [lokasi, setLokasi] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lokasi) return;
    router.push(`/input?lokasi=${encodeURIComponent(lokasi)}`);
  };

  return (
    <main className="page-wrapper">
      <h1>Masukkan Nama Lokasi</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Contoh: KM 1"
          />
        </div>
        <button type="submit" className="btn-submit">
          Lanjut
        </button>
      </form>
    </main>
  );
}
