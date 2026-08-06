-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: navsa
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basket_shipping`
--

DROP TABLE IF EXISTS `basket_shipping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `basket_shipping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `container_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `port_id` int(11) NOT NULL,
  `total_value` decimal(12,2) DEFAULT 0.00,
  `total_weight` decimal(12,2) DEFAULT 0.00,
  `total_volume` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_basket_container` (`container_id`),
  KEY `fk_basket_country` (`country_id`),
  KEY `fk_basket_port` (`port_id`),
  CONSTRAINT `fk_basket_container` FOREIGN KEY (`container_id`) REFERENCES `shipping_containers` (`id`),
  CONSTRAINT `fk_basket_country` FOREIGN KEY (`country_id`) REFERENCES `shipping_countries` (`id`),
  CONSTRAINT `fk_basket_port` FOREIGN KEY (`port_id`) REFERENCES `shipping_ports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basket_shipping`
--

LOCK TABLES `basket_shipping` WRITE;
/*!40000 ALTER TABLE `basket_shipping` DISABLE KEYS */;
/*!40000 ALTER TABLE `basket_shipping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'YOUNG\'S',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(2,'NESCAFE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(3,'MCVITIES',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(4,'BISTO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(5,'RED BULL',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(6,'TETLEY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(7,'LINDT & SPRUGALI',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(8,'NANDO\'S',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(9,'CANDY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(10,'GOLDEN WONDER',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(11,'BAZOOKA',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(12,'JACK DANIELS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(13,'FRUIT SHOOT',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(14,'POWERADE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(15,'LUCOZADE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(16,'GREEN\'S',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(17,'KELLOGGS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(18,'BEBETO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(19,'HEINZ',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(20,'SNICKERS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(21,'CADBURY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(22,'CHUPA CHUP',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(23,'HARTLEYS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(24,'JOHN WEST',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(25,'STARBUCKS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(26,'SHEBA',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(27,'Wafflemeister',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(28,'FELLOWS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(29,'GALAXY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(30,'HARIBO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(31,'JACK',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(32,'KNOPPERS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(33,'PROPER',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(34,'RUBICON',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(35,'BEANIES',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(36,'JELLY BELLY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(37,'CHEWITS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(38,'BRAIN BLASTERZ',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(39,'FORCE PROTEIN',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(40,'CACAOLAT',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(41,'FILIPPO BERIO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(42,'CARNATION',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(43,'DEL MON',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(44,'BARRATTS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(45,'WHAM EXTREME',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(46,'ZODIAC',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(47,'Huntley & Palmer',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(48,'EATREAL',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(49,'GRENADE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(50,'FAZER',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(51,'PATHOS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(52,'WALKERS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(53,'WARRIOR',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(54,'MULLER',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(55,'RITTER',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(56,'WEETABIX',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(57,'BAHLSEN',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(58,'CAWSTON',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(59,'DIABLO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(60,'VIDAL',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(61,'DOLE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(62,'FUEL10K',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(63,'TYPHOO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(64,'GLENGETTIE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(65,'HORLICKS',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(66,'FINI',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(67,'BOUNTY',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(68,'FREEZ',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(69,'SCORE',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(70,'ELIZABETH',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(71,'TASSIMO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(72,'BENS ORIGINAL',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(73,'ROLO',NULL,1,0,'2026-08-06 02:23:42','2026-08-06 02:23:42'),(74,'MCDOUGALL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(75,'CAWOODS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(76,'WOW HYDRATE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(77,'NESTLE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(78,'PRIME',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(79,'YUBI',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(80,'KIDSMANIA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(81,'BAILEYS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(82,'QUALITY STREET',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(83,'CATHEDRAL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(84,'CHEERY CHEWS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(85,'SKIPS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(86,'REESES',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(87,'HELL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(88,'MEGA BRAIN',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(89,'MILLIONS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(90,'BAREBELLS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(91,'FELIX',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(92,'VITA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(93,'SEABROOK',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(94,'HUEL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(95,'CELTIC',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(96,'MILO',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(97,'P',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(98,'BEECHS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(99,'MILKA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(100,'MCVITIES CAKES',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(101,'TATE & LYLE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(102,'LORENZ',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(103,'AQUAFRESH',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(104,'MORNFLAKE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(105,'PASTRI SHOP',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(106,'TROPICAL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(107,'BOB SNAIL',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(108,'CLEAN UPS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(109,'TENZING',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(110,'CROWN',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(111,'DYLON',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(112,'BUXTON',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(113,'PERRIER',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(114,'SARSONS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(115,'FREEDOM',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(116,'KULANA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(117,'KETTLE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(118,'TROPICANA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(119,'POT NOODLES',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(120,'MUNCHKINGS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(121,'LEVI ROOTS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(122,'Sweetzone',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(123,'RIVA FOOD',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(124,'EASY',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(125,'YAZOO',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(126,'TAKIS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(127,'PIPERS',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(128,'C4 ENERGY',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(129,'PHD',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(130,'TIAMA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(131,'BAKEHOUSE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(132,'DR JOHNSON',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(133,'UFIT',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(134,'GOLDENFRY',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(135,'POPHOUSE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(136,'DASH',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(137,'GNAW',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(138,'MARETTI',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(139,'ULTREX',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(140,'FERRERO ROCHER',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(141,'NESQUIK',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(142,'NATURE\'S BOUNTY',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(143,'GREENSHIELD',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(144,'MOO FREE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(145,'COMFORT',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(146,'ARIZONA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(147,'STUTE',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(148,'Nakd',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(149,'YORKSHIRE TEA',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(150,'LEES',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(151,'CLEAN & CLEAR',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(152,'BIP',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(153,'LYLES',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(154,'PIP & NUT',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(155,'Feedwell',NULL,1,0,'2026-08-06 02:23:43','2026-08-06 02:23:43'),(156,'DUMMY BRAND',NULL,1,0,'2026-08-06 07:08:02','2026-08-06 07:08:02'),(157,'DUMMY SWEETS',NULL,1,0,'2026-08-06 07:08:02','2026-08-06 07:08:02'),(158,'DUMMY FOODS',NULL,1,0,'2026-08-06 07:08:02','2026-08-06 07:08:02'),(159,'DUMMY OIL',NULL,1,0,'2026-08-06 07:08:02','2026-08-06 07:08:02');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Chocolates',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(2,'Groceries',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(3,'Confectionery',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(4,'Crisps & Snacks',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(5,'Cold and Hot Beverages',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(6,'Biscuits',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(7,'Seasonal',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(8,'Chilled Items',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(9,'Frozen',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(10,'Baby and Kids',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(11,'Health and Personal Care',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(12,'Pet Care and Food',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57'),(13,'Cleaning & Households',NULL,1,0,'2026-07-01 10:05:40','2026-07-25 08:51:57');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_mappings`
--

DROP TABLE IF EXISTS `category_mappings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_mappings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_desc` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `category_mappings_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `category_mappings_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_mappings`
--

LOCK TABLES `category_mappings` WRITE;
/*!40000 ALTER TABLE `category_mappings` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_mappings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_accounts`
--

DROP TABLE IF EXISTS `customer_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `vat_number` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `credit_limit` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customer_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_accounts`
--

LOCK TABLES `customer_accounts` WRITE;
/*!40000 ALTER TABLE `customer_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_details`
--

DROP TABLE IF EXISTS `customer_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `company_registration_number` varchar(100) DEFAULT NULL,
  `vat_number` varchar(100) DEFAULT NULL,
  `customer_group` varchar(50) DEFAULT NULL,
  `trading_years` varchar(255) DEFAULT NULL,
  `business_nature` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `director_name` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `registered_phone` varchar(30) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `whatsapp_offers_phone` varchar(50) DEFAULT NULL,
  `whatsapp_offers_opt_in` tinyint(1) NOT NULL DEFAULT 0,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_email` varchar(255) DEFAULT NULL,
  `other_wholesalers` varchar(255) DEFAULT NULL,
  `average_order_value` varchar(255) DEFAULT NULL,
  `turnover` varchar(255) DEFAULT NULL,
  `import_full_containers` varchar(255) DEFAULT NULL,
  `brands_interested` text DEFAULT NULL,
  `categories_interested` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `eori_number` varchar(255) DEFAULT NULL,
  `same_as_billing` tinyint(1) NOT NULL DEFAULT 1,
  `shipping_address_line_1` varchar(255) DEFAULT NULL,
  `shipping_address_line_2` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_province` varchar(255) DEFAULT NULL,
  `shipping_zip_code` varchar(255) DEFAULT NULL,
  `shipping_country` varchar(255) DEFAULT NULL,
  `shipping_telephone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_details_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_details`
--

LOCK TABLES `customer_details` WRITE;
/*!40000 ALTER TABLE `customer_details` DISABLE KEYS */;
INSERT INTO `customer_details` VALUES (1,2,'Mamta','Ashwar','International','India','Owner',NULL,NULL,NULL,'1-3','Wholesale','m.com','Mamta','GBP',NULL,'9999999998',NULL,0,'mm','mn','Khambhalia','Gujarat','361305','m','ashwarmamta22@gmail.com','no','10,000 - 20,000','1,000,000 - 5,000,000','Containers','KitKat','[\"Chocolates\",\"Confectionery\",\"Biscuits\",\"Crisps & Snacks\",\"Cold and Hot Beverages\",\"Chilled Items\"]','er',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-24 14:19:06','2026-07-24 14:19:06'),(2,3,'Vishwa','Ashwar','International','India','Owner',NULL,NULL,NULL,'0-1','Retail','vishuretail.com','Vishwa Ashwar','GBP',NULL,'9999999998',NULL,0,'mmm','MMN','KHAMBHALIA','GUJARAT','361305','MMM','m@gmail.com','No','10,000 - 20,000','0 - 500,000','Containers','KitKat , 7up','[\"Baby and Kids\",\"Chocolates\",\"Confectionery\",\"Groceries\",\"Biscuits\",\"Crisps & Snacks\",\"Chilled Items\",\"Cold and Hot Beverages\"]','98',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-24 15:48:36','2026-07-24 15:48:36'),(3,4,'Mamta','Ashwar','International','India','Owner',NULL,NULL,NULL,'0-1','Traders','mmm.com','Mamta Ashwar','GBP',NULL,'9999999998',NULL,0,'mmm','MMN','KHAMBHALIA','Gujarat','361305','mmm','ashwarmamta9@gmail.com','No','10,000 - 20,000','0 - 500,000','Containers','KitKat , 7up','[\"Chocolates\",\"Biscuits\",\"Cold and Hot Beverages\",\"Chilled Items\",\"Crisps & Snacks\",\"Confectionery\"]','99',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-25 10:11:34','2026-07-25 10:11:34'),(4,5,'TEST','TEST','International','India','Owner','9',NULL,'Group 1','1-2','Wholesale','test.com','Mamta Ashwar','GBP','+91 9999999999','+91 9999999998','+91 9999999998',1,'mmm','mmm mmm','Gandhinagar','Gujarat','382419','m','m@gmail.com','No','┬ú10,000 - ┬ú20,000','1,000,000 - 5,000,000','Containers','KitKat , 7up','[\"Biscuits\",\"Chocolates\",\"Confectionery\",\"Chilled Items\",\"Cold and Hot Beverages\",\"Crisps & Snacks\"]','98',0,'m','m','m','m','m','India','9','2026-07-30 12:58:30','2026-08-01 01:08:00'),(5,6,'m','m','International','India','Director','9',NULL,'Group 1','5+','Online','mmm.com','Mamta Ashwar','GBP','+91 9999999999','+91 9999999998',NULL,1,'mmm','MMN','KHAMBHALIA','GUJARAT','361305','MMM','ashwarmamta9@gmail.com','No','┬ú40,000+','20,000,000 +','Containers','KitKat , 7up','[\"Chocolates\",\"Confectionery\"]','98',0,'m','m','m','m','m','Bahrain','9','2026-07-31 06:28:59','2026-08-01 01:07:53'),(6,7,'Mamta','Ashwar','UK','United Kingdom','Web Administrator','9990008889','99977770403',NULL,'5+','Multiples','m.com','MM','DOLLAR','+44 9999999999','+44 9999999998',NULL,1,'m','m','m','GUJARAT','m','Navsa international','ashwarmamta9@gmail.com','No','┬ú40,000+','20,000,000 +','Pallets','Nestle','[\"Chocolates\",\"Cold and Hot Beverages\"]','mmm999',0,'m','m','m','Gujarat','m','India','9','2026-07-31 12:13:24','2026-07-31 12:13:24'),(7,8,'Vishwa','Ashwar','International','India','Owner','9990008889',NULL,'Group 2','1-2','Retail','v.com','Vishwa Ashwar','GBP','+91 9999999999','+91 9999999998',NULL,1,'m','m','Khambhalia','Gujarat','361305','mmm','ashwarmamta9@gmail.com','No','┬ú40,000+','20,000,000 +','Containers','KitKat','[\"Chocolates\",\"Confectionery\",\"Biscuits\",\"Crisps & Snacks\",\"Chilled Items\",\"Cold and Hot Beverages\"]','9999999',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-01 01:06:52','2026-08-01 01:07:41'),(8,9,'TEST','TEST','International','India','CEO','898989',NULL,NULL,'1-2','Online','test@gmail.com','BM','GBP','+91 9999999999','+91 9999999999',NULL,1,'m','m','Gandhinagar','Gujarat','382419','acc dept','ashwarmamta9@gmail.com','No','┬ú10,000 - ┬ú20,000','┬ú0 - ┬ú500,000','Containers','Cadbury,Kitkat','[\"Chocolates\",\"Confectionery\"]','876890',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-01 11:37:45','2026-08-01 11:37:45');
/*!40000 ALTER TABLE `customer_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `erp_import_logs`
--

DROP TABLE IF EXISTS `erp_import_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `erp_import_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `total_records` int(11) DEFAULT 0,
  `inserted_records` int(11) DEFAULT 0,
  `updated_records` int(11) DEFAULT 0,
  `skipped_records` int(11) NOT NULL DEFAULT 0,
  `failed_records` int(11) DEFAULT 0,
  `imported_by` int(11) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'COMPLETED',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `erp_import_logs`
--

LOCK TABLES `erp_import_logs` WRITE;
/*!40000 ALTER TABLE `erp_import_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `erp_import_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `erp_products_raw`
--

DROP TABLE IF EXISTS `erp_products_raw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `erp_products_raw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_index` varchar(50) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `imported_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `erp_products_raw`
--

LOCK TABLES `erp_products_raw` WRITE;
/*!40000 ALTER TABLE `erp_products_raw` DISABLE KEYS */;
/*!40000 ALTER TABLE `erp_products_raw` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_banners`
--

DROP TABLE IF EXISTS `home_banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `home_banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `position` enum('hero','middle','bottom') NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `image_path` varchar(500) NOT NULL,
  `link_url` varchar(2048) DEFAULT NULL,
  `button_text` varchar(80) DEFAULT NULL,
  `overlay_position` enum('left','center','right') NOT NULL DEFAULT 'left',
  `sort_order` int(10) unsigned NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `home_banners_position_order_index` (`position`,`sort_order`),
  KEY `home_banners_brand_id_index` (`brand_id`),
  CONSTRAINT `home_banners_brand_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_banners`
--

LOCK TABLES `home_banners` WRITE;
/*!40000 ALTER TABLE `home_banners` DISABLE KEYS */;
INSERT INTO `home_banners` VALUES (1,'hero',NULL,'banners/hero/FAWahn78zHOhifiJ5W5P96ndHPpOqu2FI8QBEbZF.jpg',NULL,NULL,'left',1,1,'2026-07-29 16:34:10','2026-08-05 07:04:31'),(2,'hero',NULL,'banners/hero/KRjQ9paPlt0s32yY3a2dkdHfBD9c3KpwFGUVmQM7.jpg',NULL,NULL,'center',2,1,'2026-07-29 16:34:10','2026-08-05 07:04:31'),(3,'hero',NULL,'banners/hero/3zUpJtS0TdPD3eWS1sstzDWxaz0nlKNEZHcRIUyf.jpg',NULL,NULL,'right',3,1,'2026-07-29 16:34:10','2026-08-05 07:04:31'),(4,'middle',NULL,'banners/middle/q8u9piiEBg0PbvFbDOvHES0z6bw158dz1Huwh2A1.jpg',NULL,NULL,'left',1,1,'2026-07-29 16:34:10','2026-07-29 11:27:04'),(5,'middle',NULL,'banners/middle/qjRtLSsamApJWm0BY59zjhqnEX8Uu6O0p8PUzevf.jpg',NULL,NULL,'center',2,1,'2026-07-29 16:34:10','2026-07-29 11:27:04'),(6,'middle',NULL,'banners/middle/tDMfXiBVukVS2wv0QLXvpJDdNKXFlYWHZ64kOPWt.jpg',NULL,NULL,'right',3,1,'2026-07-29 16:34:10','2026-07-29 11:27:04'),(7,'bottom',NULL,'/banners/bottom-1.jpg',NULL,NULL,'left',1,1,'2026-07-29 16:34:10','2026-07-29 11:27:21'),(8,'bottom',NULL,'/banners/bottom-2.jpg',NULL,NULL,'center',2,1,'2026-07-29 16:34:10','2026-07-29 11:27:21');
/*!40000 ALTER TABLE `home_banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manual_import_logs`
--

DROP TABLE IF EXISTS `manual_import_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manual_import_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `total_records` int(11) NOT NULL DEFAULT 0,
  `updated_records` int(11) NOT NULL DEFAULT 0,
  `skipped_records` int(11) NOT NULL DEFAULT 0,
  `failed_records` int(11) NOT NULL DEFAULT 0,
  `imported_by` int(11) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'COMPLETED',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manual_import_logs`
--

LOCK TABLES `manual_import_logs` WRITE;
/*!40000 ALTER TABLE `manual_import_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `manual_import_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_reset_tokens_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000000_create_personal_access_tokens_table',1),(5,'2014_10_12_100000_create_password_resets_table',2),(7,'2019_12_14_000001_create_personal_access_tokens_table',3),(8,'2026_06_24_033715_add_bbd_to_products_table',4),(9,'2026_07_07_000000_create_shipping_tables',5),(10,'2026_07_08_000001_add_admin_fields',5),(11,'2026_07_08_000002_add_stock_to_products',5),(12,'2026_07_14_000000_create_customer_details_table',5),(13,'2026_07_14_010000_add_shipping_to_customer_details_table',5),(14,'2026_07_14_010001_add_offers_to_products_table',5),(15,'2026_07_14_010002_create_pdfs_table',5),(16,'2026_07_15_000000_add_role_to_users_table',5),(17,'2026_07_19_000000_create_supplier_details_table',5),(18,'2026_07_19_000001_alter_users_status_column',5),(19,'2026_07_26_000000_add_deal_fields_to_pdfs_table',6);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (10,'App\\Models\\User',1),(10,'App\\Models\\User',2),(10,'App\\Models\\User',3),(10,'App\\Models\\User',4),(10,'App\\Models\\User',8),(11,'App\\Models\\User',5),(15,'App\\Models\\User',6),(16,'App\\Models\\User',7);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdfs`
--

DROP TABLE IF EXISTS `pdfs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pdfs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `validity_text` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(10) unsigned NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdfs`
--

LOCK TABLES `pdfs` WRITE;
/*!40000 ALTER TABLE `pdfs` DISABLE KEYS */;
INSERT INTO `pdfs` VALUES (3,'NAVSA P11','deal','LATEST','2026-06-29','2026-08-09',NULL,'Monthly Retail Grocery Promotions with all the top UK Brands for Retailers at Fantastic Prices',1,1,'pdfs/vk0HYfa9tKBIXBNK4niDyvwhAH0qLD606MsGMexn.pdf','2026-07-27 08:08:26','2026-07-27 12:42:40'),(8,'NAVSA CHRISTMAS 2026','deal','CHRISTMAS',NULL,NULL,NULL,'Monthly Food Service Promotions: Discover the Latest Products for the Food Service Sector at Fantastic Prices',2,1,'pdfs/gCA6VaISFxygl0vhhUd1w0KCH8eE4Z2sb8MiSRZV.pdf','2026-07-27 12:42:40','2026-07-27 12:42:40');
/*!40000 ALTER TABLE `pdfs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'products.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(2,'products.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(3,'products.create','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(4,'products.create','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(5,'products.edit','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(6,'products.edit','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(7,'products.delete','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(8,'products.delete','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(9,'products.import-erp','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(10,'products.import-erp','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(11,'offers.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(12,'offers.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(13,'offers.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(14,'offers.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(15,'registrations.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(16,'registrations.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(17,'registrations.approve','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(18,'registrations.approve','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(19,'registrations.reject','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(20,'registrations.reject','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(21,'customers.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(22,'customers.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(23,'customers.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(24,'customers.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(25,'suppliers.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(26,'suppliers.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(27,'suppliers.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(28,'suppliers.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(29,'brands.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(30,'brands.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(31,'categories.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(32,'categories.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(33,'banners.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(34,'banners.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(35,'pdfs.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(36,'pdfs.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(37,'roles.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(38,'roles.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(39,'roles.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(40,'roles.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(41,'orders.view','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(42,'orders.view','web','2026-08-06 02:17:36','2026-08-06 02:17:36'),(43,'orders.manage','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(44,'orders.manage','web','2026-08-06 02:17:36','2026-08-06 02:17:36');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','266c4ab83f727bf0df34bb17fd5060e2b40009fd5404d77d2387ee4f741688a1','[\"*\"]','2026-08-06 02:28:26',NULL,'2026-08-06 02:19:45','2026-08-06 02:28:26'),(2,'App\\Models\\User',4,'auth_token','45e29df6bf98c899eb20262fac224b0dac7b762ac96c0ef1934fb613ddd3e738','[\"*\"]',NULL,NULL,'2026-08-06 02:31:18','2026-08-06 02:31:18'),(3,'App\\Models\\User',2,'auth_token','1ffcc7472a9d03741fc464d55e2d8a7b1f97e766589fd31bc300342a2b11b3f8','[\"*\"]',NULL,NULL,'2026-08-06 06:50:25','2026-08-06 06:50:25'),(4,'App\\Models\\User',3,'auth_token','69d69abf0d303de956a1f86805fdb6921f6dc098e52f79972b1979b3256a4018','[\"*\"]',NULL,NULL,'2026-08-06 06:52:23','2026-08-06 06:52:23');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_change_logs`
--

DROP TABLE IF EXISTS `product_change_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_change_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `change_source` enum('ADMIN','ERP_IMPORT','MANUAL_IMPORT','SYSTEM') NOT NULL DEFAULT 'ADMIN',
  `field_name` varchar(100) NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `import_log_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_change_history` (`product_id`,`created_at`),
  KEY `idx_product_change_source` (`change_source`),
  KEY `idx_product_change_import` (`import_log_id`),
  CONSTRAINT `fk_product_change_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_change_logs`
--

LOCK TABLES `product_change_logs` WRITE;
/*!40000 ALTER TABLE `product_change_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_change_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(4) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_import_errors`
--

DROP TABLE IF EXISTS `product_import_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_import_errors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `import_type` varchar(20) NOT NULL,
  `import_log_id` int(11) NOT NULL,
  `excel_row_number` int(11) DEFAULT NULL,
  `product_reference` varchar(100) DEFAULT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `supplied_value` text DEFAULT NULL,
  `error_message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_import_log` (`import_type`,`import_log_id`),
  KEY `idx_import_reference` (`product_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_import_errors`
--

LOCK TABLES `product_import_errors` WRITE;
/*!40000 ALTER TABLE `product_import_errors` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_import_errors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sub_category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `navsa_product_code` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `units_of` varchar(50) DEFAULT NULL,
  `inner_case_quantity` int(11) DEFAULT NULL,
  `outer_case_quantity` int(11) DEFAULT NULL,
  `qty_desc` varchar(255) DEFAULT NULL,
  `barcode_ean` varchar(100) DEFAULT NULL,
  `barcode_case` varchar(100) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `vat_code` varchar(5) DEFAULT NULL,
  `layer_quantity` int(11) DEFAULT NULL,
  `pallet_quantity` int(11) DEFAULT NULL,
  `order_qty_allowed` enum('DEFAULT','PALLET','CASE') NOT NULL DEFAULT 'DEFAULT',
  `cost` decimal(12,2) DEFAULT NULL,
  `cost_from_date` date DEFAULT NULL,
  `cost_to_date` date DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `volume` decimal(12,3) DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `bbd` varchar(100) DEFAULT NULL,
  `price_list` varchar(100) DEFAULT NULL,
  `manual_price_list` enum('STD','EDLP','MONTHLY PROMOTION','CLEARANCE','WIGIG','NEW','PRESELL') DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `manual_standard_price` decimal(10,2) DEFAULT NULL,
  `promotion_price` decimal(10,2) DEFAULT NULL,
  `promotion_start_date` date DEFAULT NULL,
  `promotion_finish_date` date DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `comm_code` varchar(100) DEFAULT NULL,
  `intra_country` varchar(100) DEFAULT NULL,
  `intra_type` varchar(100) DEFAULT NULL,
  `web_short_description` text DEFAULT NULL,
  `web_long_description` longtext DEFAULT NULL,
  `web_image` varchar(255) DEFAULT NULL,
  `live_for_web` tinyint(4) DEFAULT 1,
  `encore_image` varchar(255) DEFAULT NULL,
  `obsolete` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `supplier_reference` varchar(100) DEFAULT NULL,
  `storage_type` enum('Ambient','Frozen','Chilled') DEFAULT 'Ambient',
  `is_best_offer` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `deleted` tinyint(1) DEFAULT 0,
  `stock_quantity` int(11) DEFAULT 0,
  `is_offer` tinyint(1) DEFAULT 0,
  `offer_label` varchar(80) DEFAULT NULL,
  `last_erp_import_at` timestamp NULL DEFAULT NULL,
  `last_manual_import_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_navsa_product_code` (`navsa_product_code`),
  KEY `supplier_id` (`supplier_id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  KEY `fk_products_vat_code` (`vat_code`),
  CONSTRAINT `fk_products_vat_code` FOREIGN KEY (`vat_code`) REFERENCES `vat_codes` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=320 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (158,NULL,NULL,NULL,1,'467357','Young\'s Cooked & Peeled Prawns ┬ú4.50','12',12,12,'Case','5000205049793','5000205557205','FRO11YOU107 YOUNG\'S','Z',15,165,'DEFAULT',9.99,'2024-07-02','9999-12-31',0.200,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-07-01','9999-12-31','2024-07-01','9999-12-31','2089030','United Kingdom',NULL,'Young\'s Cooked & Peeled Prawns ┬ú4.50','Young\'s Cooked & Peeled Prawns ┬ú4.50','5000205049793.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','3799','Ambient',0,0,0,0,0,NULL,NULL,NULL),(159,NULL,NULL,NULL,2,'466703','Nescafe Azera Americano 500G','1',1,1,'Case','7613035302884','7613035302891','HOT10NES100 NESCAFE','A',16,128,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.500,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Nescafe Azera Americano 500G','Nescafe Azera Americano 500G','7613035302884.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','122842213','Ambient',0,0,0,0,0,NULL,NULL,NULL),(160,NULL,NULL,NULL,3,'466756','Mcvities Penguin & Friends Cocoa 5X20G','7',7,7,'Case','5000168003283','5000168002385','GRO10MCV100 MCVITIES','Z',17,102,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.100,0.003,168,'2026-11-02','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','21069098','United Kingdom',NULL,'Mcvities Penguin & Friends Cocoa 5X20G','Mcvities Penguin & Friends Cocoa 5X20G','5000168003283.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','45288','Ambient',0,0,0,0,0,NULL,NULL,NULL),(161,NULL,NULL,NULL,4,'466770','Bisto Gravy Granules Beef Pm 2.99 190G','12',12,12,'Case','5000354924392','5000117933579','GRO10BIS100 BISTO','Z',14,168,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.190,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','21069098','United Kingdom',NULL,'Bisto Gravy Granules Beef Pm 2.99 190G','Bisto Gravy Granules Beef Pm 2.99 190G','5000354924392.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','1018091','Ambient',0,0,0,0,0,NULL,NULL,NULL),(162,NULL,NULL,NULL,5,'466788','Red Bull Edition Blue June Berry PM 1.55 250ml','12',12,12,'Case','90456787','9002490271374','SOF10RED100 RED BULL','A',32,288,'DEFAULT',9.99,'2025-07-09','9999-12-31',0.250,0.003,180,'2026-01-21','STD',NULL,10.99,NULL,NULL,'2024-12-30','9999-12-31','2024-12-30','9999-12-31','22029919','United Kingdom',NULL,'Red Bull Edition Blue June Berry PM 1.55 250ml','Red Bull Edition Blue June Berry PM 1.55 250ml','90456787.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','RB243826','Ambient',0,0,0,0,0,NULL,NULL,NULL),(163,NULL,5,2,6,'466811','Tetley Decaf Pm 2.19 40S','6',6,6,'Case','5000208001507','5000208001514','HOT10TET100 TETLEY','Z',35,315,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.750,0.015,180,'2026-11-30','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Tetley Decaf Pm 2.19 40S','Tetley Decaf Pm 2.19 40S','5000208001507.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','7847','Ambient',0,0,0,0,0,NULL,NULL,NULL),(164,NULL,1,10,7,'468004','Lindt Creation Lemon,(317648)','14',14,14,'Case','3046920047302','3046920176484','CON11LIN100 LINDT & SPRUGALI','A',30,300,'DEFAULT',9.99,'2026-01-08','9999-12-31',0.150,0.003,210,'2026-08-06','STD',NULL,10.99,NULL,NULL,'2026-01-16','9999-12-31','2026-01-16','9999-12-31','18063210','France',NULL,'Creation Lemon 317648','Creation Lemon 317648','3046920047302.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','1000121649','Ambient',0,0,0,0,0,NULL,NULL,NULL),(165,NULL,2,9,8,'466780','Nando\'S Hot Peri-Peri Marinade 260G','6',6,6,'Case','6003770009000','16003770009007','CON10NAN100 NANDO\'S','Z',52,260,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.260,0.003,180,'2026-09-26','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','2103909089','United Kingdom',NULL,'Nando\'S Hot Peri-Peri Marinade 260G','Nando\'S Hot Peri-Peri Marinade 260G','6003770009000.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','TG063','Ambient',0,0,0,0,0,NULL,NULL,NULL),(166,NULL,3,12,9,'466801','Candy Castle Crew Bubblegum Bottles PM 1.00 90g','18',18,18,'Case','5056192412270','5056192412287','CON12CAN100 CANDY','A',20,240,'DEFAULT',9.99,'2025-09-02','9999-12-31',0.090,0.003,180,'2026-03-01','STD',NULL,10.99,NULL,NULL,'2025-09-02','9999-12-31','2025-09-02','9999-12-31','1700000000','Turkey',NULL,'Candy Castle Crew Bubblegum Bottles PM 1.00 90g','Candy Castle Crew Bubblegum Bottles PM 1.00 90g','5056192412270.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','ITP006','Ambient',0,0,0,0,0,NULL,NULL,NULL),(167,NULL,4,14,10,'466836','Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','18',18,18,'Case','5010052073193','5010052114193','CRI10GOL100 GOLDEN WONDER','A',10,60,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.040,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','19059055','United Kingdom',NULL,'Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','5010052073193.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','7319','Ambient',0,0,0,0,0,NULL,NULL,NULL),(168,NULL,3,12,11,'466851','Bazooka Chews Sour PM 1.00 120g','12',12,12,'Case','5011053026386','5011053026409','CON12BAZ100 BAZOOKA','A',6,24,'DEFAULT',9.99,'2024-10-15','9999-12-31',0.120,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-07-10','9999-12-31','2024-07-10','9999-12-31','17049071','Turkey',NULL,'Bazooka Chews Sour PM 1.00 120g','Bazooka Chews Sour PM 1.00 120g','5011053026386.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 07:08:02','Z70021','Ambient',0,0,0,0,0,NULL,NULL,NULL),(169,NULL,NULL,NULL,12,'466867','Jack Daniels Bbq Sauce Original 553G','6',6,6,'Case','810020931822','810020931815','CON10JAC100 JACK DANIELS','A',29,174,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.550,0.003,180,'2026-05-04','STD',NULL,10.99,NULL,NULL,'2025-11-29','9999-12-31','2025-11-29','9999-12-31','17049099','United Kingdom',NULL,'Jack Daniels Bbq Sauce Original 553G','Jack Daniels Bbq Sauce Original 553G','810020931822.png',1,NULL,NULL,'2026-08-06 02:26:56','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(170,NULL,NULL,NULL,13,'468372','Fruit Shoot Nas Apple  275ml','12',12,12,'Case','50412730','5010102221567','SOF10FRU100 FRUIT SHOOT','A',26,182,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.280,0.003,210,'2026-09-29','STD',NULL,10.99,NULL,NULL,'2025-11-29','9999-12-31','2025-11-29','9999-12-31','22021000','United Kingdom',NULL,'Fruit Shoot Nas Apple  275ml','Fruit Shoot Nas Apple  275ml','50412730.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','201931','Ambient',0,0,0,0,0,NULL,NULL,NULL),(171,NULL,NULL,NULL,14,'468377','Powerade Golden Mango 500Ml','12',12,12,'Case','5449000320988','5017726442934','SOF10POW100 POWERADE','A',24,144,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.500,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Powerade Golden Mango 500Ml','Powerade Golden Mango 500Ml','5449000320988.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','642691','Ambient',0,0,0,0,0,NULL,NULL,NULL),(172,NULL,NULL,NULL,15,'468379','Lucozade Alert Mango Peachade Pm 1.00 500Ml','12',12,12,'Case','5054267013810','5054267503809','SOF10LUC100 LUCOZADE','A',19,152,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.500,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','21069098','United Kingdom',NULL,'Lucozade Alert Mango Peachade Pm 1.00 500Ml','Lucozade Alert Mango Peachade Pm 1.00 500Ml','5054267503809.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','F97634','Ambient',0,0,0,0,0,NULL,NULL,NULL),(173,NULL,NULL,NULL,16,'468421','Green s Sponge Cake Chocolate PM 1.99 221g','6',6,6,'Case','5056036508732','5056036508749','GRO10GRE104 GREEN\'S','Z',34,272,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.221,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','20052020','United Kingdom',NULL,'Green s Sponge Cake Chocolate PM 1.99 221g','Green s Sponge Cake Chocolate PM 1.99 221g','5056036508732.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','50615','Ambient',0,0,0,0,0,NULL,NULL,NULL),(174,NULL,NULL,NULL,17,'468435','Rice Krispies Squares Cornflakes 30X31G 79P Pmp','30',30,30,'Case','5059321006852','5059321006869','CER10KEL100 KELLOGGS','A',27,486,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.031,0.026,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','10063067','United Kingdom',NULL,'Rice Krispies Squares Cornflakes 30X31G 79P Pmp','Rice Krispies Squares Cornflakes 30X31G 79P Pmp','5059321006852.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','7100686000','Ambient',0,0,0,0,0,NULL,NULL,NULL),(175,NULL,NULL,NULL,18,'468442','Bebeto Fizzy Peach Hearts 150G','10',10,10,'Case','8690146174523','8690146175957','CON12BEB100 BEBETO','A',48,192,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.150,0.015,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','17049000','Turkey',NULL,'Bebeto Fizzy Peach Hearts 150G','Bebeto Fizzy Peach Hearts 150G','8690146174523.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','160214414','Ambient',0,0,0,0,0,NULL,NULL,NULL),(176,NULL,NULL,NULL,19,'468445','Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','4',4,4,'Case','5000157140159','5000157133533','GRO10HEI101 HEINZ','Z',13,195,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.120,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','10063067','United Kingdom',NULL,'Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','5000157140159.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','76011270','Ambient',0,0,0,0,0,NULL,NULL,NULL),(177,NULL,NULL,NULL,20,'468487','Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','32',32,32,'Case','5900951310546','5900951310553','CON11SNI100 SNICKERS','A',23,276,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.050,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','18069019','Poland',NULL,'Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','5900951310546.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','458875','Ambient',0,0,0,0,0,NULL,NULL,NULL),(178,NULL,NULL,NULL,21,'468506','Cadbury 140G Brunch Pnut 8Ca','8',8,8,'Case','7622202219269','7622202219269','BIS10CAD100 CADBURY','A',40,360,'DEFAULT',9.99,'2025-09-26','9999-12-31',0.140,0.005,210,'2026-01-24','STD',NULL,10.99,NULL,NULL,'2025-09-26','9999-12-31','2025-09-26','9999-12-31','1806321','United Kingdom',NULL,'CADBURY 140G BRUNCH PNUT 8CA','CADBURY 140G BRUNCH PNUT 8CA','7622202219269.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','4313341','Ambient',0,0,0,0,0,NULL,NULL,NULL),(179,NULL,NULL,NULL,22,'468552','Chupa Chups Babol Apple 27g','20',20,20,'Case','80970019','8410031954494','CON12CHU100 CHUPA CHUP','A',24,300,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.030,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,'2026-04-27','2026-06-16','2026-04-27','2026-06-16','17041010','Turkey',NULL,'Chupa Chups Babol Apple 27g','Chupa Chups Babol Apple 27g','80970019.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','10009879','Ambient',0,0,0,0,0,NULL,NULL,NULL),(180,NULL,NULL,NULL,23,'468425','Hartleys Jam Raspberry Seedless Pm 1.99 300G','6',6,6,'Case','5016935000584','5016935000591','JAM10HAR102 HARTLEYS','Z',34,306,'DEFAULT',9.99,'2026-02-09','9999-12-31',0.300,0.003,210,'2026-07-20','STD',NULL,10.99,NULL,NULL,'2026-02-09','9999-12-31','2026-02-09','9999-12-31','20079935','United Kingdom',NULL,'Hartleys Jam Raspberry Seedless Pm 1.99 300G','Hartleys Jam Raspberry Seedless Pm 1.99 300G','5016935000584.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','10003591','Ambient',0,0,0,0,0,NULL,NULL,NULL),(181,NULL,NULL,NULL,24,'468428','John West Plant Power Harissa 145g','10',10,10,'Case','5000171061430','5000171074584','GRO10JOH101 JOHN WEST','Z',30,450,'DEFAULT',9.99,'2025-11-21','9999-12-31',0.150,0.003,210,'2026-06-19','STD',NULL,10.99,NULL,NULL,'2025-06-20','9999-12-31','2025-06-20','9999-12-31','16023230','Poland',NULL,'John West Plant Power Harissa 145g','John West Plant Power Harissa 145g','5000171061430.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','300008326','Ambient',0,0,0,0,0,NULL,NULL,NULL),(182,NULL,NULL,NULL,25,'468577','Starbucks Pet Chilled Cofee Skinny Latte 220Ml','8',8,8,'Case','5711953179648','15711953179294','CHI11STA100 STARBUCKS','Z',35,210,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.230,0.015,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','22029915','Denmark',NULL,'Starbucks Pet Chilled Cofee Skinny Latte 220Ml','Starbucks Pet Chilled Cofee Skinny Latte 220Ml','5711953179648.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','SBCCCLATNAS','Ambient',0,0,0,0,0,NULL,NULL,NULL),(183,NULL,NULL,NULL,26,'468584','Sheba Classica In Terrine With Chicken 85G','22',22,22,'Case','4008429163906','4008429164224','PET10SHE100 SHEBA','A',25,350,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.090,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Sheba Classica In Terrine With Chicken 85G','Sheba Classica In Terrine With Chicken 85G','4008429163906.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','460748','Ambient',0,0,0,0,0,NULL,NULL,NULL),(184,NULL,NULL,NULL,27,'468596','Wafflemeister 90g Classic Liege Waffle','30',30,30,'Case','5060868700356','5060868700424','WAF10WAF100 Wafflemeister','A',10,140,'DEFAULT',9.99,'2024-07-22','9999-12-31',0.090,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-07-22','9999-12-31','2024-07-22','9999-12-31','19053299','United Kingdom',NULL,'Wafflemeister 90g Classic Liege Waffle','Wafflemeister 90g Classic Liege Waffle','5060868700356.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','WFMCL90X30','Ambient',0,0,0,0,0,NULL,NULL,NULL),(185,NULL,NULL,NULL,28,'468645','Free From Fellows Cola Bottles 100G','10',10,10,'Case','5060308360157','5060308360188','CON12FRE100 FELLOWS','A',30,180,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.100,0.018,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-05-16','9999-12-31','2026-05-16','9999-12-31','17049000','Belgium',NULL,'Free From Fellows Cola Bottles 100G','Free From Fellows Cola Bottles 100G','5060308360157.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FFF001','Ambient',0,0,0,0,0,NULL,NULL,NULL),(186,NULL,NULL,NULL,29,'468656','Galaxy Chocolate Milkshake 250Ml','12',12,12,'Case','5056357909423','5056357909416','SOF10GAL100 GALAXY','Z',31,248,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.250,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,'2026-04-27','2026-06-16','2026-04-27','2026-06-16','22029991','United Kingdom',NULL,'Galaxy Chocolate Milkshake 250Ml','Galaxy Chocolate Milkshake 250Ml','5056357909423.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','DG57L','Ambient',0,0,0,0,0,NULL,NULL,NULL),(187,NULL,NULL,NULL,30,'468671','Haribo Happy Cola 160g','12',12,12,'Case','5012035962173','5012035962500','CON12HAR100 HARIBO','A',25,200,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.160,0.019,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,'2026-04-27','2026-06-16','2026-04-27','2026-06-16','1704906500','United Kingdom',NULL,'Haribo Happy Cola 160g','Haribo Happy Cola 160g','5012035962173.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','105800','Ambient',0,0,0,0,0,NULL,NULL,NULL),(188,NULL,NULL,NULL,31,'468682','Jack Links Biltong 20g','12',12,12,'Case','4251097420332','4251097420288','GRO10JAC100 JACK','Z',36,180,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.020,0.015,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','17049000','Germany',NULL,'Jack Links Biltong 20G','Jack Links Biltong 20G','4251097420332.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','10000041765','Ambient',0,0,0,0,0,NULL,NULL,NULL),(189,NULL,NULL,NULL,32,'468695','Knoppers Nut Bar 40G','24',24,24,'Case','40144450','4014400471618','CON11KNO100 KNOPPERS','A',39,390,'DEFAULT',9.99,'2025-10-20','9999-12-31',0.040,0.000,210,'2026-03-04','STD',NULL,10.99,NULL,NULL,'2025-10-13','9999-12-31','2025-10-13','9999-12-31','1905321100','Germany',NULL,'Knoppers Nut Bar 40G','Knoppers Nut Bar 40G','40144450.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','938135','Ambient',0,0,0,0,0,NULL,NULL,NULL),(190,NULL,NULL,NULL,33,'468728','Proper Chickpea Chips Ghost Chilli & Yuzu 85G','8',8,8,'Case','5060283762946','15060283762943','CRI10PRO101 PROPER','Z',12,72,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.090,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-05-16','9999-12-31','2026-05-16','9999-12-31','19059045','United Kingdom',NULL,'Proper Chickpea Chips Ghost Chilli & Yuzu 85G','Proper Chickpea Chips Ghost Chilli & Yuzu 85G','5060283762946.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','6421231','Ambient',0,0,0,0,0,NULL,NULL,NULL),(191,NULL,NULL,NULL,34,'468733','Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','12',12,12,'Case','5000382122333','5000382122326','SOF10RUB100 RUBICON','A',6,168,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.500,0.015,270,'2027-02-12','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','22042120','United Kingdom',NULL,'Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','5000382122333.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','3436108','Ambient',0,0,0,0,0,NULL,NULL,NULL),(192,NULL,NULL,NULL,35,'468613','Beanies Bubble Gum 50g','6',6,6,'Case','5060169982468','5060169983397','CON12BEA100 BEANIES','A',39,546,'DEFAULT',9.99,'2025-06-11','9999-12-31',0.500,0.003,210,'2026-04-02','STD',NULL,10.99,NULL,NULL,'2025-06-11','9999-12-31','2025-06-11','9999-12-31','21011100','United Kingdom',NULL,'Beanies Bubble Gum 50g','Beanies Bubble Gum 50g','5060169982468.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(193,NULL,NULL,NULL,36,'468761','Jelly Belly Berry Blue Fruit Drink 330ml NRB','12',12,12,'Case','5060318661817','5060318661817','SOF10JEL100 JELLY BELLY','A',19,114,'DEFAULT',9.99,'2024-07-24','9999-12-31',0.330,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-07-24','9999-12-31','2024-07-24','9999-12-31','22029995','United Kingdom',NULL,'Jelly Belly Berry Blue Fruit Drink 330ml NRB','Jelly Belly Berry Blue Fruit Drink 330ml NRB','5060318661817.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','JBBBF330','Ambient',0,0,0,0,0,NULL,NULL,NULL),(194,NULL,NULL,NULL,37,'468769','Chewits Blue Raspberry Juicy Bites Bag 115G','10',10,10,'Case','5060072652243','15060072652240','CON12CHE101 CHEWITS','A',16,128,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.120,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-05-16','9999-12-31','2026-05-16','9999-12-31','17049065','United Kingdom',NULL,'Chewits Blue Raspberry Juicy Bites Bag 115G','Chewits Blue Raspberry Juicy Bites Bag 115G','5060072652243ÔÇï.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','1016898ÔÇï','Ambient',0,0,0,0,0,NULL,NULL,NULL),(195,NULL,NULL,NULL,38,'468782','Brain Blasterz Candy Spray 28ml','18',18,18,'Case','5026418050388','5026418150385','CON12BRA100 BRAIN BLASTERZ','A',120,480,'DEFAULT',9.99,'2025-05-22','9999-12-31',0.030,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2025-05-22','9999-12-31','2025-05-22','9999-12-31','2106905990','United Kingdom',NULL,'Brain Blasterz Candy Spray 28ml','Brain Blasterz Candy Spray 28ml','5026418050388.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','503800','Ambient',0,0,0,0,0,NULL,NULL,NULL),(196,NULL,NULL,NULL,39,'468788','Force Protein Bar Birthday Cake 65g','12',12,12,'Case','5065011832120','5065011832137','CRI10FOR100 FORCE PROTEIN','A',72,504,'DEFAULT',9.99,'2025-05-22','9999-12-31',0.070,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-12-30','9999-12-31','2024-12-30','9999-12-31','18063100','United Kingdom',NULL,'Force Protein Bar Birthday Cake 65g','Force Protein Bar Birthday Cake 65g','5065011832120.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FP6182/6','Ambient',0,0,0,0,0,NULL,NULL,NULL),(197,NULL,NULL,NULL,40,'468822','Cacaolat Nas 200Ml','24',24,24,'Case','8412700120100','18412700120596','SOF10CAC100 CACAOLAT','Z',15,150,'DEFAULT',9.99,'2025-09-23','9999-12-31',0.200,0.003,210,'2025-09-23','STD',NULL,10.99,NULL,NULL,'2025-09-23','9999-12-31','2025-09-23','9999-12-31','401201100','United Kingdom',NULL,'Cacaolat Nas 200Ml','Cacaolat Nas 200Ml','8412700120100.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','17784002','Ambient',0,0,0,0,0,NULL,NULL,NULL),(198,NULL,NULL,NULL,41,'468833','Filippo Berio Arrabiata Pasta Sauce 340g','6',6,6,'Case','8002210133235','8002210133242','GRO10FIL101 FILIPPO BERIO','Z',45,315,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.340,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','21039090','United Kingdom',NULL,'Filippo Berio Arrabiata Pasta Sauce 340g','Filippo Berio Arrabiata Pasta Sauce 340g','8002210133235.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','60000665','Ambient',0,0,0,0,0,NULL,NULL,NULL),(199,NULL,NULL,NULL,42,'468879','Carnation Evaporated Milk 12X410G Pmp ┬ú1.59','12',12,12,'Case','8445290479488','8445290479082','GRO10CAR106 CARNATION','Z',15,15,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.410,0.003,540,'2027-11-09','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','21069098','United Kingdom',NULL,'Carnation Evaporated Milk 12X410G Pmp ┬ú1.59','Carnation Evaporated Milk 12X410G Pmp ┬ú1.59','8445290479488.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','12563291','Ambient',0,0,0,0,0,NULL,NULL,NULL),(200,NULL,NULL,NULL,43,'468894','Del Monte Pineapple Slices In Juice 6 X 3.01Kg','1',1,1,'Case','24000118268','10024000118265','GRO10DEL105 DEL MON','Z',7,56,'DEFAULT',9.99,'2026-04-07','9999-12-31',3.000,0.003,210,'2026-10-28','STD',NULL,10.99,NULL,NULL,'2026-04-01','9999-12-31','2026-04-01','9999-12-31','2008209000','United Kingdom',NULL,'Del Monte Pineapple Slices In Juice 6 X 3.01Kg','Del Monte Pineapple Slices In Juice 6 X 3.01Kg','24000118268.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','DM072','Ambient',0,0,0,0,0,NULL,NULL,NULL),(201,NULL,NULL,NULL,44,'468916','Barratt Milk Straws Black Jack 10S','12',12,12,'Case','5060202714728','5060202714735','CON12BAR104 BARRATTS','A',66,462,'DEFAULT',9.99,'2025-01-16','9999-12-31',0.090,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2025-01-16','9999-12-31','2025-01-16','9999-12-31','190231030','United Kingdom',NULL,'Barratt Milk Straws Black Jack 10S','Barratt Milk Straws Black Jack 10S','5060202714728.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','/6','Ambient',0,0,0,0,0,NULL,NULL,NULL),(202,NULL,NULL,NULL,45,'468928','Wham Extreme Stick Pack 36G','40',40,40,'Case','5010511481774','5010511039548','CON12WHA100 WHAM EXTREME','A',46,506,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.040,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','21069098','United Kingdom',NULL,'Wham Extreme Stick Pack 36G','Wham Extreme Stick Pack 36G','5010511481774.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','BARR511','Ambient',0,0,0,0,0,NULL,NULL,NULL),(203,NULL,NULL,NULL,46,'468776','Zodiac Bubblegum  330Ml','12',12,12,'Case','5023603333349','5023603332359','SOF10ZOD100 ZODIAC','A',24,240,'DEFAULT',9.99,'2024-07-31','9999-12-31',0.330,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-07-31','9999-12-31','2024-07-31','9999-12-31','22029915','United Kingdom',NULL,'Zodiac Bubblegum  330Ml','Zodiac Bubblegum  330Ml','5023603333349.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','Q12G','Ambient',0,0,0,0,0,NULL,NULL,NULL),(204,NULL,NULL,NULL,47,'468932','Huntley & Palmer MINI DIPPER 5PK X 18','18',18,18,'Case','5060074982430','5060074982447','CRI10HUN100 Huntley & Palmer','A',10,90,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.250,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,'2025-09-18','9999-12-31','2025-09-18','9999-12-31','19053199','United Kingdom',NULL,'Huntley & Palmer MINI DIPPER 5PK X 18','Huntley & Palmer MINI DIPPER 5PK X 18','5060074982430.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','01HUNM10','Ambient',0,0,0,0,0,NULL,NULL,NULL),(205,NULL,NULL,NULL,48,'468934','Eat Real Chilli & Lemon Hummus Chips 110G','10',10,10,'Case','5060878780508','15060878780505','CRI10EAT101 EATREAL','Z',10,70,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.110,0.015,180,'2026-10-27','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','19059045','United Kingdom',NULL,'Eat Real Chilli & Lemon Hummus Chips 110G','Eat Real Chilli & Lemon Hummus Chips 110G','5060878780508.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','2061822','Ambient',0,0,0,0,0,NULL,NULL,NULL),(206,NULL,NULL,NULL,49,'469342','Grenade Caramel Chaos Protein Bar 60G','12',12,12,'Case','5060221201391','5060221203425','CON11GRE107 GRENADE','A',108,756,'DEFAULT',9.99,'2025-02-10','9999-12-31',0.060,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-07-03','9999-12-31','2025-07-03','9999-12-31','18063100','United Kingdom',NULL,'Grenade Caramel Chaos Protein Bar 60G','Grenade Caramel Chaos Protein Bar 60G','5060221201391.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','C006157','Ambient',0,0,0,0,0,NULL,NULL,NULL),(207,NULL,NULL,NULL,50,'469377','Fazer Dumle Original 150G','12',12,12,'Case','6411401072697','6416453472693','CON11FAZ100 FAZER','A',16,112,'DEFAULT',9.99,'2024-09-11','9999-12-31',0.150,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-07-03','9999-12-31','2025-07-03','9999-12-31','18063100','United Kingdom',NULL,'Fazer Dumle Original 150G','Fazer Dumle Original 150G','6411401072697.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','407269','Ambient',0,0,0,0,0,NULL,NULL,NULL),(208,NULL,NULL,NULL,51,'469510','Pathos Mushrooms Sliced 2.5Kg','6',6,6,'Case','5060282620964','5060282620971','GRO10PAT102 PATHOS','A',7,63,'DEFAULT',9.99,'2024-09-11','9999-12-31',2.500,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-07-03','9999-12-31','2025-07-03','9999-12-31','18063100','United Kingdom',NULL,'Pathos Mushrooms Sliced 2.5Kg','Pathos Mushrooms Sliced 2.5Kg','5060282620964.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','VEG004','Ambient',0,0,0,0,0,NULL,NULL,NULL),(209,NULL,NULL,NULL,52,'469514','Walkers Max Paprika 27G 6Pk 27G','12',12,12,'Case','5000328908137','5000328908144','CRI10WAL100 WALKERS','A',5,45,'DEFAULT',9.99,'2025-07-16','9999-12-31',0.030,0.029,78,'2026-07-01','STD',NULL,10.99,NULL,NULL,'2025-07-22','9999-12-31','2025-07-22','9999-12-31','18063100','United Kingdom',NULL,'Walkers Max Paprika 27g 6pk 27g','Walkers Max Paprika 27g 6pk 27g','5000328908137.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','300001269','Ambient',0,0,0,0,0,NULL,NULL,NULL),(210,NULL,NULL,NULL,53,'469555','Warrior┬áProtein┬áWater┬á-┬áBerry┬áx12┬á500ml┬áBottles','12',12,12,'Case','5060756345379','5060756345522','HEA11WAR100 WARRIOR','A',20,120,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.550,0.003,210,'2026-03-05','STD',NULL,10.99,NULL,NULL,'2025-08-07','9999-12-31','2025-08-07','9999-12-31','2202100000','United Kingdom',NULL,'Warrior┬áProtein┬áWater┬á-┬áBerry┬áx12┬á500ml┬áBottles','Warrior┬áProtein┬áWater┬á-┬áBerry┬áx12┬á500ml┬áBottles','5060756345379.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','B326-B-12','Ambient',0,0,0,0,0,NULL,NULL,NULL),(211,NULL,NULL,NULL,54,'469669','CADBURY MILK DRINK CARAMEL','8',8,8,'Case','4025500283926','4025500283933','DES10MUL100 MULLER','Z',40,240,'DEFAULT',9.99,'2024-09-18','9999-12-31',0.250,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-09-18','9999-12-31','2024-09-18','9999-12-31','19019099','United Kingdom',NULL,'CADBURY MILK DRINK CARAMEL','CADBURY MILK DRINK CARAMEL','4025500283926.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','MICACAR250ML','Ambient',0,0,0,0,0,NULL,NULL,NULL),(212,NULL,NULL,NULL,55,'441624','Ritter Salted Caramel 100g','12',12,12,'Case','4000417271006','4000417271600','CON11RIT100 RITTER','A',50,400,'DEFAULT',9.99,'2025-06-23','9999-12-31',0.100,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2025-06-23','9999-12-31','2025-06-23','9999-12-31','20060038','Germany',NULL,'Ritter Salted Caramel 100g','Ritter Salted Caramel 100g','4000417271006.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(213,NULL,NULL,NULL,56,'442468','Weetabix Chocolate','10',10,10,'Case','5010029228977','5010029228984','CER10WEE100 WEETABIX','Z',20,80,'DEFAULT',9.99,'2024-02-08','9999-12-31',0.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2025-01-01','9999-12-31','2025-01-01','9999-12-31','18069031','United Kingdom',NULL,'Weetabix Chocolate','Weetabix Chocolate','5010029228977.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(214,NULL,NULL,NULL,57,'550053','Bahlsen 10pk Pick Up! Minis','14',14,14,'Case','4017100407567','4017100540752','BIS10BAH100 BAHLSEN','Z',7,70,'DEFAULT',9.99,'2025-09-11','9999-12-31',0.140,0.022,120,'2026-01-09','STD',NULL,10.99,NULL,NULL,'2025-09-11','9999-12-31','2025-09-11','9999-12-31','19053191','Denmark',NULL,'Bahlsen 10pk Pick Up! Minis','Bahlsen 10pk Pick Up! Minis','4017100407567.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','94422','Ambient',0,0,0,0,0,NULL,NULL,NULL),(215,NULL,NULL,NULL,58,'444617','CAWSTON Cloudy Apple Juice','6',6,6,'case','5060054134026','5060054130431','SOF10CAW100 CAWSTON','Z',30,150,'DEFAULT',9.99,'2024-03-26','9999-12-31',1.100,0.010,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,'2024-03-14','9999-12-31','2024-03-14','9999-12-31','20099011','United Kingdom',NULL,'CAWSTON Cloudy Apple Juice','CAWSTON Cloudy Apple Juice','5060054134026.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(216,NULL,NULL,NULL,59,'444650','Diablo No Added Sugar Milk Chocolate  85g  x15','15',15,15,'case','5060309490006','5060309490518','CON11DIA100 DIABLO','A',80,480,'DEFAULT',9.99,'2025-06-16','9999-12-31',0.085,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2025-06-17','9999-12-31','2025-06-17','9999-12-31','18063290','United Kingdom',NULL,'Diablo No Added Sugar Milk Chocolate  85g  x15','Diablo No Added Sugar Milk Chocolate  85g  x15','5060309490006.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(217,NULL,NULL,NULL,60,'445196','Vidal 6X150 TONGUE PAINTER LOLLIES','6',6,6,'case','8413178166102','38413178166103','CON12VID100 VIDAL','A',9,54,'DEFAULT',9.99,'2025-08-06','9999-12-31',1.080,0.003,210,'2026-04-02','STD',NULL,10.99,NULL,NULL,'2025-08-06','9999-12-31','2025-08-06','9999-12-31','1704907500','Spain',NULL,'Vidal 6X150 TONGUE PAINTER LOLLIES','Vidal 6X150 TONGUE PAINTER LOLLIES','8413178166102.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','1060213','Ambient',0,0,0,0,0,NULL,NULL,NULL),(218,NULL,NULL,NULL,61,'448940','Dole Mandarin in Juice 4-pack 4 x 113g','3',3,3,'Case','38900042370','5438900042366','GRO10DOL100 DOLE','Z',29,348,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.113,0.003,365,'2026-08-07','STD',NULL,10.99,NULL,NULL,'2025-08-07','9999-12-31','2025-08-07','9999-12-31','20060091','United Kingdom',NULL,'Dole Mandarin in Juice 4-pack 4 x 113g','Dole Mandarin in Juice 4-pack 4 x 113g','38900042370.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','389000424535','Ambient',0,0,0,0,0,NULL,NULL,NULL),(219,NULL,NULL,NULL,62,'449428','Fuel10K Chocolate Breakfast Milk Drink','8',8,8,'Case','5060201621836','5060201621935','CER10FUE100 FUEL10K','Z',36,288,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.330,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','18069019','United Kingdom',NULL,'Fuel10K Chocolate Breakfast Milk Drink','Fuel10K Chocolate Breakfast Milk Drink','5060201621836.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','1019345','Ambient',0,0,0,0,0,NULL,NULL,NULL),(220,NULL,NULL,NULL,63,'450211','Typhoo Eco Refill ┬ú1.29 Pmp','12',12,12,'Case','5060123602210','15055486000558','HOT10TYP100 TYPHOO','Z',31,217,'DEFAULT',9.99,'2026-04-13','9999-12-31',0.120,0.003,365,'2025-11-24','STD',NULL,10.99,NULL,NULL,'2026-04-13','9999-12-31','2026-04-13','9999-12-31','9023000','United Kingdom',NULL,'Typhoo Eco Refill ┬ú1.29 Pmp','Typhoo Eco Refill ┬ú1.29 Pmp','5060123602210.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','TJ24038','Ambient',0,0,0,0,0,NULL,NULL,NULL),(221,NULL,NULL,NULL,64,'450223','London Fruit And Herb Lemon & Ginger','6',6,6,'Case','5060123607802','15060123608851','HOT10GLE100 GLENGETTIE','Z',31,310,'DEFAULT',9.99,'2025-11-17','9999-12-31',0.250,0.003,365,'2025-11-23','STD',NULL,10.99,NULL,NULL,'2025-11-17','9999-12-31','2025-11-17','9999-12-31','9023000','United Kingdom',NULL,'London Fruit And Herb Lemon & Ginger','London Fruit And Herb Lemon & Ginger','5060123607802.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','S30576','Ambient',0,0,0,0,0,NULL,NULL,NULL),(222,NULL,NULL,NULL,65,'443417','HORLICKS INSTANT MALTED 400G JAR','6',6,6,'Case','5060113919366','506113919397','HOT10HOR100 HORLICKS','Z',28,224,'DEFAULT',9.99,'2024-02-13','9999-12-31',0.400,0.003,300,'2027-01-17','STD',NULL,10.99,NULL,NULL,'2025-07-05','9999-12-31','2025-07-05','9999-12-31','1901909990','United Kingdom',NULL,'HORLICKS INSTANT MALTED 400G JAR','HORLICKS INSTANT MALTED 400G JAR','5060113919366.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','HLKLGT4U','Ambient',0,0,0,0,0,NULL,NULL,NULL),(223,NULL,NULL,NULL,66,'470546','Fini Halal Fizzy Watermelon Slices 12Bx75G','12',12,12,'Case','8410525178085','68410525178087','CON12FIN100 FINI','A',15,405,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.075,0.003,365,'2027-05-18','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','17049065','United Kingdom',NULL,'Fini Halal Fizzy Watermelon Slices 12Bx75G','Fini Halal Fizzy Watermelon Slices 12Bx75G','8410525178085.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','7050900056','Ambient',0,0,0,0,0,NULL,NULL,NULL),(224,NULL,NULL,NULL,67,'470548','Bounty Secret Centre 132G X 12','12',12,12,'Case','5060402908101','5060402908101','BIS10BOU100 BOUNTY','Z',25,207,'DEFAULT',9.99,'2025-11-17','9999-12-31',0.130,0.003,180,'2026-05-16','STD',NULL,10.99,NULL,NULL,'2025-11-17','9999-12-31','2025-11-17','9999-12-31','19042099','United Kingdom',NULL,'Bounty Secret Centre 132G X 12','Bounty Secret Centre 132G X 12','5060402908101.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(225,NULL,NULL,NULL,68,'470554','Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','24',24,24,'Case','762571500197','762571312158','SOF10FRE101 FREEZ','A',14,98,'DEFAULT',9.99,'2025-11-03','9999-12-31',0.280,0.000,180,'2026-03-09','STD',NULL,10.99,NULL,NULL,'2025-11-03','9999-12-31','2025-11-03','9999-12-31','21061080','Lebanon',NULL,'Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','762571500197.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FRE002','Ambient',0,0,0,0,0,NULL,NULL,NULL),(226,NULL,NULL,NULL,69,'470564','Score Immune Blueberry Flavour 500Ml','12',12,12,'Case','6009708053596','6009708053695','SOF10SCO100 SCORE','A',20,160,'DEFAULT',9.99,'2026-06-04','9999-12-31',0.500,0.003,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,'2026-06-04','9999-12-31','2026-06-04','9999-12-31','22021000','South Africa',NULL,'Score Immune Blueberry Flavour 500Ml','Score Immune Blueberry Flavour 500Ml','6009708053596.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','103952','Ambient',0,0,0,0,0,NULL,NULL,NULL),(227,NULL,NULL,NULL,70,'470580','Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','1',1,1,'Case','5055037054620','5055037054620','CON11ELI100 ELIZABETH','A',32,288,'DEFAULT',9.99,'2025-06-02','9999-12-31',2.450,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-05-30','9999-12-31','2025-05-30','9999-12-31','18063290','United Kingdom',NULL,'Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','5055037054620.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','5106766','Ambient',0,0,0,0,0,NULL,NULL,NULL),(228,NULL,NULL,NULL,71,'470589','Tassimo Costa Cappuccino Coffee Pods 8pk','5',5,5,'Case','8711000545324','8711000545331','GRO10TAS100 TASSIMO','A',18,108,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.280,0.003,180,'2026-03-17','STD',NULL,10.99,NULL,NULL,'2025-09-18','9999-12-31','2025-09-18','9999-12-31','1902301080','United Kingdom',NULL,'Tassimo Costa Cappuccino Coffee Pods 8pk','Tassimo Costa Cappuccino Coffee Pods 8pk','8711000545324.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','4056513','Ambient',0,0,0,0,0,NULL,NULL,NULL),(229,NULL,NULL,NULL,72,'470597','Bens Original Caribbean RTH 220g','6',6,6,'Case','5010034014282','5010034014558','GRO10BEN100 BENS ORIGINAL','A',42,336,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.220,0.015,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','17049000','United Kingdom',NULL,'Bens Original Caribbean Rth 220G','Bens Original Caribbean Rth 220G','5010034014282.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','426114','Ambient',0,0,0,0,0,NULL,NULL,NULL),(230,NULL,NULL,NULL,73,'470647','Rolo Multipack 12(4X41.6G) Pr ┬ú1.85 Xb Mpacks','12',12,12,'Case','8445291527867','8445291527874','CON11ROL100 ROLO','A',28,224,'DEFAULT',9.99,'2026-04-30','9999-12-31',0.166,0.008,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-04-30','9999-12-31','2026-04-30','9999-12-31','180690','United Kingdom',NULL,'Rolo Multipack 12(4X41.6G) Pr ┬ú1.85 Xb Mpacks','Rolo Multipack 12(4X41.6G) Pr ┬ú1.85 Xb Mpacks','8445291527867.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','12602258','Ambient',0,0,0,0,0,NULL,NULL,NULL),(231,NULL,NULL,NULL,74,'470667','Mcdougalls Fish Batter Mix 3.5Kg','1',1,1,'Case','5000354203824','5000117204938','GRO10MCD100 MCDOUGALL','A',56,280,'DEFAULT',9.99,'2024-10-11','9999-12-31',3.500,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-07-03','9999-12-31','2025-07-03','9999-12-31','1902301080','United Kingdom',NULL,'Mcdougalls Fish Batter Mix 3.5Kg','Mcdougalls Fish Batter Mix 3.5Kg','5000354203824.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','1006763/4','Ambient',0,0,0,0,0,NULL,NULL,NULL),(232,NULL,NULL,NULL,75,'470679','Cawoods Sardines In Spiced Soya Oil 125G','50',50,50,'Case','5020580023508','5020580023515','GRO10CAW101 CAWOODS','A',12,132,'DEFAULT',9.99,'2024-10-11','9999-12-31',0.130,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-07-03','9999-12-31','2025-07-03','9999-12-31','1902301080','United Kingdom',NULL,'Cawoods Sardines In Spiced Soya Oil 125G','Cawoods Sardines In Spiced Soya Oil 125G','5020580023508.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','22935','Ambient',0,0,0,0,0,NULL,NULL,NULL),(233,NULL,NULL,NULL,76,'470717','Wow Hydrate Electrolyte Lemon & Lime Water 500ml','12',12,12,'Case','5060446100455','5060446100554','WAT10WOW100 WOW HYDRATE','A',22,110,'DEFAULT',9.99,'2025-09-08','9999-12-31',0.500,0.000,180,'2026-01-12','STD',NULL,10.99,NULL,NULL,'2025-09-08','9999-12-31','2025-09-08','9999-12-31','22021000','United Kingdom',NULL,'Wow Hydrate Electrolyte Lemon & Lime Water 500ml','Wow Hydrate Electrolyte Lemon & Lime Water 500ml','5060446100455.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','HWPLEL0501UG12A','Ambient',0,0,0,0,0,NULL,NULL,NULL),(234,NULL,NULL,NULL,77,'470737','Nestle Damak Caramel Croquant with Pistachio 6x60g','12',12,12,'Case','8445291349292','8445291349308','CON11NES108 NESTLE','A',19,114,'DEFAULT',9.99,'2024-10-14','9999-12-31',0.360,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2024-10-14','9999-12-31','2024-10-14','9999-12-31','18069019','Turkey',NULL,'Nestle Damak Caramel Croquant with Pistachio 6x60g','Nestle Damak Caramel Croquant with Pistachio 6x60g','8445291349292.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','201006','Ambient',0,0,0,0,0,NULL,NULL,NULL),(235,NULL,NULL,NULL,78,'470776','Prime Hydration Drink 12x500mL Haaland V2 (made to order)','12',12,12,'Case','810116125388','10810116125385','SOF10PRI101 PRIME','A',22,132,'DEFAULT',9.99,'2024-10-17','9999-12-31',0.500,0.020,365,'2026-07-03','STD',NULL,10.99,NULL,NULL,'2025-01-20','9999-12-31','2025-01-20','9999-12-31','2202991911','United Kingdom',NULL,'Prime Hydration Drink 12x500mL Haaland V2','Prime Hydration Drink 12x500mL Haaland V2','810116125388.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','PH1242EBH-UK','Ambient',0,0,0,0,0,NULL,NULL,NULL),(236,NULL,NULL,NULL,79,'469097','Yubi Bar Protein Bars Choc Orange 35G','12',12,12,'Case','5065013646244','5065013646282','CRI10YUB100 YUBI','A',84,840,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.040,0.003,210,'2026-05-07','STD',NULL,10.99,NULL,NULL,'2025-12-22','9999-12-31','2025-12-22','9999-12-31','21061020','United Kingdom',NULL,'Yubi Bar Protein Bars Choc Orange 35G','Yubi Bar Protein Bars Choc Orange 35G','5065013646244.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','YUB/COB/12','Ambient',0,0,0,0,0,NULL,NULL,NULL),(237,NULL,NULL,NULL,80,'469137','Kidsmania Chatty Chomper Candy Lollipop 17G','12',12,12,'Case','5031396087929','5031396087912','CON12KID105 KIDSMANIA','A',4,192,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.020,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,'2026-04-27','2026-06-16','2026-04-27','2026-06-16','17049099','Spain',NULL,'Kidsmania Chatty Chomper Candy Lollipop 17G','Kidsmania Chatty Chomper Candy Lollipop 17G','5031396087929.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(238,NULL,NULL,NULL,81,'470840','Baileys Original 35g Bar','20',20,20,'Case','5099872017082','5099872017587','CON11BAI100 BAILEYS','A',36,360,'DEFAULT',9.99,'2024-10-22','9999-12-31',0.035,0.003,360,'2026-09-06','STD',NULL,10.99,NULL,NULL,'2024-10-22','9999-12-31','2024-10-22','9999-12-31','18069010','Ireland',NULL,'Baileys Original 35g Bar','Baileys Original 35g Bar','5099872017082.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(239,NULL,NULL,NULL,82,'470416','Quality Street Box  265 g','12',12,12,'Case','5000426112160','5000426412161','CON11QUA101 QUALITY STREET','A',108,540,'DEFAULT',9.99,'2024-10-22','9999-12-31',0.270,0.003,285,'2026-04-14','STD',NULL,10.99,NULL,NULL,'2024-10-22','9999-12-31','2024-10-22','9999-12-31','18063290','United Kingdom',NULL,'Quality Street Box  265 g','Quality Street Box  265 g','5000426112160.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','12467903','Ambient',0,0,0,0,0,NULL,NULL,NULL),(240,NULL,NULL,NULL,83,'471016','Cathedral City Baked Bites (19.2g x 5) x 15 srp','15',15,15,'Case','72417194870','5010049194870','CRI10CAT100 CATHEDRAL','A',9,54,'DEFAULT',9.99,'2024-10-24','9999-12-31',0.930,0.003,270,'2026-06-08','STD',NULL,10.99,NULL,NULL,'2025-06-11','9999-12-31','2025-06-11','9999-12-31','19059045','United Kingdom',NULL,'Cathedral City Baked Bites (19.2g x 5) x 15 srp','Cathedral City Baked Bites (19.2g x 5) x 15 srp','72417194870.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(241,NULL,NULL,NULL,84,'470925','Cheery Chews Gummy Rush Atomic Peaches Tub 150G','12',12,12,'Case','6282356196659','6282356196666','CON12CHE105 CHEERY CHEWS','A',22,220,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.150,0.003,180,'2026-05-04','STD',NULL,10.99,NULL,NULL,'2025-11-29','9999-12-31','2025-11-29','9999-12-31','1700000000','Turkey',NULL,'Cheery Chews Gummy Rush Atomic Peaches Tub 150G','Cheery Chews Gummy Rush Atomic Peaches Tub 150G','6282356196659.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','9665','Ambient',0,0,0,0,0,NULL,NULL,NULL),(242,NULL,NULL,NULL,85,'471026','Skips Prawn Cocktail PM 50p 17g','30',30,30,'Case','5000237202715','5000237202708','CRI10SKI101 SKIPS','Z',10,70,'DEFAULT',9.99,'2025-11-13','9999-12-31',0.020,0.003,180,'2026-05-12','STD',NULL,10.99,NULL,NULL,'2025-11-13','9999-12-31','2025-11-13','9999-12-31','19059080','United Kingdom',NULL,'Skips Prawn Cocktail PM 50p 17g','Skips Prawn Cocktail PM 50p 17g','5000237202715.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','702783','Ambient',0,0,0,0,0,NULL,NULL,NULL),(243,NULL,NULL,NULL,86,'469361','Reeses Big Cup Puffs 9X16X98G','16',16,16,'Case','34000229178','5025820215590','CON11REE100 REESES','A',72,288,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.100,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','21069098','United Kingdom',NULL,'Reeses Big Cup Puffs 9X16X98G','Reeses Big Cup Puffs 9X16X98G','34000229178.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','3400022916LS','Ambient',0,0,0,0,0,NULL,NULL,NULL),(244,NULL,NULL,NULL,87,'469003','HELL ICE COFFEE DOUBLE ESPRESSO','12',12,12,'Case','5999571051342','5999571053193','ENE10HEL100 HELL','A',12,120,'DEFAULT',9.99,'2025-01-17','9999-12-31',0.250,0.003,180,'2026-02-03','STD',NULL,10.99,NULL,NULL,'2025-08-07','9999-12-31','2025-08-07','9999-12-31','2202101','Hungary',NULL,'ICE COFFEE DOUBLE ESPRESSO','ICE COFFEE DOUBLE ESPRESSO','5999571051342.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','6100002712','Ambient',0,0,0,0,0,NULL,NULL,NULL),(245,NULL,NULL,NULL,88,'471167','MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','12',12,12,'Case','5060476290737','15060476290734','SOF10MEG100 MEGA BRAIN','A',20,180,'DEFAULT',9.99,'2024-11-27','9999-12-31',0.500,0.003,280,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2024-11-27','9999-12-31','2024-11-27','9999-12-31','17049000','United Kingdom',NULL,'MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','5060476290737.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','MBL01','Ambient',0,0,0,0,0,NULL,NULL,NULL),(246,NULL,NULL,NULL,89,'462571','Millions Tubes Strawberry 55g','12',12,12,'Case','5017375134709','5017375234706','CON12MIL100 MILLIONS','A',120,720,'DEFAULT',9.99,'2024-11-27','9999-12-31',0.750,0.003,730,'2027-09-04','STD',NULL,10.99,NULL,NULL,'2025-06-13','9999-12-31','2025-06-13','9999-12-31','17049061','United Kingdom',NULL,'Millions Tubes Strawberry 55g','Millions Tubes Strawberry 55g','5017375 134709.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','3470','Ambient',0,0,0,0,0,NULL,NULL,NULL),(247,NULL,NULL,NULL,90,'471210','Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','12',12,12,'Case','7340001804447','27340001804151','CRI10BAR103 BAREBELLS','A',24,360,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.060,0.003,210,'2026-06-03','STD',NULL,10.99,NULL,NULL,'2025-12-22','9999-12-31','2025-12-22','9999-12-31','1810000000','United Kingdom',NULL,'Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','7340001804447.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','B1055-GBDKNO','Ambient',0,0,0,0,0,NULL,NULL,NULL),(248,NULL,NULL,NULL,91,'471286','Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','4',4,4,'Case','8445291265714','8445291265721','PET10FEL100 FELIX','A',18,126,'DEFAULT',9.99,'2026-05-28','9999-12-31',1.020,0.009,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,'2026-05-28','9999-12-31','2026-05-28','9999-12-31','23091011','Switzerland',NULL,'Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','8445291265714.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','12586413','Ambient',0,0,0,0,0,NULL,NULL,NULL),(249,NULL,NULL,NULL,92,'471345','Vita Coco Pressed 330Ml','12',12,12,'Case','898999011073','5060232812265','SOF10VIT101 VITA','A',24,192,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.330,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','22021000','United Kingdom',NULL,'Vita Coco Pressed 330Ml','Vita Coco Pressed 330Ml','898999011073.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','901505','Ambient',0,0,0,0,0,NULL,NULL,NULL),(250,NULL,NULL,NULL,93,'471382','Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','11',11,11,'Case','5016451444329','5016451884323','CRI10SEA101 SEABROOK','A',12,96,'DEFAULT',9.99,'2025-01-09','9999-12-31',0.070,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2025-04-11','9999-12-31','2025-04-11','9999-12-31','20052020','United Kingdom',NULL,'Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','5016451444329.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','432R','Ambient',0,0,0,0,0,NULL,NULL,NULL),(251,NULL,NULL,NULL,94,'471392','Huel Daily A-Z Cherry & Raspberry 330Ml','12',12,12,'Case','5060925290837','5060925291742','SOF10HUE100 HUEL','A',26,234,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.330,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','17049000','United Kingdom',NULL,'Huel Daily A-Z Cherry & Raspberry 330Ml','Huel Daily A-Z Cherry & Raspberry 330Ml','5060925290837.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','AZV12CRA','Ambient',0,0,0,0,0,NULL,NULL,NULL),(252,NULL,NULL,NULL,95,'471478','Celtic Spring Sports Cap 1L','12',12,12,'Case','5019490312550','5019490312567','WAT10CEL100 CELTIC','A',11,66,'DEFAULT',9.99,'2025-01-09','9999-12-31',1.000,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2025-04-11','9999-12-31','2025-04-11','9999-12-31','22029915','United Kingdom',NULL,'Celtic Spring Sports Cap 1L','Celtic Spring Sports Cap 1L','5019490312550.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FG-469','Ambient',0,0,0,0,0,NULL,NULL,NULL),(253,NULL,NULL,NULL,96,'471707','Milo Powder Ghana 400G','6',6,6,'Case','6033000085658','7613036973175','GRO10MIL105 MILO','A',16,144,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.400,0.003,540,'2027-11-09','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','402219100','United Kingdom',NULL,'Milo Instant Malt Chocolate - Ghana 6X400G','Milo Instant Malt Chocolate - Ghana 6X400G','7613036973175.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','12400394','Ambient',0,0,0,0,0,NULL,NULL,NULL),(254,NULL,NULL,NULL,97,'471710','PRINCES TUNA CHNK SFO 12X145G PMP ┬ú1.59','12',12,12,'Case','5000232031501','5000232031518','GRO10PRI100 P','Z',22,352,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.150,0.003,210,'2026-06-03','STD',NULL,10.99,NULL,NULL,'2025-11-29','9999-12-31','2025-11-29','9999-12-31','2000000000','United Kingdom',NULL,'PRINCES TUNA CHNK SFO 12X145G PMP ├âÔÇÜ┬ú1.59','PRINCES TUNA CHNK SFO 12X145G PMP ├âÔÇÜ┬ú1.59','5000232031501.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','440421','Ambient',0,0,0,0,0,NULL,NULL,NULL),(255,NULL,NULL,NULL,98,'471094','Beech\'s Champagne Truffles','5',5,5,'Case','5011701003011','5011701003103','CON11BEE100 BEECHS','A',18,180,'DEFAULT',9.99,'2025-02-06','9999-12-31',0.140,0.003,365,'2026-07-03','STD',NULL,10.99,NULL,NULL,'2024-10-30','9999-12-31','2024-10-30','9999-12-31','1806901100','United Kingdom',NULL,'Beech\'s Champagne Truffles 140g','Beech\'s Champagne Truffles 140g','5011701003011.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','290','Ambient',0,0,0,0,0,NULL,NULL,NULL),(256,NULL,NULL,NULL,99,'472503','Milka Cow Spots 90G','24',24,24,'Case','7622202262524','7622202262517','CON11MIL107 MILKA','A',21,319,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.090,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Milka Cow Spots 90G','Milka Cow Spots 90G','7622202262524.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','4317134','Ambient',0,0,0,0,0,NULL,NULL,NULL),(257,NULL,NULL,NULL,100,'471234','McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','10',10,10,'Case','5000168006673','5000168006680','CON11MCV103 MCVITIES CAKES','A',20,180,'DEFAULT',9.99,'2025-10-20','9999-12-31',0.300,0.001,210,'2026-04-03','STD',NULL,10.99,NULL,NULL,'2025-10-13','9999-12-31','2025-10-13','9999-12-31','1905907000','United Kingdom',NULL,'McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','5000168006673.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','45758','Ambient',0,0,0,0,0,NULL,NULL,NULL),(258,NULL,NULL,NULL,101,'471648','Tate & Lyles Topping Syrup Butterscotch 325g','6',6,6,'Case','5010115201006','5010115900633','GRO10TAT100 TATE & LYLE','Z',50,350,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.325,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,'2025-09-18','9999-12-31','2025-09-18','9999-12-31','21032000','United Kingdom',NULL,'Tate & Lyles Topping Syrup Butterscotch 325g','Tate & Lyles Topping Syrup Butterscotch 325g','5010115201006.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','432792','Ambient',0,0,0,0,0,NULL,NULL,NULL),(259,NULL,NULL,NULL,102,'472812','Lorenz Crunchips XCut Cheese & Onion 12x75g','12',12,12,'Case','4018077773228','4018077000324','CRI10LOR101 LORENZ','A',10,80,'DEFAULT',9.99,'2025-03-19','9999-12-31',0.080,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2025-03-19','9999-12-31','2025-03-19','9999-12-31','20052020','Poland',NULL,'Lorenz Crunchips XCut Cheese & Onion 12x75g','Lorenz Crunchips XCut Cheese & Onion 12x75g','4018077773228.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','47553','Ambient',0,0,0,0,0,NULL,NULL,NULL),(260,NULL,NULL,NULL,103,'473130','Aquafresh Kids Milk Teeth 50Ml','12',12,12,'Case','5000347090967','5000469090968','DEN10AQU100 AQUAFRESH','A',70,490,'DEFAULT',9.99,'2025-09-29','9999-12-31',0.050,0.003,365,'2026-09-29','STD',NULL,10.99,NULL,NULL,'2025-04-07','9999-12-31','2025-04-07','9999-12-31','33049900','United Kingdom',NULL,'Aquafresh Kids Milk Teeth 50Ml','Aquafresh Kids Milk Teeth 50Ml','5000347090967.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','AQU50MT','Ambient',0,0,0,0,0,NULL,NULL,NULL),(261,NULL,NULL,NULL,104,'472642','Mornflake Chocolate Squares Pmp 2.49 375G','6',6,6,'Case','5010026520906','5010026520913','CER10MOR100 MORNFLAKE','A',18,108,'DEFAULT',9.99,'2026-04-13','9999-12-31',0.380,0.003,210,'2026-08-13','STD',NULL,10.99,NULL,NULL,'2026-04-13','9999-12-31','2026-04-13','9999-12-31','11041200','United Kingdom',NULL,'Mornflake Chocolate Squares Pmp 2.49 375G','Mornflake Chocolate Squares Pmp 2.49 375G','5010026520906.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','CR048103','Ambient',0,0,0,0,0,NULL,NULL,NULL),(262,NULL,NULL,NULL,105,'472648','Pastri Shop - Choc Drizzle Pastries 3Pk 165G','15',15,15,'Case','703694584541','7036945845416','CRI10PAS100 PASTRI SHOP','A',15,165,'DEFAULT',9.99,'2025-11-03','9999-12-31',0.170,0.000,365,'2026-09-10','STD',NULL,10.99,NULL,NULL,'2025-11-03','9999-12-31','2025-11-03','9999-12-31','19059070','Spain',NULL,'Pastri Shop - Choc Drizzle Pastries 3Pk 165G','Pastri Shop - Choc Drizzle Pastries 3Pk 165G','703694584541.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','PS09','Ambient',0,0,0,0,0,NULL,NULL,NULL),(263,NULL,NULL,NULL,106,'472671','Swizzels 6X60 Refreshers Tropical Chew Bar','6',6,6,'Case','5010478715486','5010478779143','CON12TRO105 TROPICAL','A',15,75,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.180,0.015,365,'2027-05-18','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','17049065','United Kingdom',NULL,'Tropical Chew Bar 20P 18G','Tropical Chew Bar 20P 18G','5010478715486.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','74767','Ambient',0,0,0,0,0,NULL,NULL,NULL),(264,NULL,NULL,NULL,107,'474033','Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','24',24,24,'Case','4820219341291','4820219341659','CON12BOB100 BOB SNAIL','A',84,252,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.030,0.003,180,'2026-04-07','STD',NULL,10.99,NULL,NULL,'2025-12-22','9999-12-31','2025-12-22','9999-12-31','1810000000','Ukraine',NULL,'Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','4820219341291.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(265,NULL,NULL,NULL,108,'474176','CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','12',12,12,'Case','5011597538000','5011597537775','HOU10CLE103 CLEAN UPS','A',72,1152,'DEFAULT',9.99,'2025-04-30','9999-12-31',0.110,0.080,500,'2026-12-07','STD',NULL,10.99,NULL,NULL,'2025-04-30','9999-12-31','2025-04-30','9999-12-31','6307101000','China',NULL,'CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','5011597538000.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','CU104N-1','Ambient',0,0,0,0,0,NULL,NULL,NULL),(266,NULL,NULL,NULL,109,'474350','Tenzing Lime And Mint 330Ml','12',12,12,'Case','5060444851038','5060444851045','ENE10TEN101 TENZING','A',26,234,'DEFAULT',9.99,'2025-08-04','9999-12-31',0.330,0.003,365,'2026-08-04','STD',NULL,10.99,NULL,NULL,'2025-08-04','9999-12-31','2025-08-04','9999-12-31','8194764','United Kingdom',NULL,'Tenzing Lime And Mint 330Ml','Tenzing Lime And Mint 330Ml','5060444851038.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','TENCAS12LM330-UK','Ambient',0,0,0,0,0,NULL,NULL,NULL),(267,NULL,NULL,NULL,110,'969633','CROWN SWEET CORN 3X8','8',8,8,'Case','5065017471033','15065017471023','GRO10CRO109 CROWN','Z',19,190,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.552,0.003,1090,'2028-08-31','STD',NULL,10.99,NULL,NULL,'2025-08-07','9999-12-31','2025-08-07','9999-12-31','20058000','United Kingdom',NULL,'CROWN SWEET CORN 3X8','CROWN SWEET CORN 3X8','11111.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(268,NULL,NULL,NULL,111,'474865','Dylon Spray Starch With Easy Iron 300Ml','6',6,6,'Case','5000325049543','5000325049550','HOU10DYL100 DYLON','A',56,280,'DEFAULT',9.99,'2026-03-03','9999-12-31',0.300,0.003,365,'2027-03-03','STD',NULL,10.99,NULL,NULL,'2026-03-03','9999-12-31','2026-03-03','9999-12-31','6307103000','United Kingdom',NULL,'Dylon Spray Starch With Easy Iron 300Ml','Dylon Spray Starch With Easy Iron 300Ml','5000325049543.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','11082','Ambient',0,0,0,0,0,NULL,NULL,NULL),(269,NULL,NULL,NULL,112,'474682','Buxton Sparkling 8x50cl MP Semi','8',8,8,'Case','7613287034489','7613287034489','WAT10BUX100 BUXTON','Z',30,180,'DEFAULT',9.99,'2025-06-17','9999-12-31',0.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2025-06-17','9999-12-31','2025-06-17','9999-12-31','2201101100','United Kingdom',NULL,'Buxton Sparkling 8x50cl MP Semi','Buxton Sparkling 8x50cl MP Semi','7613287034489.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(270,NULL,NULL,NULL,113,'475397','Perrier Water 4 x 330cl','6',6,6,'Case','5015552555132','5015552555118','WAT10PER100 PERRIER','A',21,84,'DEFAULT',9.99,'2025-06-09','9999-12-31',1.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,'2025-06-17','9999-12-31','2025-06-17','9999-12-31','2201101900','United Kingdom',NULL,'Perrier Water 4 x 330cl','Perrier Water 4 x 330cl','5015552555132.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23',NULL,'Ambient',0,0,0,0,0,NULL,NULL,NULL),(271,NULL,NULL,NULL,114,'475657','Sarsons Dip & Drizzle Original 250G','8',8,8,'Case','5060336504141','5060336504134','GRO10SAR100 SARSONS','A',60,300,'DEFAULT',9.99,'2026-01-05','9999-12-31',0.250,0.003,210,'2026-07-14','STD',NULL,10.99,NULL,NULL,'2026-01-05','9999-12-31','2026-01-05','9999-12-31','2103903000','United Kingdom',NULL,'Sarsons Dip & Drizzle Original 250G','Sarsons Dip & Drizzle Original 250G','5060336504141.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','2000846','Ambient',0,0,0,0,0,NULL,NULL,NULL),(272,NULL,NULL,NULL,115,'460851','Freedom 4pk 2ply TT Soft White','40',40,40,'Case','5028635000610','5026874000118','HOU10FRE100 FREEDOM','A',11,55,'DEFAULT',9.99,'2025-08-11','9999-12-31',0.070,0.010,999,'2028-05-06','STD',NULL,10.99,NULL,NULL,'2025-08-11','9999-12-31','2025-08-11','9999-12-31','48181090','United Kingdom',NULL,'Freedom 4pk 2ply TT Soft White','Freedom 4pk 2ply TT Soft White','5028635000610.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FRT24','Ambient',0,0,0,0,0,NULL,NULL,NULL),(273,NULL,NULL,NULL,116,'478511','KULANA ORANGE BLEND JUICE 12X1LTR SLIM','12',12,12,'Case','5011064014419','5011064014426','SOF10KUL100 KULANA','A',15,75,'DEFAULT',9.99,'2025-07-02','9999-12-31',1.000,0.003,270,'2026-03-30','STD',NULL,10.99,NULL,NULL,'2025-07-02','9999-12-31','2025-07-02','9999-12-31','10732800','Ireland',NULL,'KULANA ORANGE BLEND JUICE 12X1LTR SLIM','KULANA ORANGE BLEND JUICE 12X1LTR SLIM','5011064014419.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','145496','Ambient',0,0,0,0,0,NULL,NULL,NULL),(274,NULL,NULL,NULL,117,'478648','Kettle Lightly Salted 130g','12',12,12,'Case','5017764901356','5017764128104','CRI10KET100 KETTLE','A',8,72,'DEFAULT',9.99,'2025-12-15','9999-12-31',0.130,0.003,210,'2026-07-13','STD',NULL,10.99,NULL,NULL,'2025-12-15','9999-12-31','2025-12-15','9999-12-31','19019099','United Kingdom',NULL,'Kettle Lightly Salted 130g','Kettle Lightly Salted 130g','5017764901356.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FG002956','Ambient',0,0,0,0,0,NULL,NULL,NULL),(275,NULL,NULL,NULL,118,'480070','Tropicana Apple PM 1.50 250Ml','12',12,12,'Case','1210002009096','1210002009089','CHI11TRO107 TROPICANA','A',29,232,'DEFAULT',9.99,'2025-09-08','9999-12-31',0.250,0.003,210,'2026-02-11','STD',NULL,10.99,NULL,NULL,'2025-09-08','9999-12-31','2025-09-08','9999-12-31','2202991911','United Kingdom',NULL,'Tropicana Apple PM 1.50 250Ml','Tropicana Apple PM 1.50 250Ml','1210002009096.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(276,NULL,NULL,NULL,119,'480226','Pot Noodle Sticky Rib 90g','12',12,12,'Case','8718114797977','8718114930251','GRO10POT100 POT NOODLES','Z',10,100,'DEFAULT',9.99,'2026-01-01','9999-12-31',0.090,0.000,159,'2025-12-31','STD',NULL,10.99,NULL,NULL,'2026-01-01','9999-12-31','2026-01-01','9999-12-31','19023010','United Kingdom',NULL,'Pot Noodle Sticky Rib 90g','Pot Noodle Sticky Rib 90g','8718114797977.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','67492328','Ambient',0,0,0,0,0,NULL,NULL,NULL),(277,NULL,NULL,NULL,120,'480422','Munchkings Pretzel Crush, Honey, Mustard, Onion','9',9,9,'Case','5060789600391','5060789600391','CRI10MUN101 MUNCHKINGS','A',24,264,'DEFAULT',9.99,'2025-08-06','9999-12-31',0.125,0.003,210,'2026-03-04','STD',NULL,10.99,NULL,NULL,'2025-08-06','9999-12-31','2025-08-06','9999-12-31','1905905500','Bulgaria',NULL,'Munchkings Pretzel Crush, Honey, Mustard, Onion','Munchkings Pretzel Crush, Honey, Mustard, Onion','5060789600391.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','5060789600391','Ambient',0,0,0,0,0,NULL,NULL,NULL),(278,NULL,NULL,NULL,121,'480514','Levi Roots Caribbean Crush Pm 1.15 500Ml','12',12,12,'Case','5010438020650','5010438020865','SOF10LEV100 LEVI ROOTS','A',22,154,'DEFAULT',9.99,'2026-03-21','9999-12-31',0.500,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,'2026-03-21','9999-12-31','2026-03-21','9999-12-31','22090011','United Kingdom',NULL,'Levi Roots Caribbean Crush Pm 1.15 500Ml','Levi Roots Caribbean Crush Pm 1.15 500Ml','5010438020650.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','8332','Ambient',0,0,0,0,0,NULL,NULL,NULL),(279,NULL,NULL,NULL,122,'480923','Sweetzone Blue Raspberry Bottles','6',6,6,'Case','5032860060035','5032860960205','CON12SWE102 Sweetzone','A',10,100,'DEFAULT',9.99,'2025-09-02','9999-12-31',0.805,0.003,210,'2026-03-31','STD',NULL,10.99,NULL,NULL,'2025-09-02','9999-12-31','2025-09-02','9999-12-31','22021025','United Kingdom',NULL,'Sweetzone Blue Raspberry Bottles','Sweetzone Blue Raspberry Bottles','5032860060035.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','SZTBSMBRB','Ambient',0,0,0,0,0,NULL,NULL,NULL),(280,NULL,NULL,NULL,123,'480842','Riva Foods  Retail garlic baguettes','1',1,1,'Case','4056489462064','4056489462064','GRO10RIV100 RIVA FOOD','A',10,80,'DEFAULT',9.99,'2025-09-03','9999-12-31',0.205,0.003,210,'2026-04-01','STD',NULL,10.99,NULL,NULL,'2025-09-03','9999-12-31','2025-09-03','9999-12-31','20079990','United Kingdom',NULL,'Riva Foods  Retail garlic baguettes','Riva Foods  Retail garlic baguettes','4056489462064.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','BR035','Ambient',0,0,0,0,0,NULL,NULL,NULL),(281,NULL,NULL,NULL,124,'460868','Winter Spices Disinfectant','12',12,12,'Case','5000185116454','5000185037148','HOU10EAS101 EASY','A',20,140,'DEFAULT',9.99,'2024-02-27','9999-12-31',0.040,0.003,999,'2028-04-19','STD',NULL,10.99,NULL,NULL,'2024-02-27','9999-12-31','2024-02-27','9999-12-31','34022090','United Kingdom',NULL,'Easy Winter Spices Disinfectant','Easy Winter Spices Disinfectant','5000185116454.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','2007818','Ambient',0,0,0,0,0,NULL,NULL,NULL),(282,NULL,NULL,NULL,125,'481478','Yazoo Banana 300Ml','12',12,12,'Case','5410438035874','5410438035881','CHI11YAZ107 YAZOO','Z',22,176,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.300,0.003,210,'2026-07-20','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','19059080','United Kingdom',NULL,'Yazoo Banana 300Ml','Yazoo Banana 300Ml','5410438035874.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','704524','Ambient',0,0,0,0,0,NULL,NULL,NULL),(283,NULL,NULL,NULL,126,'481481','Takis Blue Heat 100G','18',18,18,'Case','5018297012236','5018297012243','CRI10TAK100 TAKIS','Z',10,70,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.100,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','19059080','United Kingdom',NULL,'Takis Blue Heat 100G','Takis Blue Heat 100G','5018297012236.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','512064','Ambient',0,0,0,0,0,NULL,NULL,NULL),(284,NULL,NULL,NULL,127,'481538','Pipers Crisps Anglesey Sea Salt 40G','24',24,24,'Case','5033060100125','5033060101177','CRI10PIP101 PIPERS','A',16,96,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.040,0.022,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-05-25','9999-12-31','2026-05-25','9999-12-31','19059045','United Kingdom',NULL,'Pipers Crisps Anglesey Sea Salt 40G','Pipers Crisps Anglesey Sea Salt 40G','5033060100125.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','CRIANG016','Ambient',0,0,0,0,0,NULL,NULL,NULL),(285,NULL,NULL,NULL,128,'480816','C4 Energy Crb Cosmic Rainbow','12',12,12,'Case','842595119145','842595119152','ENE10C4E100 C4 ENERGY','A',18,144,'DEFAULT',9.99,'2025-10-16','9999-12-31',0.500,0.000,210,'2026-05-14','STD',NULL,10.99,NULL,NULL,'2025-10-16','9999-12-31','2025-10-16','9999-12-31','2202100000','Poland',NULL,'C4 Energy Crb Cosmic Rainbow','C4 Energy Crb Cosmic Rainbow','842595119145.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(286,NULL,NULL,NULL,129,'481739','PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','12',12,12,'Case','5060119292036','5060119291961','CON11PHD100 PHD','A',72,576,'DEFAULT',9.99,'2025-10-30','9999-12-31',0.064,0.000,210,'2026-05-28','STD',NULL,10.99,NULL,NULL,'2025-10-30','9999-12-31','2025-10-30','9999-12-31','19059080','United Kingdom',NULL,'PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','5060119292036.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','131989','Ambient',0,0,0,0,0,NULL,NULL,NULL),(287,NULL,NULL,NULL,130,'460938','Tiama Celeb Bodyspray Female 75Ml','6',6,6,'Case','5028748008442','5028748108227','HEA10TIA100 TIAMA','A',128,1152,'DEFAULT',9.99,'2025-11-24','9999-12-31',0.080,0.003,730,'2027-11-24','STD',NULL,10.99,NULL,NULL,'2025-11-24','9999-12-31','2025-11-24','9999-12-31','82122000','United Kingdom',NULL,'Tiama Celeb Bodyspray Female 75Ml','Tiama Celeb Bodyspray Female 75Ml','5028748008442.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FBS-71198','Ambient',0,0,0,0,0,NULL,NULL,NULL),(288,NULL,NULL,NULL,131,'481912','Bakehouse Minis Cookies 200g','20',20,20,'Case','5397139001851','5397139001868','BIS10BAK100 BAKEHOUSE','Z',18,126,'DEFAULT',9.99,'2025-11-12','9999-12-31',0.200,0.000,210,'2026-06-10','STD',NULL,10.99,NULL,NULL,'2025-11-12','9999-12-31','2025-11-12','9999-12-31','19059080','United Kingdom',NULL,'Bakehouse Minis Cookies 200g','Bakehouse Minis Cookies 200g','5397139001851.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','FEB078','Ambient',0,0,0,0,0,NULL,NULL,NULL),(289,NULL,NULL,NULL,132,'462405','Dr Johnson Antiseptic Disinfectant Original','12',12,12,'Case','5025416330027','5025416331024','HOU10DRJ100 DR JOHNSON','A',20,140,'DEFAULT',9.99,'2025-08-11','9999-12-31',0.500,0.003,365,'2026-08-11','STD',NULL,10.99,NULL,NULL,'2025-08-11','9999-12-31','2025-08-11','9999-12-31','22090011','United Kingdom',NULL,'Dr Johnson Antiseptic Disinfectant Original','Dr Johnson Antiseptic Disinfectant Original','5025416330027.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','ASD500','Ambient',0,0,0,0,0,NULL,NULL,NULL),(290,NULL,NULL,NULL,133,'482063','UFIT High Protein Shake Drink Chocolate PMP ┬ú1.79','8',8,8,'Case','5060317323556','5060317323563','SOF10UFI100 UFIT','Z',31,248,'DEFAULT',9.99,'2026-03-21','9999-12-31',0.310,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,'2026-03-21','9999-12-31','2026-03-21','9999-12-31','22029995','United Kingdom',NULL,'UFIT High Protein Shake Drink Chocolate PMP ┬ú1.79','UFIT High Protein Shake Drink Chocolate PMP ┬ú1.79','5060317323556.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(291,NULL,NULL,NULL,134,'444992','Goldenfry Beef Gravy Granules 300g','6',6,6,'case','5010105001760','5010105001777','GRO10GOL101 GOLDENFRY','Z',30,270,'DEFAULT',9.99,'2025-12-04','9999-12-31',0.300,0.020,210,'2026-07-02','STD',NULL,10.99,NULL,NULL,'2025-12-04','9999-12-31','2025-12-04','9999-12-31','21039090','United Kingdom',NULL,'Goldenfry Beef Gravy Granules 300g','Goldenfry Beef Gravy Granules 300g','5010105001760.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','329','Ambient',0,0,0,0,0,NULL,NULL,NULL),(292,NULL,NULL,NULL,135,'482364','Pophouse Caramelized Popcorn Classic 180G','15',15,15,'Case','4751028310201','4751028310881','CRI10POP107 POPHOUSE','A',80,144,'DEFAULT',9.99,'2025-12-15','9999-12-31',0.180,0.000,365,'2026-12-15','STD',NULL,10.99,NULL,NULL,'2025-12-15','9999-12-31','2025-12-15','9999-12-31','19019099','United Kingdom',NULL,'Pophouse Caramelized Popcorn Classic 180G','Pophouse Caramelized Popcorn Classic 180G','4751028310201.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','POP01','Ambient',0,0,0,0,0,NULL,NULL,NULL),(293,NULL,NULL,NULL,136,'482414','Dash Sparkling Peach','12',12,12,'Case','5060489730206','15060489730203','SOF10DAS100 DASH','A',26,208,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.330,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-06-08','2026-07-26','2026-06-08','2026-07-26','21069098','United Kingdom',NULL,'Dash Sparkling Peach','Dash Sparkling Peach','5060489730206.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','DBL004','Ambient',0,0,0,0,0,NULL,NULL,NULL),(294,NULL,NULL,NULL,57,'482509','Bahlsen Chocolate Leibniz Snack Packs 27.5G','30',30,30,'Case','4017100210860','4017100210860','CON11BAH100 BAHLSEN','Z',30,510,'DEFAULT',9.99,'2026-05-26','9999-12-31',0.030,0.003,210,'2026-12-22','STD',NULL,10.99,NULL,NULL,'2026-05-26','9999-12-31','2026-05-26','9999-12-31','1704906500','United Kingdom',NULL,'Bahlsen Chocolate Leibniz Snack Packs 27.5G','Bahlsen Chocolate Leibniz Snack Packs 27.5G','4017100210860.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(295,NULL,NULL,NULL,137,'482813','Gnaw 70% Dark Chocolate','15',15,15,'Case','5060463492359','5060463492359','CON11GNA101 GNAW','A',12,120,'DEFAULT',9.99,'2026-01-08','9999-12-31',0.080,0.000,210,'2026-08-06','STD',NULL,10.99,NULL,NULL,'2026-01-08','9999-12-31','2026-01-08','9999-12-31','19053191','United Kingdom',NULL,'Gnaw 70% Dark Chocolate','Gnaw 70% Dark Chocolate','5060463492359.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','GPN0001','Ambient',0,0,0,0,0,NULL,NULL,NULL),(296,NULL,NULL,NULL,138,'482900','Maretti Bruschette Tomato','7',7,7,'Case','3800205875109','23800205875639','CRI10MAR113 MARETTI','Z',27,324,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.070,0.015,240,'2026-12-26','STD',NULL,10.99,NULL,NULL,'2026-05-16','9999-12-31','2026-05-16','9999-12-31','17049000','United Kingdom',NULL,'Maretti Bruschette Tomato','Maretti Bruschette Tomato','3800205875109.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','S214305','Ambient',0,0,0,0,0,NULL,NULL,NULL),(297,NULL,NULL,NULL,139,'482805','Ultrex 10\'s Ultra Slim (4x12)','48',48,48,'Case','5060110223374','5060110223374','HEA10ULT100 ULTREX','Z',15,60,'DEFAULT',9.99,'2026-02-03','9999-12-31',0.150,0.000,210,'2026-12-16','STD',NULL,10.99,NULL,NULL,'2026-01-20','9999-12-31','2026-01-20','9999-12-31','404103600','United Kingdom',NULL,'Ultrex 10\'s Ultra Slim (4x12)','Ultrex 10\'s Ultra Slim (4x12)','5060110223374.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','2318','Ambient',0,0,0,0,0,NULL,NULL,NULL),(298,NULL,NULL,NULL,140,'483252','Ferrero Rocher T24 X6 Diamond','6',6,6,'Case','8000500009673','8000500143353','CON11FER100 FERRERO ROCHER','A',18,108,'DEFAULT',9.99,'2026-04-27','9999-12-31',0.310,0.010,225,'2026-12-08','STD',NULL,10.99,NULL,NULL,'2026-04-27','9999-12-31','2026-04-27','9999-12-31','18069039','Italy',NULL,'Ferrero Rocher T24 X6 Diamond','Ferrero Rocher T24 X6 Diamond','8000500009673.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','XGB620794','Ambient',0,0,0,0,0,NULL,NULL,NULL),(299,NULL,NULL,NULL,141,'463463','NESQUIK Cereal Bar MP 8(6x25g) N2 GB','8',8,8,'CASE','5900020031372','5900020031389','CER10NES109 NESQUIK','Z',21,147,'DEFAULT',9.99,'2024-04-11','9999-12-31',0.150,0.010,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,'2024-05-03','9999-12-31','2024-05-03','9999-12-31','1905907000','United Kingdom',NULL,'NESQUIK Cereal Bar MP 8(6x25g) N2 GB','NESQUIK Cereal Bar MP 8(6x25g) N2 GB','5900020031372.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(300,NULL,NULL,NULL,142,'464141','Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','24',24,24,'Case','74312002496','10074312002493','HEA10NAT100 NATURE\'S BOUNTY','Z',12,96,'DEFAULT',9.99,'2024-04-05','9999-12-31',0.030,0.010,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,'2024-04-02','9999-12-31','2024-04-02','9999-12-31','2106909285','United Kingdom',NULL,'Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','74312002496.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','12539263','Ambient',0,0,0,0,0,NULL,NULL,NULL),(301,NULL,NULL,NULL,143,'466144','Greenshield Anti-Bac Floor Wipes 24\'s','12',12,12,'Case','5060110227495','5060110227549','HOU10GRE100 GREENSHIELD','A',100,100,'DEFAULT',9.99,'2024-05-10','9999-12-31',0.100,0.003,365,'2026-09-11','STD',NULL,10.99,NULL,NULL,'2024-05-10','9999-12-31','2024-05-10','9999-12-31','34022090','United Kingdom',NULL,'Greenshield Anti-Bac Floor Wipes 24\'s','Greenshield Anti-Bac Floor Wipes 24\'s','5060110227495.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(302,NULL,NULL,NULL,144,'486096','Moo free Mini Bars Milk','20',20,20,'Case','5060235830938','15060235830935','CON11MOO101 MOO FREE','A',11,847,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.020,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,'2026-05-16','9999-12-30','2026-05-16','9999-12-30','18063210','United Kingdom',NULL,'Moo free Mini Bars Milk','Moo free Mini Bars Milk','5060235830938.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(303,NULL,NULL,NULL,145,'486231','Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','10',10,10,'Case','5000186802585','5000186696108','HOU10COM100 COMFORT','A',15,90,'DEFAULT',9.99,'2026-04-03','9999-12-31',1.000,0.002,999,'2028-12-27','STD',NULL,10.99,NULL,NULL,'2026-04-03','9999-12-31','2026-04-03','9999-12-31','34025090','United Kingdom',NULL,'Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','5000186802585.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','64367608','Ambient',0,0,0,0,0,NULL,NULL,NULL),(304,NULL,NULL,NULL,52,'466310','Walkers Dark Chocolates Mint Cream Thins','24',24,24,'Case','5011555024811','5011555022312','CON11WAL100 WALKERS','A',11,132,'DEFAULT',9.99,'2024-05-29','9999-12-31',0.140,0.010,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,'2024-05-29','9999-12-31','2024-05-29','9999-12-31','18069019','United Kingdom',NULL,'Walkers Dark Chocolates Mint Cream Thins','Walkers Dark Chocolates Mint Cream Thins','5011555024811.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','116707','Ambient',0,0,0,0,0,NULL,NULL,NULL),(305,NULL,NULL,NULL,146,'442591','AriZona Iced Tea Lemon *6x500ml','6',6,6,'Case','613008730697','613008732530','SOF10ARI101 ARIZONA','A',29,203,'DEFAULT',9.99,'2024-02-06','9999-12-31',0.550,0.003,240,'2026-05-09','STD',NULL,10.99,NULL,NULL,'2024-02-06','9999-12-31','2024-02-06','9999-12-31','22021024','United Kingdom',NULL,'AriZona Iced Tea Lemon *6x500ml','AriZona Iced Tea Lemon *6x500ml','442591.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:23','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(306,NULL,NULL,NULL,147,'442808','Stute Superior Pure Apple Juice 1 Ltr','12',12,12,'Case','5060628820423','15060628820420','SOF10STU100 STUTE','A',15,75,'DEFAULT',9.99,'2024-02-08','9999-12-31',1.040,0.010,300,'2026-07-15','STD',NULL,10.99,NULL,NULL,'2024-02-08','9999-12-31','2024-02-08','9999-12-31','22021000','United Kingdom',NULL,'Stute Superior Pure Apple Juice 1 Ltr','Stute Superior Pure Apple Juice 1 Ltr','5060628820423.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(307,NULL,NULL,NULL,148,'610154','NAKD BLUEBERRY MUFFIN','18',18,18,'Case','5060088705940','5060088705957','CRI10NAK105 Nakd','A',0,720,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.040,0.003,95,'2026-09-06','STD',NULL,10.99,NULL,NULL,'2026-06-05','2026-08-16','2026-06-05','2026-08-16','20089778','United Kingdom',NULL,'NAKD BLUEBERRY MUFFIN','NAKD BLUEBERRY MUFFIN','5060088705940.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','70104896','Ambient',0,0,0,0,0,NULL,NULL,NULL),(308,NULL,NULL,NULL,149,'487049','Yorkshire Tea Bags 10x80','10',10,10,'Case','5010357112061','5010357112061','HOT10YOR101 YORKSHIRE TEA','A',18,108,'DEFAULT',9.99,'2026-04-23','9999-12-31',0.250,0.000,210,'2026-11-19','STD',NULL,10.99,NULL,NULL,'2026-04-23','9999-12-31','2026-04-23','9999-12-31','9023000','United Kingdom',NULL,'Yorkshire Tea Bags 10x80','Yorkshire Tea Bags 10x80','5010357112061.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','1019','Ambient',0,0,0,0,0,NULL,NULL,NULL),(309,NULL,NULL,NULL,150,'487184','Lees 10 Snowballs','12',12,12,'Case','5010082133263','5010082233277','CON11LEE101 LEES','Z',8,80,'DEFAULT',9.99,'2026-04-23','9999-12-31',0.125,0.001,210,'2026-11-19','STD',NULL,10.99,NULL,NULL,'2026-04-23','9999-12-30','2026-04-23','9999-12-30','1905907000','United Kingdom',NULL,'Lees 10 Snowballs','Lees 10 Snowballs','5010082133263.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:26:57','F10144','Ambient',0,0,0,0,0,NULL,NULL,NULL),(310,NULL,NULL,NULL,151,'487233','Clean & Clear 100Ml Dual Act Moisturising Cream','6',6,6,'Case','5000207007159','5000207007159','HEA10CLE100 CLEAN & CLEAR','A',88,528,'DEFAULT',9.99,'2026-04-22','9999-12-31',0.100,0.003,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,'2026-04-22','9999-12-31','2026-04-22','9999-12-31','3304990000','United Kingdom',NULL,'Clean & Clear 100Ml Dual Act Moisturising Cream','Clean & Clear 100Ml Dual Act Moisturising Cream','5000207007159.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','CLE005','Ambient',0,0,0,0,0,NULL,NULL,NULL),(311,NULL,NULL,NULL,152,'487512','Bip Pop Up Lollipops Disney Marvel Mix 10G','72',72,72,'Case','8714786307346','8714786307360','CON12BIP100 BIP','A',12,96,'DEFAULT',9.99,'2026-05-26','9999-12-31',0.010,0.008,210,'2026-12-22','STD',NULL,10.99,NULL,NULL,'2026-05-26','9999-12-31','2026-05-26','9999-12-31','17049065','United Kingdom',NULL,'Bip Pop Up Lollipops Disney Marvel Mix 10G','Bip Pop Up Lollipops Disney Marvel Mix 10G','8714786307346.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','73402000','Ambient',0,0,0,0,0,NULL,NULL,NULL),(312,NULL,NULL,NULL,153,'487673','Lyles Chocolate Wave Bottle 325G','6',6,6,'Case','5010115803125','5010115103126','GRO10LYL100 LYLES','Z',50,350,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.325,0.018,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,'2026-05-18','2026-07-05','2026-05-18','2026-07-05','18069019','United Kingdom',NULL,'Lyles Chocolate Wave Bottle 325G','Lyles Chocolate Wave Bottle 325G','5010115803125.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:34:24','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(313,NULL,NULL,NULL,154,'488285','Pip & Nut Peanut Butter Stuffed Original Oat Bar','15',15,15,'Case','5060367181946','5060367182004','CRI10PIP100 PIP & NUT','A',22,748,'DEFAULT',9.99,'2026-06-04','9999-12-31',0.050,0.000,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,'2026-06-04','9999-12-30','2026-06-04','9999-12-30','19042099','United Kingdom',NULL,'Pip & Nut Peanut Butter Stuffed Original Oat Bar','Pip & Nut Peanut Butter Stuffed Original Oat Bar','5060367181946.png',1,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:44:01','401040','Ambient',0,0,0,0,0,NULL,NULL,NULL),(314,NULL,NULL,NULL,155,'488301','Feedwell Supreme 15KG','1',1,1,'Case','5026433000023','5026433000023','PET10FEE100 Feedwell','A',11,55,'DEFAULT',9.99,'2026-06-05','9999-12-31',15.000,0.000,210,'2027-01-01','STD',NULL,10.99,NULL,NULL,'2026-06-05','9999-12-31','2026-06-05','9999-12-31','23091011','United Kingdom',NULL,'Feedwell Supreme 15KG','Feedwell Supreme 15KG','5026433000023.png',0,NULL,NULL,'2026-08-06 02:26:57','2026-08-06 02:43:46','200','Ambient',0,0,1,0,0,NULL,NULL,NULL),(315,NULL,NULL,NULL,156,'500001','Dummy Energy Drink Original 250ml','24',24,24,'Case','5000000000001','5000000000011','BEV10DUM100 DUMMY BRAND','A',10,100,'DEFAULT',8.00,'2024-01-01','9999-12-31',0.250,0.005,365,'2027-01-01','STD',NULL,12.50,NULL,NULL,'2024-01-01','9999-12-31','2024-01-01','9999-12-31','22021000','United Kingdom',NULL,'Dummy Energy Drink Original 250ml','Dummy Energy Drink Original 250ml Pack of 24','5000000000001.png',1,NULL,NULL,'2026-08-06 07:08:02','2026-08-06 07:08:02','SUP-REF-01','Ambient',0,0,0,0,0,NULL,NULL,NULL),(316,NULL,2,9,157,'500002','Dummy Chocolate Bar 50g','36',36,36,'Case','5000000000002','5000000000012','CON10DUM101 DUMMY SWEETS','Z',15,120,'DEFAULT',5.50,'2024-01-01','9999-12-31',0.050,0.002,180,'2026-12-31','STD',NULL,8.99,NULL,NULL,'2024-01-01','9999-12-31','2024-01-01','9999-12-31','18063210','United Kingdom',NULL,'Dummy Chocolate Bar 50g','Dummy Chocolate Bar 50g Box of 36','5000000000002.png',1,NULL,NULL,'2026-08-06 07:08:02','2026-08-06 07:08:02','SUP-REF-02','Ambient',0,0,0,0,0,NULL,NULL,NULL),(317,NULL,2,6,158,'500003','Dummy Basmati Rice 5kg','4',4,4,'Case','5000000000003','5000000000013','GRO10DUM102 DUMMY FOODS','Z',8,80,'DEFAULT',10.20,'2024-01-01','9999-12-31',5.000,0.015,730,'2028-01-01','STD',NULL,15.00,NULL,NULL,'2024-01-01','9999-12-31','2024-01-01','9999-12-31','10063098','United Kingdom',NULL,'Dummy Basmati Rice 5kg','Dummy Basmati Rice 5kg Bag Pack of 4','5000000000003.png',1,NULL,NULL,'2026-08-06 07:08:02','2026-08-06 07:08:02','SUP-REF-03','Ambient',0,0,0,0,0,NULL,NULL,NULL),(318,NULL,NULL,NULL,156,'500004','Dummy Sparkling Water 500ml','12',12,12,'Case','5000000000004','5000000000014','BEV10DUM100 DUMMY BRAND','A',12,144,'DEFAULT',4.10,'2024-01-01','9999-12-31',0.500,0.008,365,'2027-06-01','STD',NULL,6.99,NULL,NULL,'2024-01-01','9999-12-31','2024-01-01','9999-12-31','22011011','United Kingdom',NULL,'Dummy Sparkling Water 500ml','Dummy Sparkling Water 500ml Pack of 12','5000000000004.png',1,NULL,NULL,'2026-08-06 07:08:02','2026-08-06 07:08:02','SUP-REF-04','Ambient',0,0,0,0,0,NULL,NULL,NULL),(319,NULL,2,31,159,'500005','Dummy Premium Olive Oil 1L','6',6,6,'Case','5000000000005','5000000000015','OIL10DUM103 DUMMY OIL','Z',10,100,'DEFAULT',16.50,'2024-01-01','9999-12-31',1.000,0.012,540,'2027-12-31','STD',NULL,22.00,NULL,NULL,'2024-01-01','9999-12-31','2024-01-01','9999-12-31','15091020','United Kingdom',NULL,'Dummy Premium Olive Oil 1L','Dummy Premium Olive Oil 1L Pack of 6','5000000000005.png',1,NULL,NULL,'2026-08-06 07:08:02','2026-08-06 07:08:02','SUP-REF-05','Ambient',0,0,0,0,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_backup`
--

DROP TABLE IF EXISTS `products_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products_backup` (
  `id` int(11) NOT NULL DEFAULT 0,
  `supplier_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `units_of` varchar(50) DEFAULT NULL,
  `inner_case_quantity` int(11) DEFAULT NULL,
  `outer_case_quantity` int(11) DEFAULT NULL,
  `qty_desc` varchar(255) DEFAULT NULL,
  `barcode_ean` varchar(100) DEFAULT NULL,
  `barcode_case` varchar(100) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `vat_code` varchar(50) DEFAULT NULL,
  `layer_quantity` int(11) DEFAULT NULL,
  `pallet_quantity` int(11) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `cost_from_date` date DEFAULT NULL,
  `cost_to_date` date DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `volume` decimal(12,3) DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `bbd` varchar(100) DEFAULT NULL,
  `price_list` varchar(100) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `comm_code` varchar(100) DEFAULT NULL,
  `intra_country` varchar(100) DEFAULT NULL,
  `intra_type` varchar(100) DEFAULT NULL,
  `web_short_description` text DEFAULT NULL,
  `web_long_description` longtext DEFAULT NULL,
  `web_image` varchar(255) DEFAULT NULL,
  `live_for_web` tinyint(4) DEFAULT 1,
  `encore_image` varchar(255) DEFAULT NULL,
  `obsolete` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `supplier_reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_backup`
--

LOCK TABLES `products_backup` WRITE;
/*!40000 ALTER TABLE `products_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `products_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(1,2),(2,10),(2,11),(3,1),(3,2),(4,10),(4,11),(5,1),(5,2),(6,10),(6,11),(7,1),(7,2),(8,10),(8,11),(9,1),(9,2),(10,10),(10,11),(11,1),(11,2),(12,10),(12,11),(13,1),(13,2),(14,10),(14,11),(15,1),(16,10),(17,1),(18,10),(19,1),(20,10),(21,1),(22,10),(23,1),(24,10),(25,1),(26,10),(27,1),(28,10),(29,1),(29,2),(30,10),(30,11),(31,1),(31,2),(32,10),(32,11),(33,1),(33,2),(34,10),(34,11),(35,1),(35,2),(36,10),(36,11),(37,1),(38,10),(39,1),(40,10),(41,1),(41,6),(42,10),(42,15),(43,1),(43,6),(44,10),(44,15);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super-admin','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(2,'catalog-admin','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(3,'product-manager','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(4,'user-manager','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(5,'content-manager','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(6,'sales','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(7,'purchasing','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(8,'customer','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(9,'supplier','sanctum','2026-08-06 02:17:36','2026-08-06 02:17:36'),(10,'super-admin','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(11,'catalog-admin','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(12,'product-manager','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(13,'user-manager','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(14,'content-manager','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(15,'sales','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(16,'purchasing','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(17,'customer','web','2026-08-06 02:17:37','2026-08-06 02:17:37'),(18,'supplier','web','2026-08-06 02:17:37','2026-08-06 02:17:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_containers`
--

DROP TABLE IF EXISTS `shipping_containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_containers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `container_name` varchar(100) NOT NULL,
  `container_type` enum('Dry','Reefer') NOT NULL,
  `volume_m3` decimal(8,2) NOT NULL,
  `gross_weight_kg` decimal(10,2) NOT NULL,
  `payload_weight_kg` decimal(10,2) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_containers`
--

LOCK TABLES `shipping_containers` WRITE;
/*!40000 ALTER TABLE `shipping_containers` DISABLE KEYS */;
INSERT INTO `shipping_containers` VALUES (1,'Collection / Ex Works (I\'ll arrange collection)','Dry',0.00,0.00,0.00,1,NULL,NULL),(2,'20 ft Dry (Standard)','Dry',33.20,23956.00,21727.00,1,NULL,NULL),(3,'40 ft Dry (Standard)','Dry',67.70,30481.00,26780.00,1,NULL,NULL),(4,'40 ft High Cube (HC) Dry','Dry',76.40,30481.00,26512.00,1,NULL,NULL),(5,'20 ft Reefer','Reefer',27.00,30481.00,21700.00,1,NULL,NULL),(6,'40 ft Reefer','Reefer',58.00,30481.00,25000.00,1,NULL,NULL);
/*!40000 ALTER TABLE `shipping_containers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_countries`
--

DROP TABLE IF EXISTS `shipping_countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zone_id` int(11) NOT NULL,
  `country_name` varchar(120) NOT NULL,
  `country_code` char(2) NOT NULL,
  `active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_country_zone` (`zone_id`),
  CONSTRAINT `fk_country_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=583 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_countries`
--

LOCK TABLES `shipping_countries` WRITE;
/*!40000 ALTER TABLE `shipping_countries` DISABLE KEYS */;
INSERT INTO `shipping_countries` VALUES (389,2,'Albania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(390,2,'Algeria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(391,2,'American Samoa','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(392,2,'Angola','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(393,2,'Anguilla','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(394,2,'Antarctica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(395,2,'Antigua and Barbuda','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(396,2,'Argentina','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(397,2,'Aruba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(398,2,'Australia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(399,2,'Austria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(400,2,'Bahamas','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(401,2,'Bahrain','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(402,2,'Bangladesh','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(403,2,'Barbados','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(404,2,'Belgium','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(405,2,'Belize','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(406,2,'Benin','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(407,2,'Bermuda','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(408,2,'Bonaire, Sint Eustatius, and Saba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(409,2,'Bosnia and Herzegovina','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(410,2,'Brazil','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(411,2,'Virgin Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(412,2,'Virgin Islands (U.S.)','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(413,2,'Brunei','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(414,2,'Bulgaria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(415,2,'Burkina Faso','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(416,2,'Cambodia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(417,2,'Cameroon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(418,2,'Canada','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(419,2,'Cabo Verde','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(420,2,'Cayman Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(421,2,'Chile','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(422,2,'China','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(423,2,'Colombia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(424,2,'Comoros','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(425,2,'Congo','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(426,2,'Democratic Republic of The Congo','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(427,2,'Cook Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(428,2,'Costa Rica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(429,2,'Croatia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(430,2,'Cuba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(431,2,'Cura├ºao','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(432,2,'Cyprus','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(433,2,'Czechia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(434,2,'Denmark','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(435,2,'Djibouti','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(436,2,'Dominica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(437,2,'Dominican Republic','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(438,2,'Ecuador','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(439,2,'Egypt','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(440,2,'El Salvador','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(441,2,'Equatorial Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(442,2,'Eritrea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(443,2,'Estonia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(444,2,'Ethiopia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(445,2,'Faroe Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(446,2,'Fiji','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(447,2,'Finland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(448,2,'France','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(449,2,'French Guiana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(450,2,'French Polynesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(451,2,'Gabon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(452,2,'Gambia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(453,2,'Georgia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(454,2,'Germany','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(455,2,'Ghana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(456,2,'Gibraltar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(457,2,'Greece','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(458,2,'Grenada','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(459,2,'Guadeloupe','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(460,2,'Guam','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(461,2,'Guatemala','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(462,2,'Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(463,2,'Guinea-Bissau','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(464,2,'Guyana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(465,2,'Haiti','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(466,2,'Honduras','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(467,2,'Hong Kong','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(468,2,'Hungary','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(469,2,'Iceland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(470,2,'India','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(471,2,'Indonesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(472,2,'Ivory Coast','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(473,2,'Iran','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(474,2,'Iraq','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(475,2,'Ireland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(476,2,'Israel','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(477,2,'Italy','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(478,2,'Jamaica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(479,2,'Japan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(480,2,'Jordan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(481,2,'Kazakhstan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(482,2,'Kenya','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(483,2,'Kiribati','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(484,2,'Kuwait','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(485,2,'Latvia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(486,2,'Lebanon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(487,2,'Lesotho','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(488,2,'Liberia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(489,2,'Libya','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(490,2,'Lithuania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(491,2,'Luxembourg','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(492,2,'Macao','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(493,2,'Madagascar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(494,2,'Malawi','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(495,2,'Malaysia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(496,2,'Maldives','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(497,2,'Malta','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(498,2,'Marshall Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(499,2,'Martinique','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(500,2,'Mauritius','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(501,2,'Mayotte','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(502,2,'Mexico','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(503,2,'Micronesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(504,2,'Montenegro','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(505,2,'Montserrat','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(506,2,'Morocco','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(507,2,'Mozambique','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(508,2,'Myanmar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(509,2,'Namibia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(510,2,'Nauru','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(511,2,'Nepal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(512,2,'Netherlands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(513,2,'New Caledonia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(514,2,'New Zealand','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(515,2,'Nicaragua','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(516,2,'Nigeria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(517,2,'Niue','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(518,2,'Northern Mariana Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(519,2,'Norway','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(520,2,'Oman','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(521,2,'Pakistan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(522,2,'Palau','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(523,2,'Panama','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(524,2,'Papua New Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(525,2,'Paraguay','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(526,2,'Peru','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(527,2,'Philippines','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(528,2,'Poland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(529,2,'Portugal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(530,2,'Puerto Rico','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(531,2,'Qatar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(532,2,'R├®union','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(533,2,'Romania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(534,2,'Russia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(535,2,'Saint Kitts and Nevis','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(536,2,'Saint Lucia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(537,2,'Saint Pierre and Miquelon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(538,2,'Saint Vincent and the Grenadines','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(539,2,'Samoa','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(540,2,'Sao Tome and Principe','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(541,2,'Saudi Arabia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(542,2,'Senegal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(543,2,'Serbia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(544,2,'Seychelles','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(545,2,'Sierra Leone','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(546,2,'Singapore','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(547,2,'Sint Maarten','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(548,2,'Slovakia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(549,2,'Slovenia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(550,2,'Solomon Islands','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(551,2,'Somalia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(552,2,'South Africa','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(553,2,'South Korea','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(554,2,'Spain','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(555,2,'Sri Lanka','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(556,2,'Sudan','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(557,2,'Suriname','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(558,2,'Sweden','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(559,2,'Switzerland','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(560,2,'Syria','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(561,2,'Taiwan','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(562,2,'Tanzania','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(563,2,'Thailand','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(564,2,'Timor-Leste','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(565,2,'Togo','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(566,2,'Tonga','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(567,2,'Trinidad and Tobago','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(568,2,'Tunisia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(569,2,'Turkey','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(570,2,'Turks and Caicos Islands','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(571,2,'Tuvalu','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(572,2,'Ukraine','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(573,2,'United Arab Emirates','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(574,1,'United Kingdom','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(575,2,'USA','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(576,2,'Uruguay','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(577,2,'Vanuatu','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(578,2,'Venezuela','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(579,2,'Vietnam','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(580,2,'Wallis and Futuna','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(581,2,'Yemen','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(582,2,'Zimbabwe','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26');
/*!40000 ALTER TABLE `shipping_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_ports`
--

DROP TABLE IF EXISTS `shipping_ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_ports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_id` int(11) NOT NULL,
  `port_name` varchar(120) NOT NULL,
  `active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_port_country` (`country_id`),
  CONSTRAINT `fk_port_country` FOREIGN KEY (`country_id`) REFERENCES `shipping_countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_ports`
--

LOCK TABLES `shipping_ports` WRITE;
/*!40000 ALTER TABLE `shipping_ports` DISABLE KEYS */;
INSERT INTO `shipping_ports` VALUES (477,389,'Durr├½s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(478,390,'Algiers',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(479,391,'Pago Pago',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(480,392,'Luanda',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(481,393,'Road Bay',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(482,394,'Ushuaia (nearby in Argentina)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(483,395,'St. John\'s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(484,396,'Buenos Aires',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(485,397,'Oranjestad',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(486,398,'Melbourne',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(487,398,'Sydney',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(488,398,'Brisbane',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(489,398,'Fremantle',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(490,398,'Adelaide',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(491,399,'Vienna (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(492,400,'Nassau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(493,401,'Khalifa Bin Salman',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(494,402,'Chittagong (Cox\'s Bazar also)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(495,403,'Bridgetown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(496,404,'Antwerp',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(497,405,'Belize City',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(498,406,'Cotonou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(499,407,'Hamilton Harbour',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(500,408,'Kralendijk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(501,409,'Neum',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(502,410,'Santos',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(503,410,'Rio de Janeiro',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(504,410,'Salvador',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(505,410,'Paranagu├í',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(506,410,'Itaja├¡',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(507,411,'Charlotte Amalie',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(508,412,'St. Thomas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(509,413,'Muara',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(510,414,'Varna',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(511,415,'Ouagadougou (inland port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(512,416,'Sihanoukville',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(513,417,'Douala',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(514,418,'Vancouver',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(515,419,'Mindelo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(516,420,'George Town',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(517,421,'Valpara├¡so',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(518,422,'Shanghai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(519,422,'Shenzhen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(520,422,'Ningbo-Zhoushan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(521,422,'Hong Kong',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(522,422,'Guangzhou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(523,422,'Qingdao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(524,423,'Cartagena',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(525,423,'Barranquilla',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(526,424,'Moroni',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(527,425,'Pointe-Noire',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(528,426,'Kinshasa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(529,427,'Avatiu',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(530,428,'Lim├│n',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(531,429,'Rijeka',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(532,430,'Havana',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(533,431,'Willemstad',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(534,432,'Limassol',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(535,433,'Prague (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(536,434,'Copenhagen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(537,434,'Aarhus',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(538,435,'Djibouti',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(539,436,'Roseau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(540,437,'Santo Domingo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(541,437,'Puerto Plata',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(542,438,'Guayaquil',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(543,438,'Esmeraldas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(544,439,'Alexandria',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(545,439,'Port Said',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(546,440,'Acajutla',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(547,441,'Malabo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(548,442,'Massawa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(549,443,'Tallinn',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(550,444,'Djibouti (primary port for Ethiopia)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(551,445,'T├│rshavn',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(552,446,'Suva',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(553,447,'Helsinki',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(554,448,'Le Havre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(555,448,'Marseille',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(556,448,'Dunkirk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(557,449,'Cayenne',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(558,450,'Papeete',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(559,451,'Libreville',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(560,452,'Banjul',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(561,453,'Batumi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(562,454,'Hamburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(563,454,'Bremerhaven',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(564,454,'Wilhelmshaven',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(565,454,'Bremen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(566,454,'Duisburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(567,455,'Tema',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(568,456,'Gibraltar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(569,457,'Piraeus',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(570,458,'St. George\'s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(571,459,'Pointe-├á-Pitre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(572,460,'Apra Harbor',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(573,461,'Puerto Quetzal',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(574,462,'Conakry',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(575,463,'Bissau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(576,464,'Georgetown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(577,465,'Port-au-Prince',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(578,466,'Puerto Cort├®s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(579,467,'Hong Kong',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(580,468,'Budapest (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(581,469,'Reykjavik',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(582,470,'Mumbai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(583,470,'Jawaharlal Nehru (Nhava Sheva)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(584,470,'Chennai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(585,470,'Kolkata',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(586,470,'Visakhapatnam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(587,470,'Mundra',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(588,471,'Jakarta',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(589,472,'Abidjan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(590,473,'Bandar Abbas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(591,474,'Umm Qasr',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(592,475,'Dublin',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(593,476,'Haifa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(594,476,'Ashdod',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(595,477,'Genoa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(596,477,'Venice',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(597,477,'Naples',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(598,478,'Kingston',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(599,479,'Yokohama',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(600,479,'Kobe',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(601,479,'Nagoya',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(602,479,'Tokyo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(603,479,'Osaka',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(604,480,'Aqaba',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(605,481,'Aktau (Caspian Sea)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(606,482,'Mombasa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(607,483,'Tarawa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(608,484,'Shuwaikh',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(609,485,'Riga',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(610,486,'Beirut',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(611,487,'Durban (South Africa - main port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(612,488,'Monrovia',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(613,489,'Tripoli',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(614,490,'Klaip─ùda',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(615,491,'Luxembourg (via the Moselle River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(616,492,'Macao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(617,493,'Toamasina',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(618,494,'Nacala (Mozambique)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(619,495,'Port Klang',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(620,496,'Mal├®',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(621,497,'Valletta',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(622,498,'Majuro',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(623,499,'Fort-de-France',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(624,500,'Port Louis',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(625,501,'Mamoudzou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(626,502,'Veracruz',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(627,503,'Pohnpei',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(628,504,'Bar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(629,505,'Plymouth',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(630,506,'Casablanca',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(631,507,'Maputo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(632,508,'Yangon',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(633,509,'Walvis Bay',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(634,510,'Nauru',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(635,511,'Kolkata (India port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(636,512,'Rotterdam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(637,513,'Noum├®a',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(638,514,'Auckland',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(639,514,'Wellington',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(640,515,'Corinto',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(641,516,'Lagos',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(642,517,'Alofi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(643,518,'Saipan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(644,519,'Oslo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(645,520,'Sohar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(646,521,'Karachi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(647,522,'Malakal',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(648,523,'Balboa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(649,524,'Port Moresby',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(650,525,'Asunci├│n (via Paraguay River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(651,526,'Callao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(652,527,'Manila',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(653,528,'Gda┼äsk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(654,529,'Lisbon',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(655,529,'Porto',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(656,530,'San Juan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(657,531,'Doha',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(658,532,'Le Port',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(659,533,'Constan╚øa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(660,534,'St. Petersburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(661,535,'Basseterre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(662,536,'Castries',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(663,537,'Saint Pierre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(664,538,'Kingstown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(665,539,'Apia',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(666,540,'S├úo Tom├®',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(667,541,'Jeddah',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(668,541,'Dammam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(669,542,'Dakar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(670,543,'Belgrade (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(671,544,'Victoria',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(672,545,'Freetown',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(673,546,'Singapore (Primary)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(674,546,'Pasir Panjang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(675,547,'Philipsburg',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(676,548,'Bratislava (via Danube River)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(677,549,'Koper',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(678,550,'Honiara',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(679,551,'Mogadishu',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(680,552,'Durban',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(681,553,'Busan',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(682,553,'Incheon',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(683,553,'Gwangyang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(684,554,'Barcelona',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(685,555,'Colombo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(686,556,'Port Sudan',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(687,557,'Paramaribo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(688,558,'Gothenburg',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(689,559,'Basel',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(690,560,'Latakia',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(691,561,'Kaohsiung',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(692,562,'Dar es Salaam',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(693,563,'Laem Chabang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(694,564,'Dili',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(695,565,'Lom├®',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(696,566,'Nuku\'alofa',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(697,567,'Spain',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(698,568,'Tunis',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(699,569,'Istanbul',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(700,570,'Providenciales',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(701,571,'Funafuti',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(702,572,'Odessa',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(703,573,'Jebel Ali',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(704,574,'Felixstowe',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(705,574,'London',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(706,575,'Los Angeles',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(707,575,'New York and New Jersey',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(708,576,'Montevideo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(709,577,'Port Vila',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(710,578,'La Guaira',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(711,579,'Ho Chi Minh City',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(712,580,'Mata-Utu',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(713,581,'Aden',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(714,582,'Beira (Mozambique)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26');
/*!40000 ALTER TABLE `shipping_ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shipping_zones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(100) NOT NULL,
  `minimum_order` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_zones`
--

LOCK TABLES `shipping_zones` WRITE;
/*!40000 ALTER TABLE `shipping_zones` DISABLE KEYS */;
INSERT INTO `shipping_zones` VALUES (1,'United Kingdom',5000.00,NULL,NULL),(2,'Rest of World',10000.00,NULL,NULL);
/*!40000 ALTER TABLE `shipping_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_group_mapping`
--

DROP TABLE IF EXISTS `storage_group_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storage_group_mapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_code` varchar(20) NOT NULL,
  `sub_group_name` varchar(150) NOT NULL,
  `storage_type` enum('Ambient','Frozen','Chilled') NOT NULL DEFAULT 'Ambient',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_code` (`group_code`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_group_mapping`
--

LOCK TABLES `storage_group_mapping` WRITE;
/*!40000 ALTER TABLE `storage_group_mapping` DISABLE KEYS */;
INSERT INTO `storage_group_mapping` VALUES (1,'BAB10','BABY FOOD','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(2,'BAB11','BABY PRODUCTS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(3,'BIS10','BISCUITS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(4,'CER10','CEREAL','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(5,'CHI10','CHILLED DESSERTS','Chilled','2026-07-06 11:59:36','2026-07-25 08:51:57'),(6,'CHI11','CHILLED DRINKS','Chilled','2026-07-06 11:59:36','2026-07-25 08:51:57'),(7,'CHI12','CHILLED MIX','Chilled','2026-07-06 11:59:36','2026-07-25 08:51:57'),(8,'CON10','CONDIMENTS & SAUCES','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(9,'CON11','CONFECTIONERY CHOCOLATE','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(10,'CON12','CONFECTIONERY SWEETS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(11,'CRI10','CRISPS & SNACKS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(12,'DEN10','DENTAL CARE','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(13,'DES10','CHILLED DESSERTS','Chilled','2026-07-06 11:59:36','2026-07-25 08:51:57'),(14,'ENE10','ENERGY DRINKS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(15,'EST10','EASTER','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(16,'FRE10','FREE FROM','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(17,'FRO10','FROZEN DESSERTS','Frozen','2026-07-06 11:59:36','2026-07-25 08:51:57'),(18,'FRO11','FROZEN FOOD','Frozen','2026-07-06 11:59:36','2026-07-25 08:51:57'),(19,'GRO10','GROCERY','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(20,'GUM10','GUM AND MINTS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(21,'HEA10','HEALTH AND BEAUTY','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(22,'HEA11','HEALTHFOOD','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(23,'HOT10','HOT BEVERAGES','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(24,'HOU10','HOUSEHOLD','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(25,'JAM10','JAMS & SPREADS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(26,'MED10','MEDICINAL','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(27,'NON10','NON FOODS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(28,'OIL10','OILS AND VINEGARS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(29,'PET10','PET FOOD','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(30,'PET11','PET CARE','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(31,'SAU10','SAUCES AND SYRUPS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(32,'SEA10','SEASONAL XMAS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(33,'SEA11','SEASONAL','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(34,'SOF10','SOFTDRINKS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(35,'SUG10','SUGAR & SWEETNERS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(36,'WAF10','WAFER','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(37,'WAT10','WATER','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57'),(38,'WOR10','WORLD FOODS','Ambient','2026-07-06 11:59:36','2026-07-25 08:51:57');
/*!40000 ALTER TABLE `storage_group_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `sub_category_name` varchar(100) NOT NULL,
  `group_code` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_code` (`group_code`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,9,'Frozen Food','FRO11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(2,5,'Hot Beverages','HOT10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(3,5,'Softdrinks','SOF10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(4,5,'Water','WAT10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(5,5,'Energy Drinks','ENE10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(6,2,'Grocery','GRO10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(7,2,'Cereal','CER10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(8,2,'Jams & Spreads','JAM10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(9,2,'Condiments & Sauces','CON10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(10,1,'Confectionery Chocolate','CON11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(11,1,'Wafer','WAF10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(12,3,'Confectionery Sweets','CON12',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(13,3,'Gum and Mints','GUM10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(14,4,'Crisps & Snacks','CRI10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(15,6,'Biscuits','BIS10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(16,8,'Chilled Drinks','CHI11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(17,11,'Health and Beauty','HEA10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(18,11,'Healthfood','HEA11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(19,11,'Dental Care','DEN10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(20,12,'Pet Food','PET10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(21,13,'Household','HOU10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(22,8,'Desserts','DES10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(23,10,'Baby Food','BAB10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(24,10,'Baby Products','BAB11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(25,8,'Chilled Desserts','CHI10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(26,8,'Chilled Mix','CHI12',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(27,7,'Easter','EST10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(28,2,'Free From','FRE10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(29,9,'Frozen Desserts','FRO10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(30,11,'Medicinal','MED10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(31,2,'Oils and Vinegars','OIL10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(32,12,'Pet Care','PET11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(33,2,'Sauces and Syrups','SAU10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(34,7,'Seasonal Xmas','SEA10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(35,7,'Seasonal','SEA11',1,'2026-07-04 18:03:24','2026-07-04 18:03:24'),(36,2,'Sugar & Sweeteners','SUG10',1,'2026-07-04 18:03:24','2026-07-04 18:03:24');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_details`
--

DROP TABLE IF EXISTS `supplier_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier_details` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `mobile_phone` varchar(255) DEFAULT NULL,
  `business_phone` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_type` varchar(255) DEFAULT NULL,
  `company_registration_number` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `county` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `categories_supplied` text DEFAULT NULL,
  `consent_news` tinyint(1) NOT NULL DEFAULT 0,
  `consent_marketing` tinyint(1) NOT NULL DEFAULT 0,
  `contact_time` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_details_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_details`
--

LOCK TABLES `supplier_details` WRITE;
/*!40000 ALTER TABLE `supplier_details` DISABLE KEYS */;
INSERT INTO `supplier_details` VALUES (1,2,'John','Doe','supplier_test@navsa.com','+44 7123456789','+44 114 244 0887','Global Foods Ltd','Limited Company','UK12345678','www.globalfoods.com','123 Industrial Way','Suite 4B','Milton Keynes','Buckinghamshire','United Kingdom','MK10 9RG','Looking forward to doing business.','[\"Chocolates\",\"Groceries\",\"Biscuits\",\"Seasonal\"]',0,0,'[\"Between 9am-12pm\",\"After 5pm\"]','2026-07-19 09:09:07','2026-07-19 09:09:07'),(2,10,'TEST','TEST','test99@gmail.com','+44 9898989890','+91 9999999999','TEST','Limited Company','98989890','www.test.com','test','test','Gandhinagar','-','United Kingdom','382419','No','[\"Chocolates\",\"Crisps & Snacks\",\"Chilled Items\",\"Confectionery\",\"Biscuits\",\"Cold and Hot Beverages\"]',1,1,'[\"Between 12pm-5pm\"]','2026-08-01 11:41:21','2026-08-01 11:41:21'),(3,11,'Mamta','Ashwar','ashwarmamta9@gmail.com','+91 9999999999','+44 9999999999','bm','Public Limited Company (PLC)','bm','mdfnjgf','m','m','Gandhinagar','Gujarat','United Kingdom','382419','dgjrfh','[\"Chocolates\"]',1,1,'[\"After 5pm\"]','2026-08-01 11:48:43','2026-08-01 11:48:43');
/*!40000 ALTER TABLE `supplier_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_index` varchar(50) DEFAULT NULL,
  `supplier_reference` varchar(100) DEFAULT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `supplier_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_index` (`supplier_index`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'1','CADBURY','Cadbury',1,'2026-06-21 17:36:07','2026-07-25 08:51:57',NULL),(2,'2','YOUNGS','Young\'s',1,'2026-06-21 17:36:07','2026-07-25 08:51:57',NULL),(3,'3','MCVITIES','McVitie\'s',1,'2026-06-21 17:36:07','2026-07-25 08:51:57',NULL),(4,'4','NESTLE','Nestle',1,'2026-06-21 17:36:07','2026-07-25 08:51:57',NULL),(5,'5','COCACOLA','Coca Cola',1,'2026-06-21 17:36:07','2026-07-25 08:51:57',NULL);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` varchar(30) DEFAULT 'customer',
  `status` varchar(30) DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Director','info@navsainternational.com','$2y$10$dewvqr6iNzjLszucz9ljjuNY2EbfjOzJlElB054rOqyuLQty9oaO.',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(2,'Accounts Department','accounts@navsainternational.com','$2y$10$7hovn7RlGZTkKKqRekwMn.t5TQly7S5Viybx6ARBw.M7YGKf382xC',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(3,'Web Administrator','webmaster@navsainternational.com','$2y$10$ZNTxjQW69Wf8hbxKA7IgaevX2wX4gxdH9etK8T3gkGJAw/IE3g9Oq',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(4,'Product Manager','product@navsainternational.com','$2y$10$SDHRyxxpCEjXO/Xm8ZiLZOeBZDpnAJKU2qqwlfBSZg5gU52xcorLi',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(5,'Admin User','admin@navsainternational.com','$2y$10$TOdL2QPImC.Rb1HT5ipT7./eo7bqOIdcYLHoRcu.vvRBbsGmPcDA2',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(6,'Sales Admin','sales@navsainternational.com','$2y$10$.mjXPQnP69jqD/VFkaksj.POOFpna1Q5JMI7647bMC7yQmXnhEAP6',NULL,NULL,'admin','approved','2026-08-06 06:51:26','2026-08-06 02:17:38','2026-08-06 06:51:26'),(7,'Purchasing Admin','purchasing@navsainternational.com','$2y$10$WKRrOJEh8f.1uSp2n9P0E.VcVRLsto3V8DQqrfY0Hw1kXoOy.FC7K',NULL,NULL,'admin','approved','2026-08-06 06:51:27','2026-08-06 02:17:38','2026-08-06 06:51:27'),(8,'Navsa Super Admin','admin@navsa.com','$2y$10$S8xeMSfjaLD13LCMzF26pelaMnrWKhKxo7A1vUPbWZakz5eouaR9u',NULL,NULL,'admin','approved','2026-08-06 06:51:27','2026-08-06 02:17:39','2026-08-06 06:51:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vat_codes`
--

DROP TABLE IF EXISTS `vat_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vat_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(5) NOT NULL,
  `percentage` decimal(6,3) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `vat_treatment` varchar(50) DEFAULT NULL,
  `charge_for_uk` tinyint(1) DEFAULT 1,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vat_codes_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vat_codes`
--

LOCK TABLES `vat_codes` WRITE;
/*!40000 ALTER TABLE `vat_codes` DISABLE KEYS */;
INSERT INTO `vat_codes` VALUES (1,'A',20.000,'Standard rated','standard',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(2,'C',5.000,'Reduced rate 5%','reduced',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(3,'D',6.000,'Special rate 6%','special',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(4,'E',0.000,'Exempt','exempt',0,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(5,'F',5.000,'Fuel','reduced',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(6,'G',7.000,'Special rate 7%','special',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(7,'H',17.920,'Special VAT rate','special',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(8,'M',13.880,'Mixed Biscuits','special',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(9,'N',0.000,'No VAT','outside_scope',0,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(10,'O',0.000,'Outside scope of VAT','outside_scope',0,1,'2026-08-06 07:56:33','2026-08-06 07:56:33'),(11,'Z',0.000,'Zero rated','zero_rated',1,1,'2026-08-06 07:56:33','2026-08-06 07:56:33');
/*!40000 ALTER TABLE `vat_codes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-06 18:08:22
