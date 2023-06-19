-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Jun 2023 pada 09.27
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `formsubmit`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `forms`
--

CREATE TABLE `forms` (
  `form_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tittle` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `forms`
--

INSERT INTO `forms` (`form_id`, `user_id`, `tittle`, `description`, `created_at`, `update_at`) VALUES
(1001, 211171, 'Form pengumpulan tugas RPL', 'Kumpulkan tugas RPL', '2023-06-03 08:48:45', '2023-06-03 08:48:45'),
(1011, 211175, 'Progress project PWEB A', 'Cantumkan link youtube demo dan link repository github disini', '2023-06-11 07:27:35', '2023-06-11 07:27:35'),
(1012, 211175, 'Upload KTP ', 'Untuk jalan-jalan di hari rabu dibutuhkan ktp peserta jalan-jalan', '2023-06-11 07:28:09', '2023-06-11 07:28:09'),
(1015, 211175, 'Progress project PWEB', 'DESKRIPSI NYA DI UPDATE', '2023-06-11 14:08:25', '2023-06-18 15:01:59');

-- --------------------------------------------------------

--
-- Struktur dari tabel `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `uploaded_file` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`user_id`, `nama`, `username`, `email`, `password`, `active`, `avatar`, `created_at`, `update_at`) VALUES
(211152, '', 'nadini', 'dini@gmail.com', '$2b$10$9.HSQRyoSNHdJiuxTsxq6OzN0L6W2AEuJTdn1fpQnrI8GfhlUGg66', 1, 'photo', '2023-05-27 01:41:24', '2023-05-27 01:41:24'),
(211153, '', 'amalia', 'amal@gmail.com', '698d51a19d8a121ce581499d7b701668', 1, 'picture', '2023-05-23 15:47:34', '2023-04-10 08:28:07'),
(211159, 'dini', 'nadini12', 'dini@gmail.com', '$2b$10$i6wWF4fzda29ledMK48KmeUiPP4bZTsKbk/K5Se6mL7eCYB.UGxbW', 1, 'picture', '2023-05-29 08:30:07', '2023-05-29 08:30:07'),
(211171, 'nadia nur saida', 'nadiianrs', 'nadianrs88@gmail.com', '$2b$10$i1ZuCAmUFgIifTBJqwdSR.jEfl7Z84YWbWelDbYiPy/cEHXpDGuH2', 1, 'picture', '2023-06-03 04:04:50', '2023-06-03 04:04:50'),
(211175, 'Nadia Nur Saida', 'nadianursaida88', 'nadianursaida88@gmail.com', '$2b$10$It1OMJNj0olWxrHhis5mxe38mb6rQECoaARVBe9YrFz5aa72qsvfa', 1, 'picture', '2023-06-11 03:16:10', '2023-06-11 03:16:10'),
(211176, 'naaaad', 'nadiaa', 'nadianrs88@gmail.com', '$2b$10$oTdhi.RSMZlTazguDuenBO2aa7c66e2jTMe9BK3gVadfVouPF0rNK', 1, 'picture', '2023-06-07 08:04:52', '2023-06-07 08:04:52'),
(211177, 'Syadza Intann Benya', 'syadza12', 'syadza12@gmail.com', '$2b$10$fGytl9ACgzoPW3fZm/2rku5nU4uuQ3KyQgdwJ2DWPcP8pYPdpxn8u', 1, 'picture', '2023-06-07 08:10:38', '2023-06-07 08:10:38'),
(211178, 'syadza intan benya', 'syadza123', 'syadza123@gmail.com', '$2b$10$4jyfOrAZs2RPXoh8I1N5yuwZJegL7WOjL13S32K1uXGI3NedRhYJq', 1, 'picture', '2023-06-07 13:05:41', '2023-06-07 13:05:41');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `forms`
--
ALTER TABLE `forms`
  ADD PRIMARY KEY (`form_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`,`form_id`),
  ADD KEY `form_id` (`form_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `forms`
--
ALTER TABLE `forms`
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1019;

--
-- AUTO_INCREMENT untuk tabel `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211179;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `forms`
--
ALTER TABLE `forms`
  ADD CONSTRAINT `forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`form_id`) REFERENCES `forms` (`form_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
