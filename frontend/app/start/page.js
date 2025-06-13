"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StartPage() {
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Set waktu awal setelah komponen dimount
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const start = async () => {
    setLoading(true);
    const waktu = new Date().toLocaleString("sv-SE").replace(" ", "T");

    try {
      const res = await axios.post("https://result.bibsport.id/api/bib/start", {
        waktu,
      });

      if (res.data.success) {
        router.push("/");
      } else {
        alert("Gagal menyimpan data");
      }
    } catch (err) {
      console.error("Gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    date?.toLocaleTimeString("id-ID", { hour12: false }) || "--:--:--";

  return (
    <main className="leaderboard-container page-wrapper">
      <div className="digital-clock">
        <h1>{formatTime(currentTime)}</h1>
      </div>
      <button className="btn-start" onClick={start} disabled={loading}>
        {loading ? "Menyimpan..." : "Start"}
      </button>
    </main>
  );
}
