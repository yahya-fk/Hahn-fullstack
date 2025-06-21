-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour hahn-db
CREATE DATABASE IF NOT EXISTS `hahn-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hahn-db`;

-- Listage de la structure de table hahn-db. role
CREATE TABLE IF NOT EXISTS `role` (
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table hahn-db.role : ~2 rows (environ)
INSERT INTO `role` (`role`) VALUES
	('ADMIN'),
	('ORDINARY');

-- Listage de la structure de table hahn-db. user
CREATE TABLE IF NOT EXISTS `user` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table hahn-db.user : ~1 rows (environ)
INSERT INTO `user` (`username`, `password`, `email`, `first_name`, `last_name`) VALUES
	('fkyahya', '$2a$10$XNcBMhL779YQFdvC8RnCLOY6qUrBlo9dBZQTUtchtUdjYiQW4vpaq', 'fekyah0@gmail.com', 'Yahya123', 'FEKRANE');

-- Listage de la structure de table hahn-db. user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_username` varchar(255) NOT NULL,
  `roles_role` varchar(255) NOT NULL,
  KEY `FKdt1fca9hsi6b8t4x9l1ds0tuj` (`roles_role`),
  KEY `FK1misndtpfm9hx3ttvixdus8d1` (`user_username`),
  CONSTRAINT `FK1misndtpfm9hx3ttvixdus8d1` FOREIGN KEY (`user_username`) REFERENCES `user` (`username`),
  CONSTRAINT `FKdt1fca9hsi6b8t4x9l1ds0tuj` FOREIGN KEY (`roles_role`) REFERENCES `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table hahn-db.user_roles : ~2 rows (environ)
INSERT INTO `user_roles` (`user_username`, `roles_role`) VALUES
	('fkyahya', 'ORDINARY'),
	('fkyahya', 'ADMIN');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
