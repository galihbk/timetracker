CREATE TABLE peserta (
  id SERIAL PRIMARY KEY,
  bib VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  asal VARCHAR(100),
  kategori VARCHAR(50)
);

-- Tabel timer
CREATE TABLE timer (
  id SERIAL PRIMARY KEY,
  bib VARCHAR(20) NOT NULL,
  lokasi VARCHAR(100) NOT NULL,
  waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bib) REFERENCES peserta(bib) ON DELETE CASCADE
);

INSERT INTO peserta (bib, nama, asal, kategori) VALUES
('1001', 'Galih Prasetyo', 'Jakarta', '14K'),
('1002', 'Aulia Rahman', 'Bandung', '14K'),
('1003', 'Siti Nurbaya', 'Surabaya', '21K'),
('1004', 'Agus Santoso', 'Semarang', '41K');

-- Peserta 1001
INSERT INTO timer (bib, lokasi, waktu) VALUES
('1001', 'Start',  '2025-06-11 07:00:00'),
('1001', 'KM 3',   '2025-06-11 07:30:00'),
('1001', 'KM 6',   '2025-06-11 07:40:00'),
('1001', 'Finish', '2025-06-11 08:00:00');

-- Peserta 1002
INSERT INTO timer (bib, lokasi, waktu) VALUES
('1002', 'Start',  '2025-06-11 07:05:00'),
('1002', 'KM ',   '2025-06-11 07:40:00'),
('1002', 'Finish', '2025-06-11 08:10:00');

-- Peserta 1003
INSERT INTO timer (bib, lokasi, waktu) VALUES
('1003', 'Start',  '2025-06-11 06:50:00'),
('1003', 'KM 10',  '2025-06-11 07:40:00'),
('1003', 'Finish', '2025-06-11 08:45:00');

-- Peserta 1004
INSERT INTO timer (bib, lokasi, waktu) VALUES
('1004', 'Start',  '2025-06-11 07:10:00'),
('1004', 'KM 5',   '2025-06-11 07:50:00'),
('1004', 'Finish', '2025-06-11 08:30:00');