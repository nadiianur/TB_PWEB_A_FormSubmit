-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Bulan Mei 2023 pada 19.10
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
-- Database: `studyin`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `forms`
--

CREATE TABLE `forms` (
  `form_id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `tittle` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `forms`
--

INSERT INTO `forms` (`form_id`, `user_id`, `tittle`, `description`, `created_at`, `update_at`) VALUES
(1, '1001', 'form pengumpulan progres pweb', 'ini form pengumpulan tugas progress pweb', '2023-04-10 17:30:31', '2023-04-10 17:30:31'),
(2, '101', 'upload KTP warga Lubuk Begalung', 'silahkan upload KTP per KK disini', '2023-04-25 09:21:20', '2023-04-25 09:21:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `submissions`
--

CREATE TABLE `submissions` (
  `user_id` varchar(255) NOT NULL,
  `form_id` varchar(255) NOT NULL,
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
  `user_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `accessToken` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `active`, `avatar`, `accessToken`, `created_at`, `update_at`) VALUES
('100', 'nadia12', 'nadia12@gmail.com', '12345', 1, 'picture', 'xxx', '2023-04-24 05:39:47', '2023-04-10 17:24:26'),
('101', 'nadds', 'nadd@gmail.com', '12345', 1, 'picture', '', '2023-04-10 17:21:53', '2023-04-10 17:21:53'),
('amalia', 'amalia', 'amal@gmail.com', '111', 1, 'picture', '', '2023-04-10 08:28:07', '2023-04-10 08:28:07'),
('nadia', 'nadia', 'naida22@gmail.com', '12345', 1, 'sfjkgl', '', '2023-04-08 16:06:40', '2023-04-08 16:06:40'),
('syadzaa', 'syadzaa_', 'syadzaa22@gmail.com', 'syadza', 1, 'fhkjsd', '', '2023-04-08 15:57:04', '2023-04-08 15:57:04');

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
  ADD PRIMARY KEY (`user_id`,`form_id`),
  ADD KEY `user_id` (`user_id`,`form_id`);

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
  MODIFY `form_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
