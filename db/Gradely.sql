-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : ven. 28 mars 2025 à 14:18
-- Version du serveur : 11.6.2-MariaDB-ubu2404
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `Gradely`
--

-- --------------------------------------------------------

--
-- Structure de la table `CAHIER_DE_TEXTE`
--

CREATE TABLE `CAHIER_DE_TEXTE` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `CAHIER_DE_TEXTE`
--

INSERT INTO `CAHIER_DE_TEXTE` (`id`, `description`, `date`) VALUES
(1, 'Faire le devoir de Maths', '2025-09-23'),
(2, 'Faire le devoir de Français', '2025-09-27'),
(3, 'Faire le devoir de Sciences', '2025-10-01'),
(4, 'Faire le devoir de NSI', '2025-02-24'),
(6, 'NOUVEAU CAHIER', '2025-02-24'),
(7, 'PUTAIN DE CAHIER', '2024-01-01'),
(8, 'PUTAIN DE CAHIER', '2024-01-01'),
(9, 'PUTAIN DE CAHIER', '2024-01-01'),
(10, 'PUTAIN DE CAHIER', '2024-01-01');

-- --------------------------------------------------------

--
-- Structure de la table `CLASSE`
--

CREATE TABLE `CLASSE` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `niveau` varchar(50) NOT NULL,
  `annee_scolaire` varchar(9) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `CLASSE`
--

INSERT INTO `CLASSE` (`id`, `name`, `niveau`, `annee_scolaire`, `created_at`, `updated_at`) VALUES
(1, 'Classe A', '6ème', '2024-2025', '2025-02-22', '2025-02-22'),
(2, 'Classe B', '5ème', '2024-2025', '2025-02-22', '2025-02-22'),
(3, 'Classe C', '4ème', '2024-2025', '2025-02-22', '2025-02-22'),
(4, 'Classe D', '3ème', '2024-2025', '2025-02-22', '2025-02-22');

-- --------------------------------------------------------

--
-- Structure de la table `CLASSE_CAHIER_TEXTE`
--

CREATE TABLE `CLASSE_CAHIER_TEXTE` (
  `id_CLASSE` int(11) NOT NULL,
  `id_CAHIER_DE_TEXTE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `CLASSE_CAHIER_TEXTE`
--

INSERT INTO `CLASSE_CAHIER_TEXTE` (`id_CLASSE`, `id_CAHIER_DE_TEXTE`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(2, 6),
(1, 7);

-- --------------------------------------------------------

--
-- Structure de la table `CLASSE_DEVOIR`
--

CREATE TABLE `CLASSE_DEVOIR` (
  `id_CLASSE` int(11) NOT NULL,
  `id_DEVOIR` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `CLASSE_DEVOIR`
--

INSERT INTO `CLASSE_DEVOIR` (`id_CLASSE`, `id_DEVOIR`) VALUES
(1, 1),
(1, 2),
(2, 2),
(1, 3),
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `DEVOIR`
--

CREATE TABLE `DEVOIR` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `DEVOIR`
--

INSERT INTO `DEVOIR` (`id`, `title`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Devoir Mathématiques 1', 'Devoir sur les fonctions', 'En cours', '2025-02-01', '2025-02-01'),
(2, 'Devoir Physique 1', 'Exercice sur les lois de Newton', 'En cours', '2025-02-02', '2025-02-02'),
(3, 'Devoir Histoire 1', 'Réflexion sur la Révolution Française', 'En cours', '2025-02-03', '2025-02-03');

-- --------------------------------------------------------

--
-- Structure de la table `MATIERE`
--

CREATE TABLE `MATIERE` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `MATIERE`
--

INSERT INTO `MATIERE` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Mathématiques', 'Matière de mathématiques', '2025-02-23', '2025-02-23'),
(2, 'Physique', 'Matière de physique', '2025-02-23', '2025-02-23');

-- --------------------------------------------------------

--
-- Structure de la table `NOTES`
--

CREATE TABLE `NOTES` (
  `id` int(11) NOT NULL,
  `note_value` int(2) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `NOTES`
--

INSERT INTO `NOTES` (`id`, `note_value`, `created_at`, `updated_at`) VALUES
(3, 14, '2025-02-24', '2025-02-24'),
(4, 15, '2025-02-24', '2025-02-24');

-- --------------------------------------------------------

--
-- Structure de la table `USER`
--

CREATE TABLE `USER` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `phone_number` int(11) NOT NULL,
  `adress` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `USER`
--

INSERT INTO `USER` (`id`, `name`, `surname`, `email`, `password`, `phone_number`, `adress`, `role`, `created_at`, `updated_at`) VALUES
(3, 'TEST', 'TEST', 'test@gmail.com', '$2b$10$HusBuPbJgHL0d6GZgqW9fOGR4wwdW7VfqVN6fuT/f/WlW6CwvNroe', 102030405, '7 rue du Test', 'user', '2025-03-24 13:08:59', '2025-03-25 10:01:00'),
(18, 'John', 'Doe', 'johndoe@gmail.com', '$2b$10$CYWfnAs24lCrb6ocjl4XUeq5t2d8JR.mD2i0Ri50S8cNm1HJXs032', 102030405, '3 rue de la fontaine', 'user', '2025-03-23 15:53:49', '2025-03-23 15:55:07'),
(19, 'Marie', 'Dupont', 'mariedupont@gmail.com', '$2b$10$IjPn4l4qASiOkm1.RhGqIOUQ8UuDbuUiLf5HKvThiZ..vzHTl01Ka', 102030405, '5 boulevard victor hugo', 'admin', '2025-03-23 15:54:59', '2025-03-23 15:54:59'),
(20, 'caca', 'pipiCACA', 'pipicaca@gmail.com', '$2b$10$/3X1VWEI9N6B8ZF9jqcLUu9fRYCHM3rC.YaA4kNx0zW3/6Q8OQwxa', 102030405, '4 rue jean de la fontaine', 'user', '2025-03-23 15:55:44', '2025-03-23 15:55:44'),
(21, 'tete', 'tetettt', 'tetetete@gmail.com', '$2b$10$d2UbsOv.8oNs5EsDM7kG9ublgBtP6wXp44GwFv8j8JYVzU.CDvtyK', 102030405, 'tetetet', 'user', '2025-03-23 16:02:01', '2025-03-23 16:02:01'),
(22, 'fdsfsfd', 'fsdfsf', 'fsfsfd@gmail.com', '$2b$10$eXpn/g.L5TTqNqTHMtb1MO22NDrjrDEl9aeBZ/7ouuse7FMYkl9Hi', 102030405, 'zrrezrz', 'user', '2025-03-23 16:05:18', '2025-03-23 16:05:18'),
(23, 'fdsfsd', 'fsdfdsf', 'fsdfdsf@gmail.com', '$2b$10$mOGNI1psgr/Q73hTTUQp.uaYFlx/bYp.umImt7OuHb5Aj0heJkJwy', 102030405, 'ffsdfds', 'fsdfsf', '2025-03-23 16:07:33', '2025-03-23 16:07:33'),
(24, 'zezeze', 'zezeze', 'zezeze@gmail.com', '$2b$10$W0nyRFLJFIC5JKlHqHJawekXwefGyc271zWuPmDg21buifSbZGJUG', 102030405, 'ZEZEZE', 'zezez', '2025-03-23 16:10:48', '2025-03-23 16:10:48'),
(25, 'fdsfsfd', 'fdsfsfa', 'fdsfss@gmail.com', '$2b$10$G5DB/zJN7Tbs.4vZkZsj1..0V4RLqQ36YElKKdUNqM75Yi4ww7DY.', 102030405, 'fsfdsfsd', 'fdsfdsf', '2025-03-23 16:17:02', '2025-03-23 16:17:02'),
(26, 'EEEEEEEE', 'EEEEEEE', 'EEEEEE@gmail.com', '$2b$10$gW4ePp3rO0eiCM7441aNqumil0TBmIPKLRBDLGWH7qGQHnC9mhFF.', 102030405, '3 rue de la rue', 'user', '2025-03-24 10:39:43', '2025-03-24 10:39:43'),
(27, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA@gmail.com', '$2b$10$FbCqSnqAVqw/VUP9NKlb1.YAHD9wwEH.nPQI4HoGGNle6Xuy2zbnG', 102030405, '3 rue de la rue', 'user', '2025-03-24 11:09:44', '2025-03-24 11:09:44');

-- --------------------------------------------------------

--
-- Structure de la table `USER_CLASSE`
--

CREATE TABLE `USER_CLASSE` (
  `id_USER` int(11) NOT NULL,
  `id_CLASSE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `USER_NOTES`
--

CREATE TABLE `USER_NOTES` (
  `id_USER` int(11) NOT NULL,
  `id_NOTES` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `USER_NOTES`
--

INSERT INTO `USER_NOTES` (`id_USER`, `id_NOTES`) VALUES
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `USER_VIE_SCOLAIRE`
--

CREATE TABLE `USER_VIE_SCOLAIRE` (
  `id_USER` int(11) NOT NULL,
  `id_VIE_SCOLAIRE` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `VIE_SCOLAIRE`
--

CREATE TABLE `VIE_SCOLAIRE` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `sanction` varchar(50) NOT NULL,
  `retard` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `VIE_SCOLAIRE`
--

INSERT INTO `VIE_SCOLAIRE` (`id`, `type`, `description`, `date`, `sanction`, `retard`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Retard', 'Retard de 15 minutes', '2025-02-25', 'Avertissement', 'Oui', 'Actif', '2025-02-25', '2025-02-25'),
(2, 'Absence', 'Absence non justifiée', '2025-02-20', 'Convocation parent', 'Non', 'Actif', '2025-02-25', '2025-02-25'),
(3, 'Sanction', 'Exclusion temporaire', '2025-02-15', 'Exclusion 3 jours', 'Non', 'Terminé', '2025-02-25', '2025-02-25');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `CAHIER_DE_TEXTE`
--
ALTER TABLE `CAHIER_DE_TEXTE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `CLASSE`
--
ALTER TABLE `CLASSE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `CLASSE_CAHIER_TEXTE`
--
ALTER TABLE `CLASSE_CAHIER_TEXTE`
  ADD PRIMARY KEY (`id_CLASSE`,`id_CAHIER_DE_TEXTE`),
  ADD KEY `id_CAHIER_DE_TEXTE` (`id_CAHIER_DE_TEXTE`);

--
-- Index pour la table `CLASSE_DEVOIR`
--
ALTER TABLE `CLASSE_DEVOIR`
  ADD PRIMARY KEY (`id_CLASSE`,`id_DEVOIR`),
  ADD KEY `id_DEVOIR` (`id_DEVOIR`);

--
-- Index pour la table `DEVOIR`
--
ALTER TABLE `DEVOIR`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `MATIERE`
--
ALTER TABLE `MATIERE`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `NOTES`
--
ALTER TABLE `NOTES`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `USER`
--
ALTER TABLE `USER`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `USER_CLASSE`
--
ALTER TABLE `USER_CLASSE`
  ADD PRIMARY KEY (`id_USER`,`id_CLASSE`),
  ADD KEY `id_CLASSE` (`id_CLASSE`);

--
-- Index pour la table `USER_NOTES`
--
ALTER TABLE `USER_NOTES`
  ADD PRIMARY KEY (`id_USER`,`id_NOTES`),
  ADD KEY `id_NOTES` (`id_NOTES`);

--
-- Index pour la table `USER_VIE_SCOLAIRE`
--
ALTER TABLE `USER_VIE_SCOLAIRE`
  ADD PRIMARY KEY (`id_USER`,`id_VIE_SCOLAIRE`),
  ADD KEY `id_VIE_SCOLAIRE` (`id_VIE_SCOLAIRE`);

--
-- Index pour la table `VIE_SCOLAIRE`
--
ALTER TABLE `VIE_SCOLAIRE`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `CAHIER_DE_TEXTE`
--
ALTER TABLE `CAHIER_DE_TEXTE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `CLASSE`
--
ALTER TABLE `CLASSE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `DEVOIR`
--
ALTER TABLE `DEVOIR`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `MATIERE`
--
ALTER TABLE `MATIERE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `NOTES`
--
ALTER TABLE `NOTES`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `USER`
--
ALTER TABLE `USER`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `VIE_SCOLAIRE`
--
ALTER TABLE `VIE_SCOLAIRE`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `CLASSE_CAHIER_TEXTE`
--
ALTER TABLE `CLASSE_CAHIER_TEXTE`
  ADD CONSTRAINT `CLASSE_CAHIER_TEXTE_ibfk_1` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `CLASSE_CAHIER_TEXTE_ibfk_2` FOREIGN KEY (`id_CAHIER_DE_TEXTE`) REFERENCES `CAHIER_DE_TEXTE` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `CLASSE_DEVOIR`
--
ALTER TABLE `CLASSE_DEVOIR`
  ADD CONSTRAINT `CLASSE_DEVOIR_ibfk_1` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `CLASSE_DEVOIR_ibfk_2` FOREIGN KEY (`id_DEVOIR`) REFERENCES `DEVOIR` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `USER_CLASSE`
--
ALTER TABLE `USER_CLASSE`
  ADD CONSTRAINT `USER_CLASSE_ibfk_1` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USER_CLASSE_ibfk_2` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `USER_NOTES`
--
ALTER TABLE `USER_NOTES`
  ADD CONSTRAINT `USER_NOTES_ibfk_1` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USER_NOTES_ibfk_2` FOREIGN KEY (`id_NOTES`) REFERENCES `NOTES` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `USER_VIE_SCOLAIRE`
--
ALTER TABLE `USER_VIE_SCOLAIRE`
  ADD CONSTRAINT `USER_VIE_SCOLAIRE_ibfk_1` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `USER_VIE_SCOLAIRE_ibfk_2` FOREIGN KEY (`id_VIE_SCOLAIRE`) REFERENCES `VIE_SCOLAIRE` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
