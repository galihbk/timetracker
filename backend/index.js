const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

const bibRoutes = require("./routes/bibRoutes")(io);

app.use(cors());
app.use(express.json());
app.use("/api/bib", bibRoutes);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
