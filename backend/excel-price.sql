-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.27-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for excel-price
CREATE DATABASE IF NOT EXISTS `excel-price` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `excel-price`;

-- Dumping structure for table excel-price.maingroup
CREATE TABLE IF NOT EXISTS `maingroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table excel-price.maingroup: ~14 rows (approximately)
DELETE FROM `maingroup`;
INSERT INTO `maingroup` (`id`, `name`) VALUES
	(1, 'T60'),
	(2, 'T70'),
	(3, 'Curtain Controllers'),
	(4, 'Winches'),
	(5, 'Curtain Fittinqs'),
	(6, 'Hoists'),
	(7, 'Pulleys'),
	(8, 'Counterwieghts'),
	(9, 'Wire Ropes'),
	(10, 'Suspension'),
	(11, 'Barrels & Fittings'),
	(12, 'Swivel Action'),
	(13, 'Scenery Fittings'),
	(14, 'Weights'),
	(15, 'Help');

-- Dumping structure for table excel-price.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `group` int(11) DEFAULT NULL,
  `subGroup` int(11) DEFAULT NULL,
  `price` varchar(11) DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `maxDiscount` float DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `usage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table excel-price.products: ~2 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `code`, `description`, `group`, `subGroup`, `price`, `weight`, `maxDiscount`, `image`, `usage`) VALUES
	(1, '11568', 'T60 Carrier Ballraced For Swivel Arm Braked', 1, 1, '193.40', 0.76, 0.4, NULL, NULL),
	(2, '03752', 'T60 Carrier Master Ballraced Straight / Curved Track (per 2)', 1, 1, '83.81', 0.46, 0.4, NULL, NULL),
	(3, '01170', 'T70 Bracket Face Fixing (per 2)', 2, 5, '39.84', 1.3, 0.4, NULL, NULL),
	(4, '10956', 'T70 Bracket \'Z\' Ceiling Fix To Stud (per 2)', 2, 5, '45.64', 1.3, 0.4, NULL, NULL),
	(5, '11757', 'Universal Girder Fixing Clamp 75 - 150mm (per 2)', 2, 5, '60.79', 0.89, 0.4, NULL, NULL),
	(6, '08326', 'DGH10 (Single Speed 1ph) 10 m Travel With Remote', 3, 6, '2269.73', 35, 0.15, NULL, NULL),
	(7, '08327', 'DGH10 (Single Speed 3ph) 10m Travel With Remote', 3, 6, '2269.73', 35, 0.15, NULL, NULL),
	(8, '03684', 'Remote Push Button Station 0-C-S', 3, 8, '155.24', 0.83, 0.15, NULL, NULL);

-- Dumping structure for table excel-price.subgroup
CREATE TABLE IF NOT EXISTS `subgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `mainGroup` int(11) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table excel-price.subgroup: ~5 rows (approximately)
DELETE FROM `subgroup`;
INSERT INTO `subgroup` (`id`, `name`, `mainGroup`, `notes`) VALUES
	(1, 'Carriers', 1, 'Carriers can be fabricated to suit all our range of tracks to carry lights, scenery, camera equipment and curtains.'),
	(2, 'Pulleys', 1, 'Contact us with any diversion requirements on any operation of track.'),
	(3, 'Accessories', 1, 'We offer a full range of accessories for all of our curtain tracks.'),
	(4, 'Curved Track Haul', 1, 'Our new simple per mtr price makes it easier to cost your special requirements more accurately. Multiply the run of your curve by our mtr price. (Runs of less then a mtr charged at 1 mtr run. Max run 3mtr)'),
	(5, 'Fixings', 2, 'We do a full range of fixings for all our tracks. Contact us with any special fixing requirements.'),
	(6, 'DGH10', 3, 'A full range of Curtain Controllers for every application. Contact us for our full DynaGlide literature.'),
	(7, 'DGH20', 3, 'A full range of Curtain Controllers for every application. Contact us for our full DynaGlide literature.'),
	(8, 'Remotes', 3, 'A full range of Curtain Controllers for every application. Contact us for our full DynaGlide literature.'),
	(9, 'Accessories', 3, 'A full range of is available for our DynaGlide controller. Contact us for literature.');

-- Dumping structure for table excel-price.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `company` varchar(50) DEFAULT NULL,
  `discount` float DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table excel-price.users: ~0 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `email`, `password`, `name`, `company`, `discount`) VALUES
	(10, 'test@gmail.com', '$2b$10$E9RhUdRonK.xaMqVOvBsSeF4dLrpNDgdVXadmqn4iDLioSj/vpHom', 'Test', 'company', 0),
	(16, 'test1@gmail.com', '$2b$10$jnchg1Esjumyml5bJuQIBO1dfNhDNhULeegWqf/WPKp6QgG1k5VnS', 'Test', 'company', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
