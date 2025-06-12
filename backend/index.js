const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["http://34.9.34.33:3000"], // Ganti dengan IP/domain frontend kamu
    credentials: true
  },
});

// ✅ Aktifkan CORS lebih awal
app.use(cors({
  origin: ["http://34.9.34.33:3000"],
  credentials: true
}));

app.use(express.json());

const bibRoutes = require("./routes/bibRoutes")(io);
app.use("/api/bib", bibRoutes);

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
