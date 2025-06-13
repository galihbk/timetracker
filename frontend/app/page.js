"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../styles/globals.css";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("7K");
  const [rawData, setRawData] = useState({ lokasi: [], data: [] });

  useEffect(() => {
    fetchLeaderboard();

    const socket = io("http://35.232.72.141:5000");
    socket.on("new_bib", () => fetchLeaderboard());
    return () => socket.disconnect();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://35.232.72.141:5000/api/bib/leaderboard");
      const { lokasi, data } = res.data;

      const ranked = data.map((item) => ({ ...item }));

      // Urutkan berdasarkan jumlah checkpoint & total waktu
      const sorted = ranked.sort((a, b) => {
        const aCP = Object.keys(a.lokasi || {}).length;
        const bCP = Object.keys(b.lokasi || {}).length;

        if (bCP !== aCP) return bCP - aCP;

        if (a.totalWaktu == null) return 1;
        if (b.totalWaktu == null) return -1;
        return a.totalWaktu - b.totalWaktu;
      });

      // Bagi peserta berdasarkan kategori, dan beri peringkat terpisah
      const kategoriGroups = {};

      sorted.forEach((item) => {
        if (!kategoriGroups[item.kategori]) kategoriGroups[item.kategori] = [];
        kategoriGroups[item.kategori].push(item);
      });

      Object.keys(kategoriGroups).forEach((kategori) => {
        kategoriGroups[kategori].forEach((item, idx) => {
          const i = ranked.findIndex((r) => r.bib === item.bib);
          if (i !== -1) ranked[i].rank = idx + 1;
        });
      });

      setRawData({ lokasi, data: ranked });
    } catch (err) {
      console.error("Fetch leaderboard gagal:", err);
    }
  };

  const getFirstName = (fullName) => fullName?.split(" ")[0] || "";

  const filtered = rawData.data.filter((row) => row.kategori === activeTab);

  const top3 = [1, 2, 3]
    .map((r) => filtered.find((row) => row.rank === r))
    .filter(Boolean);

  const others = filtered
    .filter((row) => ![1, 2, 3].includes(row.rank))
    .sort((a, b) => {
      if (!a.rank) return 1;
      if (!b.rank) return -1;
      return a.rank - b.rank;
    });

  return (
    <main className="leaderboard-container page-wrapper">
      <div className="tab-buttons">
        {["7K", "14K", "21K"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <section className="top-three">
        {top3.map((item) => (
          <div
            key={item.bib}
            className={`top-box ${
              item.rank === 1 ? "first" : item.rank === 2 ? "second" : "third"
            }`}
          >
            <h2>{item.bib}</h2>
            <p>{getFirstName(item.nama)}</p>
            <div
              className={`reward ${
                item.rank === 1 ? "gold" : item.rank === 2 ? "silver" : "bronze"
              }`}
            >
              {item.totalWaktu
                ? new Date(item.totalWaktu).toISOString().substr(11, 8)
                : "-"}
            </div>
            <span className="label">
              {(() => {
                const allCP = rawData.lokasi[activeTab] || [];
                const passedCP = allCP.filter((cp) => item.lokasi[cp]);
                return passedCP.length > 0
                  ? `${passedCP[passedCP.length - 1]}`
                  : "Belum start";
              })()}
            </span>
          </div>
        ))}
      </section>

      {/* Table */}
      <section className="table-section table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>BIB</th>
              <th>Nama</th>
              <th>Gender</th>
              <th>Kelas</th>
              {(rawData.lokasi[activeTab] || []).map((loc) => (
                <th key={loc}>{loc}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {others.map((row) => (
              <tr key={row.bib}>
                <td>{row.rank || "-"}</td>
                <td>{row.bib}</td>
                <td>{row.nama}</td>
                <td>{row.gender}</td>
                <td>{row.kelas}</td>
                {(rawData.lokasi[activeTab] || []).map((loc) => (
                  <td key={loc}>
                    {row.lokasi[loc]
                      ? new Date(row.lokasi[loc]).toISOString().substr(11, 8)
                      : "-"}
                  </td>
                ))}
                <td>
                  {row.totalWaktu
                    ? new Date(row.totalWaktu).toISOString().substr(11, 8)
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
