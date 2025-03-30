-- Script d'initialisation de la base Gradely
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `Gradely` CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci;
USE `Gradely`;

-- Désactivation des contraintes de clé étrangère temporairement
SET FOREIGN_KEY_CHECKS = 0;


-- --------------------------------------------------------
-- Structure de la table `USER`
DROP TABLE IF EXISTS `USER`;
CREATE TABLE `USER` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `CLASSE` (modifiée pour utiliser timestamp)
DROP TABLE IF EXISTS `CLASSE`;
CREATE TABLE `CLASSE` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `niveau` varchar(50) NOT NULL,
  `annee_scolaire` varchar(9) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `MATIERE`
DROP TABLE IF EXISTS `MATIERE`;
CREATE TABLE `MATIERE` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `CAHIER_DE_TEXTE`
DROP TABLE IF EXISTS `CAHIER_DE_TEXTE`;
CREATE TABLE `CAHIER_DE_TEXTE` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `DEVOIR`
DROP TABLE IF EXISTS `DEVOIR`;
CREATE TABLE `DEVOIR` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'En cours',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `NOTES`
DROP TABLE IF EXISTS `NOTES`;
CREATE TABLE `NOTES` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note_value` int(2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Structure de la table `VIE_SCOLAIRE`
DROP TABLE IF EXISTS `VIE_SCOLAIRE`;
CREATE TABLE `VIE_SCOLAIRE` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `sanction` varchar(50) NOT NULL,
  `retard` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Actif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Tables de liaison
CREATE TABLE IF NOT EXISTS `CLASSE_CAHIER_TEXTE` (
  `id_CLASSE` int(11) NOT NULL,
  `id_CAHIER_DE_TEXTE` int(11) NOT NULL,
  PRIMARY KEY (`id_CLASSE`,`id_CAHIER_DE_TEXTE`),
  KEY `id_CAHIER_DE_TEXTE` (`id_CAHIER_DE_TEXTE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `CLASSE_DEVOIR` (
  `id_CLASSE` int(11) NOT NULL,
  `id_DEVOIR` int(11) NOT NULL,
  PRIMARY KEY (`id_CLASSE`,`id_DEVOIR`),
  KEY `id_DEVOIR` (`id_DEVOIR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `USER_CLASSE` (
  `id_USER` int(11) NOT NULL,
  `id_CLASSE` int(11) NOT NULL,
  PRIMARY KEY (`id_USER`,`id_CLASSE`),
  KEY `id_CLASSE` (`id_CLASSE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `USER_NOTES` (
  `id_USER` int(11) NOT NULL,
  `id_NOTES` int(11) NOT NULL,
  PRIMARY KEY (`id_USER`,`id_NOTES`),
  KEY `id_NOTES` (`id_NOTES`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

CREATE TABLE IF NOT EXISTS `USER_VIE_SCOLAIRE` (
  `id_USER` int(11) NOT NULL,
  `id_VIE_SCOLAIRE` int(11) NOT NULL,
  PRIMARY KEY (`id_USER`,`id_VIE_SCOLAIRE`),
  KEY `id_VIE_SCOLAIRE` (`id_VIE_SCOLAIRE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------
-- Données initiales
INSERT INTO `USER` (`name`, `surname`, `email`, `password`, `phone_number`, `address`, `role`) VALUES
('Admin', 'System', 'admin@gradely.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrYr7sHEXpB6DiqVqMFN3FutH/US2mG', '0102030405', '1 Rue Admin', 'admin'),
('Teacher', 'Demo', 'teacher@gradely.com', '$2a$10$XuTnQN6X7yEn9i9Gj3JTwu5YQ6qQN4tZz7bB2V8Lk9J1Jc5m6J7Xe', '0102030405', '2 Rue Teacher', 'teacher'),
('Student', 'Demo', 'student@gradely.com', '$2a$10$ZzAAzzZZZzZzZzZzZzZzu.ZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz', '0102030405', '3 Rue Student', 'user');


INSERT INTO `CLASSE` (`name`, `niveau`, `annee_scolaire`) VALUES
('Classe A', '6ème', '2024-2025'),
('Classe B', '5ème', '2024-2025'),
('Classe C', '4ème', '2024-2025'),
('Classe D', '3ème', '2024-2025');

INSERT INTO `MATIERE` (`name`, `description`) VALUES
('Mathématiques', 'Algèbre et géométrie'),
('Français', 'Littérature et grammaire'),
('Histoire-Géographie', 'Histoire mondiale et géographie'),
('Sciences', 'Physique et chimie');

INSERT INTO `CAHIER_DE_TEXTE` (`description`, `date`) VALUES
('Devoir de mathématiques à rendre', '2025-04-15'),
('Lecture obligatoire pour français', '2025-04-20'),
('Préparation examen histoire', '2025-04-25');

INSERT INTO `DEVOIR` (`title`, `description`, `status`) VALUES
('Devoir Maison 1', 'Exercices de géométrie', 'En cours'),
('Dissertation', 'Commentaire de texte', 'En cours'),
('Exposé', 'Présentation historique', 'Terminé');

-- --------------------------------------------------------
-- Contraintes de clé étrangère
ALTER TABLE `CLASSE_CAHIER_TEXTE`
  ADD CONSTRAINT `fk_classe_cahier_classe` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_classe_cahier_cahier` FOREIGN KEY (`id_CAHIER_DE_TEXTE`) REFERENCES `CAHIER_DE_TEXTE` (`id`) ON DELETE CASCADE;

ALTER TABLE `CLASSE_DEVOIR`
  ADD CONSTRAINT `fk_classe_devoir_classe` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_classe_devoir_devoir` FOREIGN KEY (`id_DEVOIR`) REFERENCES `DEVOIR` (`id`) ON DELETE CASCADE;

ALTER TABLE `USER_CLASSE`
  ADD CONSTRAINT `fk_user_classe_user` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_classe_classe` FOREIGN KEY (`id_CLASSE`) REFERENCES `CLASSE` (`id`) ON DELETE CASCADE;

ALTER TABLE `USER_NOTES`
  ADD CONSTRAINT `fk_user_notes_user` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_notes_notes` FOREIGN KEY (`id_NOTES`) REFERENCES `NOTES` (`id`) ON DELETE CASCADE;

ALTER TABLE `USER_VIE_SCOLAIRE`
  ADD CONSTRAINT `fk_user_vie_scolaire_user` FOREIGN KEY (`id_USER`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_vie_scolaire_vie` FOREIGN KEY (`id_VIE_SCOLAIRE`) REFERENCES `VIE_SCOLAIRE` (`id`) ON DELETE CASCADE;

-- Réactivation des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;