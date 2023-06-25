-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Jun 2023 pada 05.14
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
  `deadline` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `forms`
--

INSERT INTO `forms` (`form_id`, `user_id`, `tittle`, `description`, `deadline`, `created_at`, `update_at`) VALUES
(1054, 211175, 'Progress project PWEB A', 'Cantumkan link youtube demo dan link repository github disini', '2023-06-27 16:00:00', '2023-06-24 14:07:26', '2023-06-24 14:38:26'),
(1055, 211179, 'Artikel Data Mining', 'Kumpulkan draft jurnal dan laporan', '2023-06-29 16:59:00', '2023-06-24 15:55:40', '2023-06-24 17:12:28'),
(1056, 211175, 'Berkas Pendaftaran Ulang Maba FTI', 'Berkas yang di perlukan : ss buktu, foto, formulis pendaftaran ulang', '2023-06-26 16:59:00', '2023-06-24 17:25:50', '2023-06-24 17:27:13'),
(1057, 211175, 'Tugas Praktikum Data Mining Pertemuan 1', 'Kumpulkan file ipynb', '2023-07-01 16:59:00', '2023-06-24 17:28:23', '2023-06-24 17:28:23'),
(1058, 211175, 'Tugas Praktikum Data Mining Pertemuan 2', 'Kumpulkan file ipynb', '2023-07-08 16:59:00', '2023-06-24 17:28:59', '2023-06-24 17:28:59'),
(1060, 211175, 'Tugas Praktikum Data Mining Pertemuan 3', 'Kumpulkan file ipynb', '2023-07-15 16:00:00', '2023-06-24 17:32:01', '2023-06-24 17:32:01'),
(1061, 211175, 'Tugas Praktikum Data Mining Pertemuan 4', 'Kumpulkan file ipynb', '2023-07-21 17:32:00', '2023-06-24 17:32:42', '2023-06-24 17:32:42'),
(1064, 211175, 'Tugas Praktikum Data Mining Pertemuan 5', 'Kumpulkan file ipynb', '2023-07-29 00:32:57', '2023-06-24 17:34:35', '2023-06-24 17:34:35'),
(1065, 211175, 'Tugas Praktikum Data Mining Pertemuan 6', 'kumpulkan file ipynb', '2023-08-05 00:32:57', '2023-06-24 17:34:35', '2023-06-24 17:34:35'),
(1066, 211175, 'Tugas Praktikum Data Mining Pertemuan 7', 'kumpulkan file ipynb', '2023-08-12 00:34:41', '2023-06-24 17:35:43', '2023-06-24 17:35:43'),
(1067, 211175, 'Tugas Praktikum Data Mining Pertemuan 8', 'kumpulkan file ipynd', '2023-08-19 00:34:41', '2023-06-24 17:35:43', '2023-06-24 17:35:43'),
(1072, 211175, 'Tugas Praktikum Data Mining Pertemuan 9', 'Kumpulkan file ipynb', '2023-08-26 00:36:12', '2023-06-24 17:37:28', '2023-06-24 17:37:28'),
(1073, 211175, 'Tugas Praktikum Data Mining Pertemuan 10', 'Kumpulkan file ipynb', '2023-09-02 00:36:12', '2023-06-24 17:37:28', '2023-06-24 17:37:28'),
(1074, 211175, 'Tugas Praktikum Data Mining Pertemuan 11', 'Kumpulkan file ipynb', '2023-09-09 00:36:12', '2023-06-24 17:37:28', '2023-06-24 17:37:28'),
(1075, 211175, 'Tugas Praktikum Data Mining Pertemuan 12', 'Kumpulkan file ipynb', '2023-09-16 00:36:12', '2023-06-24 17:37:28', '2023-06-24 17:37:28'),
(1077, 211175, 'UAP Data Mining', 'File PDF jawaban UAP', '2023-06-26 00:37:31', '2023-06-24 17:38:15', '2023-06-24 17:38:15'),
(1078, 211175, 'TESSTTTT', 'TESTTT', '2023-06-24 19:37:31', '2023-06-24 17:38:15', '2023-06-24 17:38:15'),
(1079, 211175, 'TESSTTT', 'TESTTT', '2023-08-02 00:39:21', '2023-06-24 17:39:46', '2023-06-24 17:39:46'),
(1080, 211175, 'TESTTT', 'TESTT', '2023-06-24 19:39:21', '2023-06-24 17:39:46', '2023-06-24 17:39:46');

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
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `submissions`
--

INSERT INTO `submissions` (`id`, `user_id`, `form_id`, `uploaded_file`, `description`, `status`, `created_at`, `update_at`) VALUES
(55, 211179, 1054, 'tabel relasi 2.jpg', 'edit captionssszzz', 'ontime', '2023-06-25 03:13:24', '2023-06-25 03:13:24'),
(56, 211175, 1055, 'JURNAL DAMIN KELP 6.docx', '', 'ontime', '2023-06-24 17:23:59', '2023-06-24 17:23:59'),
(57, 211180, 1054, '56.docx', '', 'ontime', '2023-06-24 17:31:14', '2023-06-24 17:31:14');

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
(211175, 'Nadia Nur Saida', 'nadianursaida88', 'nadianursaida88@gmail.com', '$2b$10$1LS3T89FzlSe9k5GkCx30OMWnFw/U5n9Za2nuV91EqPq/6i0VcC7e', 1, 'C:\\fakepath\\The role of information and communication technology in encountering.pdf', '2023-06-24 03:01:56', '2023-06-24 03:01:56'),
(211179, 'Sarah Permata Sari', 'sarahpermata', 'sarah123@gmail.com', '$2b$10$dPnmo/PkUG9YPyhWa07gk.Gz4hnr9bRZ4ksbt.PQTIevyVIeoEM4S', 1, 'picture', '2023-06-24 05:15:01', '2023-06-24 05:15:01'),
(211180, 'Slamet Arif Maulana', 'slametam', 'slametam1@gmail.com', '$2b$10$IpG31Ld43wUiErt83ESAzuonUwA0ahCh04xKFEuAauoK/0aV2Q9Ny', 1, 'picture', '2023-06-24 17:30:50', '2023-06-24 17:30:50');

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
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1081;

--
-- AUTO_INCREMENT untuk tabel `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=211181;

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
