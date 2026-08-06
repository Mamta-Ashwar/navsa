-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: navsa_int
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_line1` varchar(255) DEFAULT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postcode` varchar(50) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basket_shipping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `container_id` int NOT NULL,
  `country_id` int NOT NULL,
  `port_id` int NOT NULL,
  `total_value` decimal(12,2) DEFAULT '0.00',
  `total_weight` decimal(12,2) DEFAULT '0.00',
  `total_volume` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_basket_container` (`container_id`),
  KEY `fk_basket_country` (`country_id`),
  KEY `fk_basket_port` (`port_id`),
  CONSTRAINT `fk_basket_container` FOREIGN KEY (`container_id`) REFERENCES `shipping_containers` (`id`),
  CONSTRAINT `fk_basket_country` FOREIGN KEY (`country_id`) REFERENCES `shipping_countries` (`id`),
  CONSTRAINT `fk_basket_port` FOREIGN KEY (`port_id`) REFERENCES `shipping_ports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Cadbury',NULL,1,0,'2026-06-21 17:35:29','2026-07-25 08:51:57'),(2,'Young\'s',NULL,1,0,'2026-06-21 17:35:29','2026-07-25 08:51:57'),(3,'McVitie\'s',NULL,1,0,'2026-06-21 17:35:29','2026-07-25 08:51:57'),(4,'Nestle',NULL,1,0,'2026-06-21 17:35:29','2026-07-25 08:51:57'),(5,'Coca Cola',NULL,1,0,'2026-06-21 17:35:29','2026-07-25 08:51:57'),(6,'NESCAFE',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(7,'MCVITIES',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(8,'BISTO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(9,'RED BULL',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(10,'TETLEY',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(11,'Lindt & Sprüngli',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(12,'NANDO\'S',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(13,'CANDY',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(14,'GOLDEN WONDER',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(15,'BAZOOKA',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(16,'JACK DANIELS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(17,'FRUIT SHOOT',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(18,'POWERADE',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(19,'LUCOZADE',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(20,'GREEN\'S',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(21,'Kellogg\'s',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(22,'BEBETO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(23,'HEINZ',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(24,'SNICKERS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(25,'Chupa Chups',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(26,'Hartley\'s',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(27,'JOHN WEST',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(28,'STARBUCKS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(29,'SHEBA',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(30,'Wafflemeister',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(31,'FELLOWS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(32,'GALAXY',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(33,'HARIBO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(34,'Jack Link\'s',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(35,'KNOPPERS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(36,'PROPER',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(37,'RUBICON',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(38,'BEANIES',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(39,'JELLY BELLY',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(40,'CHEWITS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(41,'BRAIN BLASTERZ',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(42,'FORCE PROTEIN',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(43,'CACAOLAT',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(44,'FILIPPO BERIO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(45,'CARNATION',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(46,'Del Monte',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 13:18:42'),(47,'BARRATTS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(48,'WHAM EXTREME',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(49,'ZODIAC',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(50,'Huntley & Palmer',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(51,'EATREAL',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(52,'GRENADE',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(53,'FAZER',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(54,'PATHOS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(55,'WALKERS',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(56,'WARRIOR',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(57,'MULLER',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(58,'RITTER',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(59,'WEETABIX',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(60,'BAHLSEN',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(61,'CAWSTON',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(62,'DIABLO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(63,'VIDAL',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(64,'DOLE',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(65,'FUEL10K',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(66,'TYPHOO',NULL,1,0,'2026-06-22 06:04:01','2026-07-25 08:51:57'),(67,'GLENGETTIE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(68,'HORLICKS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(69,'FINI',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(70,'BOUNTY',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(71,'FREEZ',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(72,'SCORE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(73,'ELIZABETH',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(74,'TASSIMO',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(75,'BENS ORIGINAL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(76,'ROLO',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(77,'MCDOUGALL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(78,'CAWOODS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(79,'WOW HYDRATE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(80,'PRIME',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(81,'YUBI',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(82,'KIDSMANIA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(83,'BAILEYS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(84,'QUALITY STREET',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(85,'CATHEDRAL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(86,'CHEERY CHEWS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(87,'SKIPS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(88,'Reese\'s',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 13:18:42'),(89,'HELL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(90,'MEGA BRAIN',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(91,'MILLIONS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(92,'BAREBELLS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(93,'FELIX',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(94,'VITA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(95,'SEABROOK',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(96,'HUEL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(97,'CELTIC',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(98,'MILO',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(99,'P',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(100,'Beech\'s',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 13:18:42'),(101,'MILKA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(102,'MCVITIES CAKES',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(103,'TATE & LYLE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(104,'LORENZ',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(105,'AQUAFRESH',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(106,'MORNFLAKE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(107,'PASTRI SHOP',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(108,'TROPICAL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(109,'BOB SNAIL',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(110,'CLEAN UPS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(111,'TENZING',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(112,'CROWN',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(113,'DYLON',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(114,'BUXTON',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(115,'PERRIER',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(116,'SARSONS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(117,'FREEDOM',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(118,'KULANA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(119,'KETTLE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(120,'TROPICANA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(121,'POT NOODLES',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(122,'MUNCHKINGS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(123,'LEVI ROOTS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(124,'Sweetzone',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(125,'RIVA FOOD',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(126,'EASY',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(127,'YAZOO',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(128,'TAKIS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(129,'PIPERS',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(130,'C4 ENERGY',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(131,'PHD',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(132,'TIAMA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(133,'BAKEHOUSE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(134,'DR JOHNSON',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(135,'UFIT',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(136,'GOLDENFRY',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(137,'POPHOUSE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(138,'DASH',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(139,'GNAW',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(140,'MARETTI',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(141,'ULTREX',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(142,'FERRERO ROCHER',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(143,'NESQUIK',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(144,'NATURE\'S BOUNTY',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(145,'GREENSHIELD',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(146,'MOO FREE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(147,'COMFORT',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(148,'ARIZONA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(149,'STUTE',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(150,'Nakd',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(151,'YORKSHIRE TEA',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(152,'LEES',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(153,'CLEAN & CLEAR',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(154,'BIP',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(155,'LYLES',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(156,'PIP & NUT',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(157,'Feedwell',NULL,1,0,'2026-06-22 06:04:02','2026-07-25 08:51:57'),(158,'LINDT & SPRUGALI',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(159,'KELLOGGS',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(160,'CHUPA CHUP',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(161,'HARTLEYS',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(162,'JACK',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(163,'DEL MON',NULL,1,0,'2026-07-25 09:47:42','2026-07-25 09:47:42'),(164,'REESES',NULL,1,0,'2026-07-25 09:47:43','2026-07-25 09:47:43'),(165,'BEECHS',NULL,1,0,'2026-07-25 09:47:43','2026-07-25 09:47:43');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_mappings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_desc` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `category_mappings_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `category_mappings_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `vat_number` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `credit_limit` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customer_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_registration_number` varchar(100) DEFAULT NULL,
  `vat_number` varchar(100) DEFAULT NULL,
  `customer_group` varchar(50) DEFAULT NULL,
  `trading_years` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_nature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `director_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registered_phone` varchar(30) DEFAULT NULL,
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp_offers_phone` varchar(50) DEFAULT NULL,
  `whatsapp_offers_opt_in` tinyint(1) NOT NULL DEFAULT '0',
  `address_line_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `other_wholesalers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `average_order_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `turnover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `import_full_containers` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brands_interested` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `categories_interested` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `eori_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `same_as_billing` tinyint(1) NOT NULL DEFAULT '1',
  `shipping_address_line_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_line_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_zip_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_country` varchar(255) DEFAULT NULL,
  `shipping_telephone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_details_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_details`
--

LOCK TABLES `customer_details` WRITE;
/*!40000 ALTER TABLE `customer_details` DISABLE KEYS */;
INSERT INTO `customer_details` VALUES (1,2,'Mamta','Ashwar','International','India','Owner',NULL,NULL,NULL,'1-3','Wholesale','m.com','Mamta','GBP',NULL,'9999999998',NULL,0,'mm','mn','Khambhalia','Gujarat','361305','m','ashwarmamta22@gmail.com','no','10,000 - 20,000','1,000,000 - 5,000,000','Containers','KitKat','[\"Chocolates\",\"Confectionery\",\"Biscuits\",\"Crisps & Snacks\",\"Cold and Hot Beverages\",\"Chilled Items\"]','er',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-24 14:19:06','2026-07-24 14:19:06'),(2,3,'Vishwa','Ashwar','International','India','Owner',NULL,NULL,NULL,'0-1','Retail','vishuretail.com','Vishwa Ashwar','GBP',NULL,'9999999998',NULL,0,'mmm','MMN','KHAMBHALIA','GUJARAT','361305','MMM','m@gmail.com','No','10,000 - 20,000','0 - 500,000','Containers','KitKat , 7up','[\"Baby and Kids\",\"Chocolates\",\"Confectionery\",\"Groceries\",\"Biscuits\",\"Crisps & Snacks\",\"Chilled Items\",\"Cold and Hot Beverages\"]','98',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-24 15:48:36','2026-07-24 15:48:36'),(3,4,'Mamta','Ashwar','International','India','Owner',NULL,NULL,NULL,'0-1','Traders','mmm.com','Mamta Ashwar','GBP',NULL,'9999999998',NULL,0,'mmm','MMN','KHAMBHALIA','Gujarat','361305','mmm','ashwarmamta9@gmail.com','No','10,000 - 20,000','0 - 500,000','Containers','KitKat , 7up','[\"Chocolates\",\"Biscuits\",\"Cold and Hot Beverages\",\"Chilled Items\",\"Crisps & Snacks\",\"Confectionery\"]','99',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-07-25 10:11:34','2026-07-25 10:11:34'),(4,5,'TEST','TEST','International','India','Owner','9',NULL,'Group 1','1-2','Wholesale','test.com','Mamta Ashwar','GBP','+91 9999999999','+91 9999999998','+91 9999999998',1,'mmm','mmm mmm','Gandhinagar','Gujarat','382419','m','m@gmail.com','No','£10,000 - £20,000','1,000,000 - 5,000,000','Containers','KitKat , 7up','[\"Biscuits\",\"Chocolates\",\"Confectionery\",\"Chilled Items\",\"Cold and Hot Beverages\",\"Crisps & Snacks\"]','98',0,'m','m','m','m','m','India','9','2026-07-30 12:58:30','2026-08-01 01:08:00'),(5,6,'m','m','International','India','Director','9',NULL,'Group 1','5+','Online','mmm.com','Mamta Ashwar','GBP','+91 9999999999','+91 9999999998',NULL,1,'mmm','MMN','KHAMBHALIA','GUJARAT','361305','MMM','ashwarmamta9@gmail.com','No','£40,000+','20,000,000 +','Containers','KitKat , 7up','[\"Chocolates\",\"Confectionery\"]','98',0,'m','m','m','m','m','Bahrain','9','2026-07-31 06:28:59','2026-08-01 01:07:53'),(6,7,'Mamta','Ashwar','UK','United Kingdom','Web Administrator','9990008889','99977770403',NULL,'5+','Multiples','m.com','MM','DOLLAR','+44 9999999999','+44 9999999998',NULL,1,'m','m','m','GUJARAT','m','Navsa international','ashwarmamta9@gmail.com','No','£40,000+','20,000,000 +','Pallets','Nestle','[\"Chocolates\",\"Cold and Hot Beverages\"]','mmm999',0,'m','m','m','Gujarat','m','India','9','2026-07-31 12:13:24','2026-07-31 12:13:24'),(7,8,'Vishwa','Ashwar','International','India','Owner','9990008889',NULL,'Group 2','1-2','Retail','v.com','Vishwa Ashwar','GBP','+91 9999999999','+91 9999999998',NULL,1,'m','m','Khambhalia','Gujarat','361305','mmm','ashwarmamta9@gmail.com','No','£40,000+','20,000,000 +','Containers','KitKat','[\"Chocolates\",\"Confectionery\",\"Biscuits\",\"Crisps & Snacks\",\"Chilled Items\",\"Cold and Hot Beverages\"]','9999999',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-01 01:06:52','2026-08-01 01:07:41'),(8,9,'TEST','TEST','International','India','CEO','898989',NULL,NULL,'1-2','Online','test@gmail.com','BM','GBP','+91 9999999999','+91 9999999999',NULL,1,'m','m','Gandhinagar','Gujarat','382419','acc dept','ashwarmamta9@gmail.com','No','£10,000 - £20,000','£0 - £500,000','Containers','Cadbury,Kitkat','[\"Chocolates\",\"Confectionery\"]','876890',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-01 11:37:45','2026-08-01 11:37:45');
/*!40000 ALTER TABLE `customer_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `erp_import_logs`
--

DROP TABLE IF EXISTS `erp_import_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `erp_import_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `total_records` int DEFAULT '0',
  `inserted_records` int DEFAULT '0',
  `updated_records` int DEFAULT '0',
  `skipped_records` int NOT NULL DEFAULT '0',
  `failed_records` int DEFAULT '0',
  `imported_by` int DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'COMPLETED',
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `erp_products_raw` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_index` varchar(50) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `imported_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `erp_products_raw`
--

LOCK TABLES `erp_products_raw` WRITE;
/*!40000 ALTER TABLE `erp_products_raw` DISABLE KEYS */;
INSERT INTO `erp_products_raw` VALUES (1,'2','FRO001','Young\'s Fish Fingers','FRO11YOU107',3.50,4.99,'2026-06-22 09:05:12'),(2,'1','CHO001','Cadbury Dairy Milk','CHO01CAD001',1.25,1.99,'2026-06-22 09:05:12'),(3,'3','BIS001','McVitie\'s Digestives','BIS01MCV001',1.80,2.99,'2026-06-22 09:05:12'),(4,'4','HOT001','Nestle Coffee Mix','HOT01NES001',2.50,3.99,'2026-06-22 09:05:12'),(5,'5','SOF001','Coca Cola Original','SOF01COC001',5.50,7.99,'2026-06-22 09:05:12');
/*!40000 ALTER TABLE `erp_products_raw` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position` enum('hero','middle','bottom') COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_id` int DEFAULT NULL,
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_text` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `overlay_position` enum('left','center','right') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'left',
  `sort_order` int unsigned NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `home_banners_position_order_index` (`position`,`sort_order`),
  KEY `home_banners_brand_id_index` (`brand_id`),
  CONSTRAINT `home_banners_brand_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manual_import_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `total_records` int NOT NULL DEFAULT '0',
  `updated_records` int NOT NULL DEFAULT '0',
  `skipped_records` int NOT NULL DEFAULT '0',
  `failed_records` int NOT NULL DEFAULT '0',
  `imported_by` int DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'COMPLETED',
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
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
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pdfs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `badge` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `validity_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int unsigned NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','688330fe5d249aa20883cf5507ce0a6a439f838e36a8643360945ee614748d8c','[\"*\"]',NULL,NULL,'2026-07-24 14:15:22','2026-07-24 14:15:22'),(2,'App\\Models\\User',2,'auth_token','ed938208b1b1de1fda84a601d6fc4439b21b017824161ac7b6091070932315c5','[\"*\"]',NULL,NULL,'2026-07-24 15:07:56','2026-07-24 15:07:56'),(3,'App\\Models\\User',1,'auth_token','4cc60f2822f051527c0e1dd19606234f0c2240828eacac965f224ae8b7535d42','[\"*\"]',NULL,NULL,'2026-07-24 15:46:00','2026-07-24 15:46:00'),(4,'App\\Models\\User',1,'auth_token','dd6fd81f115473e0c3ff62b36f066abac8e443fbdbf54455ae8ee61149d93463','[\"*\"]',NULL,NULL,'2026-07-25 12:08:44','2026-07-25 12:08:44'),(5,'App\\Models\\User',1,'auth_token','60a9d9a8d0f025b0ac76a4f4255765376cd56aa8d791cf640ddd8e7fff7e0ca4','[\"*\"]',NULL,NULL,'2026-07-26 13:53:02','2026-07-26 13:53:02'),(6,'App\\Models\\User',1,'auth_token','0be148567008f567ffbbf25ccd4f5fd29475bf07138caca0f0d905e62777003b','[\"*\"]',NULL,NULL,'2026-07-27 10:02:00','2026-07-27 10:02:00'),(7,'App\\Models\\User',1,'auth_token','881d09ab7db62c7ac95ac64f202ef09c82a83c137468fb73ef205846f0cf8e02','[\"*\"]',NULL,NULL,'2026-07-29 11:12:11','2026-07-29 11:12:11'),(8,'App\\Models\\User',1,'auth_token','9f00fbba9c86a07331044291293f9fe42ee182c85de3187dcfd03a1afe47c2dc','[\"*\"]',NULL,NULL,'2026-08-05 07:02:16','2026-08-05 07:02:16'),(9,'App\\Models\\User',1,'auth_token','8e2541c1b313c92519d8d2683fe1f8556c04eb4440137ccead50fa6900c1006f','[\"*\"]',NULL,NULL,'2026-08-05 08:43:28','2026-08-05 08:43:28'),(10,'App\\Models\\User',1,'auth_token','6652621ac320fb4209e29d71ff5202f912a9979c1d00e9f0df1bf5060af45e5f','[\"*\"]',NULL,NULL,'2026-08-05 12:48:31','2026-08-05 12:48:31');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_change_logs`
--

DROP TABLE IF EXISTS `product_change_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_change_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `changed_by` int DEFAULT NULL,
  `change_source` enum('ADMIN','ERP_IMPORT','MANUAL_IMPORT','SYSTEM') NOT NULL DEFAULT 'ADMIN',
  `field_name` varchar(100) NOT NULL,
  `old_value` text,
  `new_value` text,
  `import_log_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_change_history` (`product_id`,`created_at`),
  KEY `idx_product_change_source` (`change_source`),
  KEY `idx_product_change_import` (`import_log_id`),
  CONSTRAINT `fk_product_change_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `is_primary` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_import_errors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `import_type` varchar(20) NOT NULL,
  `import_log_id` int NOT NULL,
  `excel_row_number` int DEFAULT NULL,
  `product_reference` varchar(100) DEFAULT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `supplied_value` text,
  `error_message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_import_log` (`import_type`,`import_log_id`),
  KEY `idx_import_reference` (`product_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `sub_category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `units_of` varchar(50) DEFAULT NULL,
  `inner_case_quantity` int DEFAULT NULL,
  `outer_case_quantity` int DEFAULT NULL,
  `qty_desc` varchar(255) DEFAULT NULL,
  `barcode_ean` varchar(100) DEFAULT NULL,
  `barcode_case` varchar(100) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `vat_code` varchar(5) DEFAULT NULL,
  `layer_quantity` int DEFAULT NULL,
  `pallet_quantity` int DEFAULT NULL,
  `order_qty_allowed` enum('DEFAULT','PALLET','CASE') NOT NULL DEFAULT 'DEFAULT',
  `cost` decimal(12,2) DEFAULT NULL,
  `cost_from_date` date DEFAULT NULL,
  `cost_to_date` date DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `volume` decimal(12,3) DEFAULT NULL,
  `shelf_life` int DEFAULT NULL,
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
  `web_short_description` text,
  `web_long_description` longtext,
  `web_image` varchar(255) DEFAULT NULL,
  `live_for_web` tinyint DEFAULT '1',
  `encore_image` varchar(255) DEFAULT NULL,
  `obsolete` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `supplier_reference` varchar(100) DEFAULT NULL,
  `storage_type` enum('Ambient','Frozen','Chilled') DEFAULT 'Ambient',
  `is_best_offer` tinyint(1) NOT NULL DEFAULT '0',
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `stock_quantity` int DEFAULT '0',
  `is_offer` tinyint(1) DEFAULT '0',
  `offer_label` varchar(80) DEFAULT NULL,
  `last_erp_import_at` timestamp NULL DEFAULT NULL,
  `last_manual_import_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference` (`reference`),
  KEY `supplier_id` (`supplier_id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  KEY `fk_products_vat_code` (`vat_code`),
  CONSTRAINT `fk_products_vat_code` FOREIGN KEY (`vat_code`) REFERENCES `vat_codes` (`code`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,NULL,9,1,2,'467357','Young\'s Cooked & Peeled Prawns £4.50','12',12,12,'Case','5000205049793','5000205557205','FRO11YOU107 YOUNG\'S','Z',15,165,'DEFAULT',9.99,'2024-07-02','9999-12-31',0.200,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-07-01','9999-12-31','2089030','United Kingdom','G','Young\'s Cooked & Peeled Prawns £4.50','Young\'s Cooked & Peeled Prawns £4.50','5000205049793.png',1,'5000205049793.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','3799','Frozen',0,0,0,0,0,NULL,NULL,NULL),(2,NULL,5,2,6,'466703','Nescafe Azera Americano 500G','1',1,1,'Case','7613035302884','7613035302891','HOT10NES100 NESCAFE','A',16,128,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.500,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Nescafe Azera Americano 500G','Nescafe Azera Americano 500G','7613035302884.png',1,'7613035302884.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','122842213','Ambient',0,0,0,0,0,NULL,NULL,NULL),(3,NULL,2,6,7,'466756','Mcvities Penguin & Friends Cocoa 5X20G','7',7,7,'Case','5000168003283','5000168002385','GRO10MCV100 MCVITIES','Z',17,102,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.100,0.003,168,'2026-11-02','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','21069098','United Kingdom','G','Mcvities Penguin & Friends Cocoa 5X20G','Mcvities Penguin & Friends Cocoa 5X20G','5000168003283.png',1,'5000168003283.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','45288','Ambient',0,0,0,0,0,NULL,NULL,NULL),(4,NULL,2,6,8,'466770','Bisto Gravy Granules Beef Pm 2.99 190G','12',12,12,'Case','5000354924392','5000117933579','GRO10BIS100 BISTO','Z',14,168,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.190,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','21069098','United Kingdom','G','Bisto Gravy Granules Beef Pm 2.99 190G','Bisto Gravy Granules Beef Pm 2.99 190G','5000354924392.png',1,'5000354924392.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','1018091','Ambient',0,0,0,0,0,NULL,NULL,NULL),(5,NULL,5,3,9,'466788','Red Bull Edition Blue June Berry PM 1.55 250ml','12',12,12,'Case','90456787','9002490271374','SOF10RED100 RED BULL','A',32,288,'DEFAULT',9.99,'2025-07-09','9999-12-31',0.250,0.003,180,'2026-01-21','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-12-30','9999-12-31','22029919','United Kingdom','G','Red Bull Edition Blue June Berry PM 1.55 250ml','Red Bull Edition Blue June Berry PM 1.55 250ml','90456787.png',1,'90456787.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','RB243826','Ambient',0,0,0,0,0,NULL,NULL,NULL),(6,NULL,5,2,10,'466811','Tetley Decaf Pm 2.19 40S','6',6,6,'Case','5000208001507','5000208001514','HOT10TET100 TETLEY','Z',35,315,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.750,0.015,180,'2026-11-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Tetley Decaf Pm 2.19 40S','Tetley Decaf Pm 2.19 40S','5000208001507.png',1,'5000208001507.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','7847','Ambient',0,0,0,0,0,NULL,NULL,NULL),(7,NULL,1,10,158,'468004','Lindt Creation Lemon,(317648)','14',14,14,'Case','3046920047302','3046920176484','CON11LIN100 LINDT & SPRUGALI','A',30,300,'DEFAULT',9.99,'2026-01-08','9999-12-31',0.150,0.003,210,'2026-08-06','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-01-16','9999-12-31','18063210','France','G','Creation Lemon 317648','Creation Lemon 317648','3046920047302.png',1,'3046920047302.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','1000121649','Ambient',0,0,0,0,0,NULL,NULL,NULL),(8,NULL,2,9,12,'466780','Nando\'S Hot Peri-Peri Marinade 260G','6',6,6,'Case','6003770009000','16003770009007','CON10NAN100 NANDO\'S','Z',52,260,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.260,0.003,180,'2026-09-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','2103909089','United Kingdom','G','Nando\'S Hot Peri-Peri Marinade 260G','Nando\'S Hot Peri-Peri Marinade 260G','6003770009000.png',1,'6003770009000.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','TG063','Ambient',0,0,0,0,0,NULL,NULL,NULL),(9,NULL,3,12,13,'466801','Candy Castle Crew Bubblegum Bottles PM 1.00 90g','18',18,18,'Case','5056192412270','5056192412287','CON12CAN100 CANDY','A',20,240,'DEFAULT',9.99,'2025-09-02','9999-12-31',0.090,0.003,180,'2026-03-01','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-02','9999-12-31','1700000000','Turkey','G','Candy Castle Crew Bubblegum Bottles PM 1.00 90g','Candy Castle Crew Bubblegum Bottles PM 1.00 90g','5056192412270.png',1,'5056192412270.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','ITP006','Ambient',0,0,0,0,0,NULL,NULL,NULL),(10,NULL,4,14,14,'466836','Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','18',18,18,'Case','5010052073193','5010052114193','CRI10GOL100 GOLDEN WONDER','A',10,60,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.040,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','19059055','United Kingdom','G','Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','Golden Wonder Ringos Cheese & Onion Pm 1.00 40G','5010052073193.png',1,'5010052073193.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','7319','Ambient',0,0,0,0,0,NULL,NULL,NULL),(11,NULL,3,12,15,'466851','Bazooka Chews Sour PM 1.00 120g','12',12,12,'Case','5011053026386','5011053026409','CON12BAZ100 BAZOOKA','A',6,24,'DEFAULT',9.99,'2024-10-15','9999-12-31',0.120,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-07-10','9999-12-31','17049071','Turkey','G','Bazooka Chews Sour PM 1.00 120g','Bazooka Chews Sour PM 1.00 120g','5011053026386.png',1,'5011053026386.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','Z70021','Ambient',0,0,0,0,0,NULL,NULL,NULL),(12,NULL,2,9,16,'466867','Jack Daniels Bbq Sauce Original 553G','6',6,6,'Case','810020931822','810020931815','CON10JAC100 JACK DANIELS','A',29,174,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.550,0.003,180,'2026-05-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-29','9999-12-31','17049099','United Kingdom','G','Jack Daniels Bbq Sauce Original 553G','Jack Daniels Bbq Sauce Original 553G','810020931822.png',1,'810020931822.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(13,NULL,5,3,17,'468372','Fruit Shoot Nas Apple  275ml','12',12,12,'Case','50412730','5010102221567','SOF10FRU100 FRUIT SHOOT','A',26,182,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.280,0.003,210,'2026-09-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-29','9999-12-31','22021000','United Kingdom','G','Fruit Shoot Nas Apple  275ml','Fruit Shoot Nas Apple  275ml','50412730.png',1,'50412730.png',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','201931','Ambient',0,0,0,0,0,NULL,NULL,NULL),(14,NULL,5,3,18,'468377','Powerade Golden Mango 500Ml','12',12,12,'Case','5449000320988','5017726442934','SOF10POW100 POWERADE','A',24,144,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.500,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Powerade Golden Mango 500Ml','Powerade Golden Mango 500Ml','5449000320988.png',1,'5449000320988.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','642691','Ambient',0,0,0,0,0,NULL,NULL,NULL),(15,NULL,5,3,19,'468379','Lucozade Alert Mango Peachade Pm 1.00 500Ml','12',12,12,'Case','5054267013810','5054267503809','SOF10LUC100 LUCOZADE','A',19,152,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.500,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','21069098','United Kingdom','G','Lucozade Alert Mango Peachade Pm 1.00 500Ml','Lucozade Alert Mango Peachade Pm 1.00 500Ml','5054267503809.png',1,'5054267503809.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','F97634','Ambient',0,0,0,0,0,NULL,NULL,NULL),(16,NULL,2,6,20,'468421','Green s Sponge Cake Chocolate PM 1.99 221g','6',6,6,'Case','5056036508732','5056036508749','GRO10GRE104 GREEN\'S','Z',34,272,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.221,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','20052020','United Kingdom','G','Green s Sponge Cake Chocolate PM 1.99 221g','Green s Sponge Cake Chocolate PM 1.99 221g','5056036508732.png',1,'5056036508732.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','50615','Ambient',0,0,0,0,0,NULL,NULL,NULL),(17,NULL,2,7,159,'468435','Rice Krispies Squares Cornflakes 30X31G 79P Pmp','30',30,30,'Case','5059321006852','5059321006869','CER10KEL100 KELLOGGS','A',27,486,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.031,0.026,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','10063067','United Kingdom','G','Rice Krispies Squares Cornflakes 30X31G 79P Pmp','Rice Krispies Squares Cornflakes 30X31G 79P Pmp','5059321006852.png',1,'5059321006852.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','7100686000','Ambient',0,0,0,0,0,NULL,NULL,NULL),(18,NULL,3,12,22,'468442','Bebeto Fizzy Peach Hearts 150G','10',10,10,'Case','8690146174523','8690146175957','CON12BEB100 BEBETO','A',48,192,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.150,0.015,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','17049000','Turkey','G','Bebeto Fizzy Peach Hearts 150G','Bebeto Fizzy Peach Hearts 150G','8690146174523.png',1,'8690146174523.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','160214414','Ambient',0,0,0,0,0,NULL,NULL,NULL),(19,NULL,2,6,23,'468445','Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','4',4,4,'Case','5000157140159','5000157133533','GRO10HEI101 HEINZ','Z',13,195,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.120,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','10063067','United Kingdom','G','Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G','5000157140159.png',1,'5000157140159.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','76011270','Ambient',0,0,0,0,0,NULL,NULL,NULL),(20,NULL,1,10,24,'468487','Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','32',32,32,'Case','5900951310546','5900951310553','CON11SNI100 SNICKERS','A',23,276,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.050,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','18069019','Poland','G','Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G','5900951310546.png',1,'5900951310546.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','458875','Ambient',0,0,0,0,0,NULL,NULL,NULL),(21,NULL,6,15,1,'468506','Cadbury 140G Brunch Pnut 8Ca','8',8,8,'Case','7622202219269','7622202219269','BIS10CAD100 CADBURY','A',40,360,'DEFAULT',9.99,'2025-09-26','9999-12-31',0.140,0.005,210,'2026-01-24','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-26','9999-12-31','1806321','United Kingdom','G','CADBURY 140G BRUNCH PNUT 8CA','CADBURY 140G BRUNCH PNUT 8CA','7622202219269.png',1,'7622202219269.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','4313341','Ambient',0,0,0,0,0,NULL,NULL,NULL),(22,NULL,3,12,160,'468552','Chupa Chups Babol Apple 27g','20',20,20,'Case','80970019','8410031954494','CON12CHU100 CHUPA CHUP','A',24,300,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.030,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-27','2026-06-16','17041010','Turkey','G','Chupa Chups Babol Apple 27g','Chupa Chups Babol Apple 27g','80970019.png',1,'80970019.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','10009879','Ambient',0,0,0,0,0,NULL,NULL,NULL),(23,NULL,2,8,161,'468425','Hartleys Jam Raspberry Seedless Pm 1.99 300G','6',6,6,'Case','5016935000584','5016935000591','JAM10HAR102 HARTLEYS','Z',34,306,'DEFAULT',9.99,'2026-02-09','9999-12-31',0.300,0.003,210,'2026-07-20','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-02-09','9999-12-31','20079935','United Kingdom','G','Hartleys Jam Raspberry Seedless Pm 1.99 300G','Hartleys Jam Raspberry Seedless Pm 1.99 300G','5016935000584.png',1,'5016935000584.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','10003591','Ambient',0,0,0,0,0,NULL,NULL,NULL),(24,NULL,2,6,27,'468428','John West Plant Power Harissa 145g','10',10,10,'Case','5000171061430','5000171074584','GRO10JOH101 JOHN WEST','Z',30,450,'DEFAULT',9.99,'2025-11-21','9999-12-31',0.150,0.003,210,'2026-06-19','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-20','9999-12-31','16023230','Poland','G','John West Plant Power Harissa 145g','John West Plant Power Harissa 145g','5000171061430.png',1,'5000171061430.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','300008326','Ambient',0,0,0,0,0,NULL,NULL,NULL),(25,NULL,8,16,28,'468577','Starbucks Pet Chilled Cofee Skinny Latte 220Ml','8',8,8,'Case','5711953179648','15711953179294','CHI11STA100 STARBUCKS','Z',35,210,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.230,0.015,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','22029915','Denmark','G','Starbucks Pet Chilled Cofee Skinny Latte 220Ml','Starbucks Pet Chilled Cofee Skinny Latte 220Ml','5711953179648.png',1,'5711953179648.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','SBCCCLATNAS','Chilled',0,0,0,0,0,NULL,NULL,NULL),(26,NULL,12,20,29,'468584','Sheba Classica In Terrine With Chicken 85G','22',22,22,'Case','4008429163906','4008429164224','PET10SHE100 SHEBA','A',25,350,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.090,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Sheba Classica In Terrine With Chicken 85G','Sheba Classica In Terrine With Chicken 85G','4008429163906.png',1,'4008429163906.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','460748','Ambient',0,0,0,0,0,NULL,NULL,NULL),(27,NULL,1,11,30,'468596','Wafflemeister 90g Classic Liege Waffle','30',30,30,'Case','5060868700356','5060868700424','WAF10WAF100 Wafflemeister','A',10,140,'DEFAULT',9.99,'2024-07-22','9999-12-31',0.090,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-07-22','9999-12-31','19053299','United Kingdom','G','Wafflemeister 90g Classic Liege Waffle','Wafflemeister 90g Classic Liege Waffle','5060868700356.png',1,'5060868700356.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','WFMCL90X30','Ambient',0,0,0,0,0,NULL,NULL,NULL),(28,NULL,3,12,31,'468645','Free From Fellows Cola Bottles 100G','10',10,10,'Case','5060308360157','5060308360188','CON12FRE100 FELLOWS','A',30,180,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.100,0.018,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-16','9999-12-31','17049000','Belgium','G','Free From Fellows Cola Bottles 100G','Free From Fellows Cola Bottles 100G','5060308360157.png',1,'5060308360157.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','FFF001','Ambient',0,0,0,0,0,NULL,NULL,NULL),(29,NULL,5,3,32,'468656','Galaxy Chocolate Milkshake 250Ml','12',12,12,'Case','5056357909423','5056357909416','SOF10GAL100 GALAXY','Z',31,248,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.250,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-27','2026-06-16','22029991','United Kingdom','G','Galaxy Chocolate Milkshake 250Ml','Galaxy Chocolate Milkshake 250Ml','5056357909423.png',1,'5056357909423.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','DG57L','Ambient',0,0,0,0,0,NULL,NULL,NULL),(30,NULL,3,12,33,'468671','Haribo Happy Cola 160g','12',12,12,'Case','5012035962173','5012035962500','CON12HAR100 HARIBO','A',25,200,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.160,0.019,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-27','2026-06-16','1704906500','United Kingdom','G','Haribo Happy Cola 160g','Haribo Happy Cola 160g','5012035962173.png',1,'5012035962173.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','105800','Ambient',0,0,0,0,0,NULL,NULL,NULL),(31,NULL,2,6,162,'468682','Jack Links Biltong 20g','12',12,12,'Case','4251097420332','4251097420288','GRO10JAC100 JACK','Z',36,180,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.020,0.015,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','17049000','Germany','G','Jack Links Biltong 20G','Jack Links Biltong 20G','4251097420332.png',1,'4251097420332.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','10000041765','Ambient',0,0,0,0,0,NULL,NULL,NULL),(32,NULL,1,10,35,'468695','Knoppers Nut Bar 40G','24',24,24,'Case','40144450','4014400471618','CON11KNO100 KNOPPERS','A',39,390,'DEFAULT',9.99,'2025-10-20','9999-12-31',0.040,0.000,210,'2026-03-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-10-13','9999-12-31','1905321100','Germany','G','Knoppers Nut Bar 40G','Knoppers Nut Bar 40G','40144450.png',1,'40144450.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','938135','Ambient',0,0,0,0,0,NULL,NULL,NULL),(33,NULL,4,14,36,'468728','Proper Chickpea Chips Ghost Chilli & Yuzu 85G','8',8,8,'Case','5060283762946','15060283762943','CRI10PRO101 PROPER','Z',12,72,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.090,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-16','9999-12-31','19059045','United Kingdom','G','Proper Chickpea Chips Ghost Chilli & Yuzu 85G','Proper Chickpea Chips Ghost Chilli & Yuzu 85G','5060283762946.png',1,'5060283762946.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','6421231','Ambient',0,0,0,0,0,NULL,NULL,NULL),(34,NULL,5,3,37,'468733','Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','12',12,12,'Case','5000382122333','5000382122326','SOF10RUB100 RUBICON','A',6,168,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.500,0.015,270,'2027-02-12','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','22042120','United Kingdom','G','Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml','5000382122333.png',1,'5000382122333.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','3436108','Ambient',0,0,0,0,0,NULL,NULL,NULL),(35,NULL,3,12,38,'468613','Beanies Bubble Gum 50g','6',6,6,'Case','5060169982468','5060169983397','CON12BEA100 BEANIES','A',39,546,'DEFAULT',9.99,'2025-06-11','9999-12-31',0.500,0.003,210,'2026-04-02','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-11','9999-12-31','21011100','United Kingdom','G','Beanies Bubble Gum 50g','Beanies Bubble Gum 50g','5060169982468.png',1,'5060169982468.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(36,NULL,5,3,39,'468761','Jelly Belly Berry Blue Fruit Drink 330ml NRB','12',12,12,'Case','5060318661817','5060318661817','SOF10JEL100 JELLY BELLY','A',19,114,'DEFAULT',9.99,'2024-07-24','9999-12-31',0.330,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-07-24','9999-12-31','22029995','United Kingdom','G','Jelly Belly Berry Blue Fruit Drink 330ml NRB','Jelly Belly Berry Blue Fruit Drink 330ml NRB','5060318661817.png',1,'5060318661817.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','JBBBF330','Ambient',0,0,0,0,0,NULL,NULL,NULL),(37,NULL,3,12,40,'468769','Chewits Blue Raspberry Juicy Bites Bag 115G','10',10,10,'Case','5060072652243','15060072652240','CON12CHE101 CHEWITS','A',16,128,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.120,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-16','9999-12-31','17049065','United Kingdom','G','Chewits Blue Raspberry Juicy Bites Bag 115G','Chewits Blue Raspberry Juicy Bites Bag 115G','5060072652243​.png',1,'5060072652243​.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','1016898​','Ambient',0,0,0,0,0,NULL,NULL,NULL),(38,NULL,3,12,41,'468782','Brain Blasterz Candy Spray 28ml','18',18,18,'Case','5026418050388','5026418150385','CON12BRA100 BRAIN BLASTERZ','A',120,480,'DEFAULT',9.99,'2025-05-22','9999-12-31',0.030,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-05-22','9999-12-31','2106905990','United Kingdom','G','Brain Blasterz Candy Spray 28ml','Brain Blasterz Candy Spray 28ml','5026418050388.png',1,'5026418050388.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','503800','Ambient',0,0,0,0,0,NULL,NULL,NULL),(39,NULL,4,14,42,'468788','Force Protein Bar Birthday Cake 65g','12',12,12,'Case','5065011832120','5065011832137','CRI10FOR100 FORCE PROTEIN','A',72,504,'DEFAULT',9.99,'2025-05-22','9999-12-31',0.070,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-12-30','9999-12-31','18063100','United Kingdom','G','Force Protein Bar Birthday Cake 65g','Force Protein Bar Birthday Cake 65g','5065011832120.png',1,'5065011832120.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','FP6182/6','Ambient',0,0,0,0,0,NULL,NULL,NULL),(40,NULL,5,3,43,'468822','Cacaolat Nas 200Ml','24',24,24,'Case','8412700120100','18412700120596','SOF10CAC100 CACAOLAT','Z',15,150,'DEFAULT',9.99,'2025-09-23','9999-12-31',0.200,0.003,210,'2025-09-23','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-23','9999-12-31','401201100','United Kingdom','G','Cacaolat Nas 200Ml','Cacaolat Nas 200Ml','8412700120100.png',1,'8412700120100.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','17784002','Ambient',0,0,0,0,0,NULL,NULL,NULL),(41,NULL,2,6,44,'468833','Filippo Berio Arrabiata Pasta Sauce 340g','6',6,6,'Case','8002210133235','8002210133242','GRO10FIL101 FILIPPO BERIO','Z',45,315,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.340,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','21039090','United Kingdom','G','Filippo Berio Arrabiata Pasta Sauce 340g','Filippo Berio Arrabiata Pasta Sauce 340g','8002210133235.png',1,'8002210133235.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','60000665','Ambient',0,0,0,0,0,NULL,NULL,NULL),(42,NULL,2,6,45,'468879','Carnation Evaporated Milk 12X410G Pmp £1.59','12',12,12,'Case','8445290479488','8445290479082','GRO10CAR106 CARNATION','Z',15,15,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.410,0.003,540,'2027-11-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','21069098','United Kingdom','G','Carnation Evaporated Milk 12X410G Pmp £1.59','Carnation Evaporated Milk 12X410G Pmp £1.59','8445290479488.png',1,'8445290479488.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','12563291','Ambient',0,0,0,0,0,NULL,NULL,NULL),(43,NULL,2,6,163,'468894','Del Monte Pineapple Slices In Juice 6 X 3.01Kg','1',1,1,'Case','24000118268','10024000118265','GRO10DEL105 DEL MON','Z',7,56,'DEFAULT',9.99,'2026-04-07','9999-12-31',3.000,0.003,210,'2026-10-28','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-01','9999-12-31','2008209000','United Kingdom','G','Del Monte Pineapple Slices In Juice 6 X 3.01Kg','Del Monte Pineapple Slices In Juice 6 X 3.01Kg','24000118268.png',1,'24000118268.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','DM072','Ambient',0,0,0,0,0,NULL,NULL,NULL),(44,NULL,3,12,47,'468916','Barratt Milk Straws Black Jack 10S','12',12,12,'Case','5060202714728','5060202714735','CON12BAR104 BARRATTS','A',66,462,'DEFAULT',9.99,'2025-01-16','9999-12-31',0.090,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-01-16','9999-12-31','190231030','United Kingdom','G','Barratt Milk Straws Black Jack 10S','Barratt Milk Straws Black Jack 10S','5060202714728.png',1,'5060202714728.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','/6','Ambient',0,0,0,0,0,NULL,NULL,NULL),(45,NULL,3,12,48,'468928','Wham Extreme Stick Pack 36G','40',40,40,'Case','5010511481774','5010511039548','CON12WHA100 WHAM EXTREME','A',46,506,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.040,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','21069098','United Kingdom','G','Wham Extreme Stick Pack 36G','Wham Extreme Stick Pack 36G','5010511481774.png',1,'5010511481774.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','BARR511','Ambient',0,0,0,0,0,NULL,NULL,NULL),(46,NULL,5,3,49,'468776','Zodiac Bubblegum  330Ml','12',12,12,'Case','5023603333349','5023603332359','SOF10ZOD100 ZODIAC','A',24,240,'DEFAULT',9.99,'2024-07-31','9999-12-31',0.330,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-07-31','9999-12-31','22029915','United Kingdom','G','Zodiac Bubblegum  330Ml','Zodiac Bubblegum  330Ml','5023603333349.png',1,'5023603333349.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','Q12G','Ambient',0,0,0,0,0,NULL,NULL,NULL),(47,NULL,4,14,50,'468932','Huntley & Palmer MINI DIPPER 5PK X 18','18',18,18,'Case','5060074982430','5060074982447','CRI10HUN100 Huntley & Palmer','A',10,90,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.250,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-18','9999-12-31','19053199','United Kingdom','G','Huntley & Palmer MINI DIPPER 5PK X 18','Huntley & Palmer MINI DIPPER 5PK X 18','5060074982430.png',1,'5060074982430.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','01HUNM10','Ambient',0,0,0,0,0,NULL,NULL,NULL),(48,NULL,4,14,51,'468934','Eat Real Chilli & Lemon Hummus Chips 110G','10',10,10,'Case','5060878780508','15060878780505','CRI10EAT101 EATREAL','Z',10,70,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.110,0.015,180,'2026-10-27','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','19059045','United Kingdom','G','Eat Real Chilli & Lemon Hummus Chips 110G','Eat Real Chilli & Lemon Hummus Chips 110G','5060878780508.png',1,'5060878780508.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','2061822','Ambient',0,0,0,0,0,NULL,NULL,NULL),(49,NULL,1,10,52,'469342','Grenade Caramel Chaos Protein Bar 60G','12',12,12,'Case','5060221201391','5060221203425','CON11GRE107 GRENADE','A',108,756,'DEFAULT',9.99,'2025-02-10','9999-12-31',0.060,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-03','9999-12-31','18063100','United Kingdom','G','Grenade Caramel Chaos Protein Bar 60G','Grenade Caramel Chaos Protein Bar 60G','5060221201391.png',1,'5060221201391.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','C006157','Ambient',0,0,0,0,0,NULL,NULL,NULL),(50,NULL,1,10,53,'469377','Fazer Dumle Original 150G','12',12,12,'Case','6411401072697','6416453472693','CON11FAZ100 FAZER','A',16,112,'DEFAULT',9.99,'2024-09-11','9999-12-31',0.150,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-03','9999-12-31','18063100','United Kingdom','G','Fazer Dumle Original 150G','Fazer Dumle Original 150G','6411401072697.png',1,'6411401072697.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','407269','Ambient',0,0,0,0,0,NULL,NULL,NULL),(51,NULL,2,6,54,'469510','Pathos Mushrooms Sliced 2.5Kg','6',6,6,'Case','5060282620964','5060282620971','GRO10PAT102 PATHOS','A',7,63,'DEFAULT',9.99,'2024-09-11','9999-12-31',2.500,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-03','9999-12-31','18063100','United Kingdom','G','Pathos Mushrooms Sliced 2.5Kg','Pathos Mushrooms Sliced 2.5Kg','5060282620964.png',1,'5060282620964.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','VEG004','Ambient',0,0,0,0,0,NULL,NULL,NULL),(52,NULL,4,14,55,'469514','Walkers Max Paprika 27G 6Pk 27G','12',12,12,'Case','5000328908137','5000328908144','CRI10WAL100 WALKERS','A',5,45,'DEFAULT',9.99,'2025-07-16','9999-12-31',0.030,0.029,78,'2026-07-01','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-22','9999-12-31','18063100','United Kingdom','G','Walkers Max Paprika 27g 6pk 27g','Walkers Max Paprika 27g 6pk 27g','5000328908137.png',1,'5000328908137.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','300001269','Ambient',0,0,0,0,0,NULL,NULL,NULL),(53,NULL,11,18,56,'469555','Warrior Protein Water - Berry x12 500ml Bottles','12',12,12,'Case','5060756345379','5060756345522','HEA11WAR100 WARRIOR','A',20,120,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.550,0.003,210,'2026-03-05','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-07','9999-12-31','2202100000','United Kingdom','G','Warrior Protein Water - Berry x12 500ml Bottles','Warrior Protein Water - Berry x12 500ml Bottles','5060756345379.png',1,'5060756345379.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','B326-B-12','Ambient',0,0,0,0,0,NULL,NULL,NULL),(54,NULL,8,22,57,'469669','CADBURY MILK DRINK CARAMEL','8',8,8,'Case','4025500283926','4025500283933','DES10MUL100 MULLER','Z',40,240,'DEFAULT',9.99,'2024-09-18','9999-12-31',0.250,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-09-18','9999-12-31','19019099','United Kingdom','G','CADBURY MILK DRINK CARAMEL','CADBURY MILK DRINK CARAMEL','4025500283926.png',1,'4025500283926.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','MICACAR250ML','Chilled',0,0,0,0,0,NULL,NULL,NULL),(55,NULL,1,10,58,'441624','Ritter Salted Caramel 100g','12',12,12,'Case','4000417271006','4000417271600','CON11RIT100 RITTER','A',50,400,'DEFAULT',9.99,'2025-06-23','9999-12-31',0.100,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-23','9999-12-31','20060038','Germany','G','Ritter Salted Caramel 100g','Ritter Salted Caramel 100g','4000417271006.png',1,'4000417271006.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(56,NULL,2,7,59,'442468','Weetabix Chocolate','10',10,10,'Case','5010029228977','5010029228984','CER10WEE100 WEETABIX','Z',20,80,'DEFAULT',9.99,'2024-02-08','9999-12-31',0.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-01-01','9999-12-31','18069031','United Kingdom','G','Weetabix Chocolate','Weetabix Chocolate','5010029228977.png',1,'5010029228977.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(57,NULL,6,15,60,'550053','Bahlsen 10pk Pick Up! Minis','14',14,14,'Case','4017100407567','4017100540752','BIS10BAH100 BAHLSEN','Z',7,70,'DEFAULT',9.99,'2025-09-11','9999-12-31',0.140,0.022,120,'2026-01-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-11','9999-12-31','19053191','Denmark','G','Bahlsen 10pk Pick Up! Minis','Bahlsen 10pk Pick Up! Minis','4017100407567.png',1,'4017100407567.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','94422','Ambient',0,0,0,0,0,NULL,NULL,NULL),(58,NULL,5,3,61,'444617','CAWSTON Cloudy Apple Juice','6',6,6,'case','5060054134026','5060054130431','SOF10CAW100 CAWSTON','Z',30,150,'DEFAULT',9.99,'2024-03-26','9999-12-31',1.100,0.010,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-03-14','9999-12-31','20099011','United Kingdom','G','CAWSTON Cloudy Apple Juice','CAWSTON Cloudy Apple Juice','5060054134026.png',1,'5060054134026.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(59,NULL,1,10,62,'444650','Diablo No Added Sugar Milk Chocolate  85g  x15','15',15,15,'case','5060309490006','5060309490518','CON11DIA100 DIABLO','A',80,480,'DEFAULT',9.99,'2025-06-16','9999-12-31',0.085,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-17','9999-12-31','18063290','United Kingdom','G','Diablo No Added Sugar Milk Chocolate  85g  x15','Diablo No Added Sugar Milk Chocolate  85g  x15','5060309490006.png',1,'5060309490006.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(60,NULL,3,12,63,'445196','Vidal 6X150 TONGUE PAINTER LOLLIES','6',6,6,'case','8413178166102','38413178166103','CON12VID100 VIDAL','A',9,54,'DEFAULT',9.99,'2025-08-06','9999-12-31',1.080,0.003,210,'2026-04-02','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-06','9999-12-31','1704907500','Spain','G','Vidal 6X150 TONGUE PAINTER LOLLIES','Vidal 6X150 TONGUE PAINTER LOLLIES','8413178166102.png',1,'38413178166103.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','1060213','Ambient',0,0,0,0,0,NULL,NULL,NULL),(61,NULL,2,6,64,'448940','Dole Mandarin in Juice 4-pack 4 x 113g','3',3,3,'Case','38900042370','5438900042366','GRO10DOL100 DOLE','Z',29,348,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.113,0.003,365,'2026-08-07','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-07','9999-12-31','20060091','United Kingdom','G','Dole Mandarin in Juice 4-pack 4 x 113g','Dole Mandarin in Juice 4-pack 4 x 113g','38900042370.png',1,'38900042370.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','389000424535','Ambient',0,0,0,0,0,NULL,NULL,NULL),(62,NULL,2,7,65,'449428','Fuel10K Chocolate Breakfast Milk Drink','8',8,8,'Case','5060201621836','5060201621935','CER10FUE100 FUEL10K','Z',36,288,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.330,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','18069019','United Kingdom','G','Fuel10K Chocolate Breakfast Milk Drink','Fuel10K Chocolate Breakfast Milk Drink','5060201621836.png',1,'5060201621836.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','1019345','Ambient',0,0,0,0,0,NULL,NULL,NULL),(63,NULL,5,2,66,'450211','Typhoo Eco Refill £1.29 Pmp','12',12,12,'Case','5060123602210','15055486000558','HOT10TYP100 TYPHOO','Z',31,217,'DEFAULT',9.99,'2026-04-13','9999-12-31',0.120,0.003,365,'2025-11-24','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-13','9999-12-31','9023000','United Kingdom','G','Typhoo Eco Refill £1.29 Pmp','Typhoo Eco Refill £1.29 Pmp','5060123602210.png',1,'5060123602210.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','TJ24038','Ambient',0,0,0,0,0,NULL,NULL,NULL),(64,NULL,5,2,67,'450223','London Fruit And Herb Lemon & Ginger','6',6,6,'Case','5060123607802','15060123608851','HOT10GLE100 GLENGETTIE','Z',31,310,'DEFAULT',9.99,'2025-11-17','9999-12-31',0.250,0.003,365,'2025-11-23','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-17','9999-12-31','9023000','United Kingdom','G','London Fruit And Herb Lemon & Ginger','London Fruit And Herb Lemon & Ginger','5060123607802.png',1,'5060123607802.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','S30576','Ambient',0,0,0,0,0,NULL,NULL,NULL),(65,NULL,5,2,68,'443417','HORLICKS INSTANT MALTED 400G JAR','6',6,6,'Case','5060113919366','506113919397','HOT10HOR100 HORLICKS','Z',28,224,'DEFAULT',9.99,'2024-02-13','9999-12-31',0.400,0.003,300,'2027-01-17','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-05','9999-12-31','1901909990','United Kingdom','G','HORLICKS INSTANT MALTED 400G JAR','HORLICKS INSTANT MALTED 400G JAR','5060113919366.png',1,'5060113919366.png',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','HLKLGT4U','Ambient',0,0,0,0,0,NULL,NULL,NULL),(66,NULL,3,12,69,'470546','Fini Halal Fizzy Watermelon Slices 12Bx75G','12',12,12,'Case','8410525178085','68410525178087','CON12FIN100 FINI','A',15,405,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.075,0.003,365,'2027-05-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','17049065','United Kingdom','G','Fini Halal Fizzy Watermelon Slices 12Bx75G','Fini Halal Fizzy Watermelon Slices 12Bx75G','8410525178085.png',1,'8410525178085.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','7050900056','Ambient',0,0,0,0,0,NULL,NULL,NULL),(67,NULL,6,15,70,'470548','Bounty Secret Centre 132G X 12','12',12,12,'Case','5060402908101','5060402908101','BIS10BOU100 BOUNTY','Z',25,207,'DEFAULT',9.99,'2025-11-17','9999-12-31',0.130,0.003,180,'2026-05-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-17','9999-12-31','19042099','United Kingdom','G','Bounty Secret Centre 132G X 12','Bounty Secret Centre 132G X 12','5060402908101.png',1,'5060402908101.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:18','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(68,NULL,5,3,71,'470554','Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','24',24,24,'Case','762571500197','762571312158','SOF10FRE101 FREEZ','A',14,98,'DEFAULT',9.99,'2025-11-03','9999-12-31',0.280,0.000,180,'2026-03-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-03','9999-12-31','21061080','Lebanon','G','Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml','762571500197.png',1,'762571500197.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','FRE002','Ambient',0,0,0,0,0,NULL,NULL,NULL),(69,NULL,5,3,72,'470564','Score Immune Blueberry Flavour 500Ml','12',12,12,'Case','6009708053596','6009708053695','SOF10SCO100 SCORE','A',20,160,'DEFAULT',9.99,'2026-06-04','9999-12-31',0.500,0.003,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-04','9999-12-31','22021000','South Africa','G','Score Immune Blueberry Flavour 500Ml','Score Immune Blueberry Flavour 500Ml','6009708053596.png',1,'6009708053596.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','103952','Ambient',0,0,0,0,0,NULL,NULL,NULL),(70,NULL,1,10,73,'470580','Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','1',1,1,'Case','5055037054620','5055037054620','CON11ELI100 ELIZABETH','A',32,288,'DEFAULT',9.99,'2025-06-02','9999-12-31',2.450,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-05-30','9999-12-31','18063290','United Kingdom','G','Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg','5055037054620.png',1,'5055037054620.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','5106766','Ambient',0,0,0,0,0,NULL,NULL,NULL),(71,NULL,2,6,74,'470589','Tassimo Costa Cappuccino Coffee Pods 8pk','5',5,5,'Case','8711000545324','8711000545331','GRO10TAS100 TASSIMO','A',18,108,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.280,0.003,180,'2026-03-17','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-18','9999-12-31','1902301080','United Kingdom','G','Tassimo Costa Cappuccino Coffee Pods 8pk','Tassimo Costa Cappuccino Coffee Pods 8pk','8711000545324.png',1,'8711000545324.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','4056513','Ambient',0,0,0,0,0,NULL,NULL,NULL),(72,NULL,2,6,75,'470597','Bens Original Caribbean RTH 220g','6',6,6,'Case','5010034014282','5010034014558','GRO10BEN100 BENS ORIGINAL','A',42,336,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.220,0.015,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','17049000','United Kingdom','G','Bens Original Caribbean Rth 220G','Bens Original Caribbean Rth 220G','5010034014282.png',1,'5010034014282.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','426114','Ambient',0,0,0,0,0,NULL,NULL,NULL),(73,NULL,1,10,76,'470647','Rolo Multipack 12(4X41.6G) Pr £1.85 Xb Mpacks','12',12,12,'Case','8445291527867','8445291527874','CON11ROL100 ROLO','A',28,224,'DEFAULT',9.99,'2026-04-30','9999-12-31',0.166,0.008,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-30','9999-12-31','180690','United Kingdom','G','Rolo Multipack 12(4X41.6G) Pr £1.85 Xb Mpacks','Rolo Multipack 12(4X41.6G) Pr £1.85 Xb Mpacks','8445291527867.png',1,'8445291527867.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','12602258','Ambient',0,0,0,0,0,NULL,NULL,NULL),(74,NULL,2,6,77,'470667','Mcdougalls Fish Batter Mix 3.5Kg','1',1,1,'Case','5000354203824','5000117204938','GRO10MCD100 MCDOUGALL','A',56,280,'DEFAULT',9.99,'2024-10-11','9999-12-31',3.500,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-03','9999-12-31','1902301080','United Kingdom','G','Mcdougalls Fish Batter Mix 3.5Kg','Mcdougalls Fish Batter Mix 3.5Kg','5000354203824.png',1,'5000354203824.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','1006763/4','Ambient',0,0,0,0,0,NULL,NULL,NULL),(75,NULL,2,6,78,'470679','Cawoods Sardines In Spiced Soya Oil 125G','50',50,50,'Case','5020580023508','5020580023515','GRO10CAW101 CAWOODS','A',12,132,'DEFAULT',9.99,'2024-10-11','9999-12-31',0.130,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-03','9999-12-31','1902301080','United Kingdom','G','Cawoods Sardines In Spiced Soya Oil 125G','Cawoods Sardines In Spiced Soya Oil 125G','5020580023508.png',1,'5020580023508.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','22935','Ambient',0,0,0,0,0,NULL,NULL,NULL),(76,NULL,5,4,79,'470717','Wow Hydrate Electrolyte Lemon & Lime Water 500ml','12',12,12,'Case','5060446100455','5060446100554','WAT10WOW100 WOW HYDRATE','A',22,110,'DEFAULT',9.99,'2025-09-08','9999-12-31',0.500,0.000,180,'2026-01-12','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-08','9999-12-31','22021000','United Kingdom','G','Wow Hydrate Electrolyte Lemon & Lime Water 500ml','Wow Hydrate Electrolyte Lemon & Lime Water 500ml','5060446100455.png',1,'5060446100455.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','HWPLEL0501UG12A','Ambient',0,0,0,0,0,NULL,NULL,NULL),(77,NULL,1,10,4,'470737','Nestle Damak Caramel Croquant with Pistachio 6x60g','12',12,12,'Case','8445291349292','8445291349308','CON11NES108 NESTLE','A',19,114,'DEFAULT',9.99,'2024-10-14','9999-12-31',0.360,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-10-14','9999-12-31','18069019','Turkey','G','Nestle Damak Caramel Croquant with Pistachio 6x60g','Nestle Damak Caramel Croquant with Pistachio 6x60g','8445291349292.png',1,'8445291349292.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','201006','Ambient',0,0,0,0,0,NULL,NULL,NULL),(78,NULL,5,3,80,'470776','Prime Hydration Drink 12x500mL Haaland V2 (made to order)','12',12,12,'Case','810116125388','10810116125385','SOF10PRI101 PRIME','A',22,132,'DEFAULT',9.99,'2024-10-17','9999-12-31',0.500,0.020,365,'2026-07-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-01-20','9999-12-31','2202991911','United Kingdom','G','Prime Hydration Drink 12x500mL Haaland V2','Prime Hydration Drink 12x500mL Haaland V2','810116125388.png',1,'810116125388.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','PH1242EBH-UK','Ambient',0,0,0,0,0,NULL,NULL,NULL),(79,NULL,4,14,81,'469097','Yubi Bar Protein Bars Choc Orange 35G','12',12,12,'Case','5065013646244','5065013646282','CRI10YUB100 YUBI','A',84,840,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.040,0.003,210,'2026-05-07','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-22','9999-12-31','21061020','United Kingdom','G','Yubi Bar Protein Bars Choc Orange 35G','Yubi Bar Protein Bars Choc Orange 35G','5065013646244.png',1,'5065013646244.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','YUB/COB/12','Ambient',0,0,0,0,0,NULL,NULL,NULL),(80,NULL,3,12,82,'469137','Kidsmania Chatty Chomper Candy Lollipop 17G','12',12,12,'Case','5031396087929','5031396087912','CON12KID105 KIDSMANIA','A',4,192,'DEFAULT',9.99,'2026-04-27','2026-06-16',0.020,0.015,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-27','2026-06-16','17049099','Spain','G','Kidsmania Chatty Chomper Candy Lollipop 17G','Kidsmania Chatty Chomper Candy Lollipop 17G','5031396087929.png',1,'5031396087929.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(81,NULL,1,10,83,'470840','Baileys Original 35g Bar','20',20,20,'Case','5099872017082','5099872017587','CON11BAI100 BAILEYS','A',36,360,'DEFAULT',9.99,'2024-10-22','9999-12-31',0.035,0.003,360,'2026-09-06','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-10-22','9999-12-31','18069010','Ireland','G','Baileys Original 35g Bar','Baileys Original 35g Bar','5099872017082.png',1,'5099872017082.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(82,NULL,1,10,84,'470416','Quality Street Box  265 g','12',12,12,'Case','5000426112160','5000426412161','CON11QUA101 QUALITY STREET','A',108,540,'DEFAULT',9.99,'2024-10-22','9999-12-31',0.270,0.003,285,'2026-04-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-10-22','9999-12-31','18063290','United Kingdom','G','Quality Street Box  265 g','Quality Street Box  265 g','5000426112160.png',1,'5000426112160.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','12467903','Ambient',0,0,0,0,0,NULL,NULL,NULL),(83,NULL,4,14,85,'471016','Cathedral City Baked Bites (19.2g x 5) x 15 srp','15',15,15,'Case','72417194870','5010049194870','CRI10CAT100 CATHEDRAL','A',9,54,'DEFAULT',9.99,'2024-10-24','9999-12-31',0.930,0.003,270,'2026-06-08','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-11','9999-12-31','19059045','United Kingdom','G','Cathedral City Baked Bites (19.2g x 5) x 15 srp','Cathedral City Baked Bites (19.2g x 5) x 15 srp','72417194870.png',1,'72417194870.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(84,NULL,3,12,86,'470925','Cheery Chews Gummy Rush Atomic Peaches Tub 150G','12',12,12,'Case','6282356196659','6282356196666','CON12CHE105 CHEERY CHEWS','A',22,220,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.150,0.003,180,'2026-05-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-29','9999-12-31','1700000000','Turkey','G','Cheery Chews Gummy Rush Atomic Peaches Tub 150G','Cheery Chews Gummy Rush Atomic Peaches Tub 150G','6282356196659.png',1,'6282356196659.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','9665','Ambient',0,0,0,0,0,NULL,NULL,NULL),(85,NULL,4,14,87,'471026','Skips Prawn Cocktail PM 50p 17g','30',30,30,'Case','5000237202715','5000237202708','CRI10SKI101 SKIPS','Z',10,70,'DEFAULT',9.99,'2025-11-13','9999-12-31',0.020,0.003,180,'2026-05-12','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-13','9999-12-31','19059080','United Kingdom','G','Skips Prawn Cocktail PM 50p 17g','Skips Prawn Cocktail PM 50p 17g','5000237202715.png',1,'5000237202708.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','702783','Ambient',0,0,0,0,0,NULL,NULL,NULL),(86,NULL,1,10,164,'469361','Reeses Big Cup Puffs 9X16X98G','16',16,16,'Case','34000229178','5025820215590','CON11REE100 REESES','A',72,288,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.100,0.003,180,'2026-11-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','21069098','United Kingdom','G','Reeses Big Cup Puffs 9X16X98G','Reeses Big Cup Puffs 9X16X98G','34000229178.png',1,'34000229178.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','3400022916LS','Ambient',0,0,0,0,0,NULL,NULL,NULL),(87,NULL,5,5,89,'469003','HELL ICE COFFEE DOUBLE ESPRESSO','12',12,12,'Case','5999571051342','5999571053193','ENE10HEL100 HELL','A',12,120,'DEFAULT',9.99,'2025-01-17','9999-12-31',0.250,0.003,180,'2026-02-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-07','9999-12-31','2202101','Hungary','G','ICE COFFEE DOUBLE ESPRESSO','ICE COFFEE DOUBLE ESPRESSO','5999571051342.png',1,'5999571051342.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','6100002712','Ambient',0,0,0,0,0,NULL,NULL,NULL),(88,NULL,5,3,90,'471167','MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','12',12,12,'Case','5060476290737','15060476290734','SOF10MEG100 MEGA BRAIN','A',20,180,'DEFAULT',9.99,'2024-11-27','9999-12-31',0.500,0.003,280,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-11-27','9999-12-31','17049000','United Kingdom','G','MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK','5060476290737.png',1,'5060476290737.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','MBL01','Ambient',0,0,0,0,0,NULL,NULL,NULL),(89,NULL,3,12,91,'462571','Millions Tubes Strawberry 55g','12',12,12,'Case','5017375134709','5017375234706','CON12MIL100 MILLIONS','A',120,720,'DEFAULT',9.99,'2024-11-27','9999-12-31',0.750,0.003,730,'2027-09-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-13','9999-12-31','17049061','United Kingdom','G','Millions Tubes Strawberry 55g','Millions Tubes Strawberry 55g','5017375 134709.png',1,'5017375 134709.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','3470','Ambient',0,0,0,0,0,NULL,NULL,NULL),(90,NULL,4,14,92,'471210','Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','12',12,12,'Case','7340001804447','27340001804151','CRI10BAR103 BAREBELLS','A',24,360,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.060,0.003,210,'2026-06-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-22','9999-12-31','1810000000','United Kingdom','G','Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','Barebells Marshmallow Rocky Roan Soft Protein Bar 55G','7340001804447.png',1,'7340001804447.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','B1055-GBDKNO','Ambient',0,0,0,0,0,NULL,NULL,NULL),(91,NULL,12,20,93,'471286','Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','4',4,4,'Case','8445291265714','8445291265721','PET10FEL100 FELIX','A',18,126,'DEFAULT',9.99,'2026-05-28','9999-12-31',1.020,0.009,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-28','9999-12-31','23091011','Switzerland','G','Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G','8445291265714.png',1,'8445291265714.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','12586413','Ambient',0,0,0,0,0,NULL,NULL,NULL),(92,NULL,5,3,94,'471345','Vita Coco Pressed 330Ml','12',12,12,'Case','898999011073','5060232812265','SOF10VIT101 VITA','A',24,192,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.330,0.003,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','22021000','United Kingdom','G','Vita Coco Pressed 330Ml','Vita Coco Pressed 330Ml','898999011073.png',1,'898999011073.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','901505','Ambient',0,0,0,0,0,NULL,NULL,NULL),(93,NULL,4,14,95,'471382','Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','11',11,11,'Case','5016451444329','5016451884323','CRI10SEA101 SEABROOK','A',12,96,'DEFAULT',9.99,'2025-01-09','9999-12-31',0.070,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-04-11','9999-12-31','20052020','United Kingdom','G','Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G','5016451444329.png',1,'5016451444329.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','432R','Ambient',0,0,0,0,0,NULL,NULL,NULL),(94,NULL,5,3,96,'471392','Huel Daily A-Z Cherry & Raspberry 330Ml','12',12,12,'Case','5060925290837','5060925291742','SOF10HUE100 HUEL','A',26,234,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.330,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','17049000','United Kingdom','G','Huel Daily A-Z Cherry & Raspberry 330Ml','Huel Daily A-Z Cherry & Raspberry 330Ml','5060925290837.png',1,'5060925290837.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','AZV12CRA','Ambient',0,0,0,0,0,NULL,NULL,NULL),(95,NULL,5,4,97,'471478','Celtic Spring Sports Cap 1L','12',12,12,'Case','5019490312550','5019490312567','WAT10CEL100 CELTIC','A',11,66,'DEFAULT',9.99,'2025-01-09','9999-12-31',1.000,0.003,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-04-11','9999-12-31','22029915','United Kingdom','G','Celtic Spring Sports Cap 1L','Celtic Spring Sports Cap 1L','5019490312550.png',1,'5019490312550.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','FG-469','Ambient',0,0,0,0,0,NULL,NULL,NULL),(96,NULL,2,6,98,'471707','Milo Powder Ghana 400G','6',6,6,'Case','6033000085658','7613036973175','GRO10MIL105 MILO','A',16,144,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.400,0.003,540,'2027-11-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','402219100','United Kingdom','G','Milo Instant Malt Chocolate - Ghana 6X400G','Milo Instant Malt Chocolate - Ghana 6X400G','7613036973175.png',1,'7613036973175.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','12400394','Ambient',0,0,0,0,0,NULL,NULL,NULL),(97,NULL,2,6,99,'471710','PRINCES TUNA CHNK SFO 12X145G PMP £1.59','12',12,12,'Case','5000232031501','5000232031518','GRO10PRI100 P','Z',22,352,'DEFAULT',9.99,'2025-11-29','9999-12-31',0.150,0.003,210,'2026-06-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-29','9999-12-31','2000000000','United Kingdom','G','PRINCES TUNA CHNK SFO 12X145G PMP Ã‚£1.59','PRINCES TUNA CHNK SFO 12X145G PMP Ã‚£1.59','5000232031501.png',1,'5000232031501.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','440421','Ambient',0,0,0,0,0,NULL,NULL,NULL),(98,NULL,1,10,165,'471094','Beech\'s Champagne Truffles','5',5,5,'Case','5011701003011','5011701003103','CON11BEE100 BEECHS','A',18,180,'DEFAULT',9.99,'2025-02-06','9999-12-31',0.140,0.003,365,'2026-07-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-10-30','9999-12-31','1806901100','United Kingdom','G','Beech\'s Champagne Truffles 140g','Beech\'s Champagne Truffles 140g','5011701003011.png',1,'5011701003011.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','290','Ambient',0,0,0,0,0,NULL,NULL,NULL),(99,NULL,1,10,101,'472503','Milka Cow Spots 90G','24',24,24,'Case','7622202262524','7622202262517','CON11MIL107 MILKA','A',21,319,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.090,0.018,210,'2026-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Milka Cow Spots 90G','Milka Cow Spots 90G','7622202262524.png',1,'7622202262524.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','4317134','Ambient',0,0,0,0,0,NULL,NULL,NULL),(100,NULL,1,10,102,'471234','McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','10',10,10,'Case','5000168006673','5000168006680','CON11MCV103 MCVITIES CAKES','A',20,180,'DEFAULT',9.99,'2025-10-20','9999-12-31',0.300,0.001,210,'2026-04-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-10-13','9999-12-31','1905907000','United Kingdom','G','McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk','5000168006673.png',1,'5000168006673.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','45758','Ambient',0,0,0,0,0,NULL,NULL,NULL),(101,NULL,2,6,103,'471648','Tate & Lyles Topping Syrup Butterscotch 325g','6',6,6,'Case','5010115201006','5010115900633','GRO10TAT100 TATE & LYLE','Z',50,350,'DEFAULT',9.99,'2025-09-18','9999-12-31',0.325,0.003,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-18','9999-12-31','21032000','United Kingdom','G','Tate & Lyles Topping Syrup Butterscotch 325g','Tate & Lyles Topping Syrup Butterscotch 325g','5010115201006.png',1,'5010115201006.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','432792','Ambient',0,0,0,0,0,NULL,NULL,NULL),(102,NULL,4,14,104,'472812','Lorenz Crunchips XCut Cheese & Onion 12x75g','12',12,12,'Case','4018077773228','4018077000324','CRI10LOR101 LORENZ','A',10,80,'DEFAULT',9.99,'2025-03-19','9999-12-31',0.080,0.003,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-03-19','9999-12-31','20052020','Poland','G','Lorenz Crunchips XCut Cheese & Onion 12x75g','Lorenz Crunchips XCut Cheese & Onion 12x75g','4018077773228.png',1,'4018077773228.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','47553','Ambient',0,0,0,0,0,NULL,NULL,NULL),(103,NULL,11,19,105,'473130','Aquafresh Kids Milk Teeth 50Ml','12',12,12,'Case','5000347090967','5000469090968','DEN10AQU100 AQUAFRESH','A',70,490,'DEFAULT',9.99,'2025-09-29','9999-12-31',0.050,0.003,365,'2026-09-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-04-07','9999-12-31','33049900','United Kingdom','G','Aquafresh Kids Milk Teeth 50Ml','Aquafresh Kids Milk Teeth 50Ml','5000347090967.png',1,'5000347090967.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','AQU50MT','Ambient',0,0,0,0,0,NULL,NULL,NULL),(104,NULL,2,7,106,'472642','Mornflake Chocolate Squares Pmp 2.49 375G','6',6,6,'Case','5010026520906','5010026520913','CER10MOR100 MORNFLAKE','A',18,108,'DEFAULT',9.99,'2026-04-13','9999-12-31',0.380,0.003,210,'2026-08-13','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-13','9999-12-31','11041200','United Kingdom','G','Mornflake Chocolate Squares Pmp 2.49 375G','Mornflake Chocolate Squares Pmp 2.49 375G','5010026520906.png',1,'5010026520906.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','CR048103','Ambient',0,0,0,0,0,NULL,NULL,NULL),(105,NULL,4,14,107,'472648','Pastri Shop - Choc Drizzle Pastries 3Pk 165G','15',15,15,'Case','703694584541','7036945845416','CRI10PAS100 PASTRI SHOP','A',15,165,'DEFAULT',9.99,'2025-11-03','9999-12-31',0.170,0.000,365,'2026-09-10','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-03','9999-12-31','19059070','Spain','G','Pastri Shop - Choc Drizzle Pastries 3Pk 165G','Pastri Shop - Choc Drizzle Pastries 3Pk 165G','703694584541.png',1,'703694584541.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','PS09','Ambient',0,0,0,0,0,NULL,NULL,NULL),(106,NULL,3,12,108,'472671','Swizzels 6X60 Refreshers Tropical Chew Bar','6',6,6,'Case','5010478715486','5010478779143','CON12TRO105 TROPICAL','A',15,75,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.180,0.015,365,'2027-05-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','17049065','United Kingdom','G','Tropical Chew Bar 20P 18G','Tropical Chew Bar 20P 18G','5010478715486.png',1,'5010478715486.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','74767','Ambient',0,0,0,0,0,NULL,NULL,NULL),(107,NULL,3,12,109,'474033','Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','24',24,24,'Case','4820219341291','4820219341659','CON12BOB100 BOB SNAIL','A',84,252,'DEFAULT',9.99,'2025-12-22','9999-12-31',0.030,0.003,180,'2026-04-07','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-22','9999-12-31','1810000000','Ukraine','G','Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','Bob Snail Choco Crush - Dark Choc Apple Cherry 30G','4820219341291.png',1,'4820219341291.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(108,NULL,13,21,110,'474176','CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','12',12,12,'Case','5011597538000','5011597537775','HOU10CLE103 CLEAN UPS','A',72,1152,'DEFAULT',9.99,'2025-04-30','9999-12-31',0.110,0.080,500,'2026-12-07','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-04-30','9999-12-31','6307101000','China','G','CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS','5011597538000.png',1,'5011597538000.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','CU104N-1','Ambient',0,0,0,0,0,NULL,NULL,NULL),(109,NULL,5,5,111,'474350','Tenzing Lime And Mint 330Ml','12',12,12,'Case','5060444851038','5060444851045','ENE10TEN101 TENZING','A',26,234,'DEFAULT',9.99,'2025-08-04','9999-12-31',0.330,0.003,365,'2026-08-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-04','9999-12-31','8194764','United Kingdom','G','Tenzing Lime And Mint 330Ml','Tenzing Lime And Mint 330Ml','5060444851038.png',1,'5060444851038.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','TENCAS12LM330-UK','Ambient',0,0,0,0,0,NULL,NULL,NULL),(110,NULL,2,6,112,'969633','CROWN SWEET CORN 3X8','8',8,8,'Case','5065017471033','15065017471023','GRO10CRO109 CROWN','Z',19,190,'DEFAULT',9.99,'2025-08-07','9999-12-31',0.552,0.003,1090,'2028-08-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-07','9999-12-31','20058000','United Kingdom','G','CROWN SWEET CORN 3X8','CROWN SWEET CORN 3X8','11111.png',1,'11111.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(111,NULL,13,21,113,'474865','Dylon Spray Starch With Easy Iron 300Ml','6',6,6,'Case','5000325049543','5000325049550','HOU10DYL100 DYLON','A',56,280,'DEFAULT',9.99,'2026-03-03','9999-12-31',0.300,0.003,365,'2027-03-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-03-03','9999-12-31','6307103000','United Kingdom','G','Dylon Spray Starch With Easy Iron 300Ml','Dylon Spray Starch With Easy Iron 300Ml','5000325049543.png',1,'5000325049543.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','11082','Ambient',0,0,0,0,0,NULL,NULL,NULL),(112,NULL,5,4,114,'474682','Buxton Sparkling 8x50cl MP Semi','8',8,8,'Case','7613287034489','7613287034489','WAT10BUX100 BUXTON','Z',30,180,'DEFAULT',9.99,'2025-06-17','9999-12-31',0.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-17','9999-12-31','2201101100','United Kingdom','G','Buxton Sparkling 8x50cl MP Semi','Buxton Sparkling 8x50cl MP Semi','7613287034489.png',1,'7613287034489.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(113,NULL,5,4,115,'475397','Perrier Water 4 x 330cl','6',6,6,'Case','5015552555132','5015552555118','WAT10PER100 PERRIER','A',21,84,'DEFAULT',9.99,'2025-06-09','9999-12-31',1.500,0.003,210,'2026-04-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-06-17','9999-12-31','2201101900','United Kingdom','G','Perrier Water 4 x 330cl','Perrier Water 4 x 330cl','5015552555132.png',1,'5015552555132.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19',NULL,'Ambient',0,0,0,0,0,NULL,NULL,NULL),(114,NULL,2,6,116,'475657','Sarsons Dip & Drizzle Original 250G','8',8,8,'Case','5060336504141','5060336504134','GRO10SAR100 SARSONS','A',60,300,'DEFAULT',9.99,'2026-01-05','9999-12-31',0.250,0.003,210,'2026-07-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-01-05','9999-12-31','2103903000','United Kingdom','G','Sarsons Dip & Drizzle Original 250G','Sarsons Dip & Drizzle Original 250G','5060336504141.png',1,'5060336504141.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','2000846','Ambient',0,0,0,0,0,NULL,NULL,NULL),(115,NULL,13,21,117,'460851','Freedom 4pk 2ply TT Soft White','40',40,40,'Case','5028635000610','5026874000118','HOU10FRE100 FREEDOM','A',11,55,'DEFAULT',9.99,'2025-08-11','9999-12-31',0.070,0.010,999,'2028-05-06','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-11','9999-12-31','48181090','United Kingdom','G','Freedom 4pk 2ply TT Soft White','Freedom 4pk 2ply TT Soft White','5028635000610.png',1,'5028635000610.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','FRT24','Ambient',0,0,0,0,0,NULL,NULL,NULL),(116,NULL,5,3,118,'478511','KULANA ORANGE BLEND JUICE 12X1LTR SLIM','12',12,12,'Case','5011064014419','5011064014426','SOF10KUL100 KULANA','A',15,75,'DEFAULT',9.99,'2025-07-02','9999-12-31',1.000,0.003,270,'2026-03-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-07-02','9999-12-31','10732800','Ireland','G','KULANA ORANGE BLEND JUICE 12X1LTR SLIM','KULANA ORANGE BLEND JUICE 12X1LTR SLIM','5011064014419.png',1,'5011064014419.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','145496','Ambient',0,0,0,0,0,NULL,NULL,NULL),(117,NULL,4,14,119,'478648','Kettle Lightly Salted 130g','12',12,12,'Case','5017764901356','5017764128104','CRI10KET100 KETTLE','A',8,72,'DEFAULT',9.99,'2025-12-15','9999-12-31',0.130,0.003,210,'2026-07-13','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-15','9999-12-31','19019099','United Kingdom','G','Kettle Lightly Salted 130g','Kettle Lightly Salted 130g','5017764901356.png',1,'5017764901356.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','FG002956','Ambient',0,0,0,0,0,NULL,NULL,NULL),(118,NULL,8,16,120,'480070','Tropicana Apple PM 1.50 250Ml','12',12,12,'Case','1210002009096','1210002009089','CHI11TRO107 TROPICANA','A',29,232,'DEFAULT',9.99,'2025-09-08','9999-12-31',0.250,0.003,210,'2026-02-11','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-08','9999-12-31','2202991911','United Kingdom','G','Tropicana Apple PM 1.50 250Ml','Tropicana Apple PM 1.50 250Ml','1210002009096.png',1,'1210002009096.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','NONE','Chilled',0,0,0,0,0,NULL,NULL,NULL),(119,NULL,2,6,121,'480226','Pot Noodle Sticky Rib 90g','12',12,12,'Case','8718114797977','8718114930251','GRO10POT100 POT NOODLES','Z',10,100,'DEFAULT',9.99,'2026-01-01','9999-12-31',0.090,0.000,159,'2025-12-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-01-01','9999-12-31','19023010','United Kingdom','G','Pot Noodle Sticky Rib 90g','Pot Noodle Sticky Rib 90g','8718114797977.png',1,'8718114797977.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','67492328','Ambient',0,0,0,0,0,NULL,NULL,NULL),(120,NULL,4,14,122,'480422','Munchkings Pretzel Crush, Honey, Mustard, Onion','9',9,9,'Case','5060789600391','5060789600391','CRI10MUN101 MUNCHKINGS','A',24,264,'DEFAULT',9.99,'2025-08-06','9999-12-31',0.125,0.003,210,'2026-03-04','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-06','9999-12-31','1905905500','Bulgaria','G','Munchkings Pretzel Crush, Honey, Mustard, Onion','Munchkings Pretzel Crush, Honey, Mustard, Onion','5060789600391.png',1,'5060789600391.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:43:06','5060789600391','Ambient',0,0,0,0,0,NULL,NULL,NULL),(121,NULL,5,3,123,'480514','Levi Roots Caribbean Crush Pm 1.15 500Ml','12',12,12,'Case','5010438020650','5010438020865','SOF10LEV100 LEVI ROOTS','A',22,154,'DEFAULT',9.99,'2026-03-21','9999-12-31',0.500,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-03-21','9999-12-31','22090011','United Kingdom','G','Levi Roots Caribbean Crush Pm 1.15 500Ml','Levi Roots Caribbean Crush Pm 1.15 500Ml','5010438020650.png',1,'5010438020650.jpg',NULL,'2026-07-01 04:44:13','2026-07-25 10:04:19','8332','Ambient',0,0,0,0,0,NULL,NULL,NULL),(122,NULL,3,12,124,'480923','Sweetzone Blue Raspberry Bottles','6',6,6,'Case','5032860060035','5032860960205','CON12SWE102 Sweetzone','A',10,100,'DEFAULT',9.99,'2025-09-02','9999-12-31',0.805,0.003,210,'2026-03-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-02','9999-12-31','22021025','United Kingdom','G','Sweetzone Blue Raspberry Bottles','Sweetzone Blue Raspberry Bottles','5032860060035.png',1,'5032860060035.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:43:06','SZTBSMBRB','Ambient',0,0,0,0,0,NULL,NULL,NULL),(123,NULL,2,6,125,'480842','Riva Foods  Retail garlic baguettes','1',1,1,'Case','4056489462064','4056489462064','GRO10RIV100 RIVA FOOD','A',10,80,'DEFAULT',9.99,'2025-09-03','9999-12-31',0.205,0.003,210,'2026-04-01','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-09-03','9999-12-31','20079990','United Kingdom','G','Riva Foods  Retail garlic baguettes','Riva Foods  Retail garlic baguettes','4056489462064.png',1,'4056489462064.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:43:06','BR035','Ambient',0,0,0,0,0,NULL,NULL,NULL),(124,NULL,13,21,126,'460868','Winter Spices Disinfectant','12',12,12,'Case','5000185116454','5000185037148','HOU10EAS101 EASY','A',20,140,'DEFAULT',9.99,'2024-02-27','9999-12-31',0.040,0.003,999,'2028-04-19','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-02-27','9999-12-31','34022090','United Kingdom','G','Easy Winter Spices Disinfectant','Easy Winter Spices Disinfectant','5000185116454.png',1,'5000185116454.png',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','2007818','Ambient',0,0,0,0,0,NULL,NULL,NULL),(125,NULL,8,16,127,'481478','Yazoo Banana 300Ml','12',12,12,'Case','5410438035874','5410438035881','CHI11YAZ107 YAZOO','Z',22,176,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.300,0.003,210,'2026-07-20','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','19059080','United Kingdom','G','Yazoo Banana 300Ml','Yazoo Banana 300Ml','5410438035874.png',1,'5410438035874.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','704524','Chilled',0,0,0,0,0,NULL,NULL,NULL),(126,NULL,4,14,128,'481481','Takis Blue Heat 100G','18',18,18,'Case','5018297012236','5018297012243','CRI10TAK100 TAKIS','Z',10,70,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.100,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','19059080','United Kingdom','G','Takis Blue Heat 100G','Takis Blue Heat 100G','5018297012236.png',1,'5018297012236.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','512064','Ambient',0,0,0,0,0,NULL,NULL,NULL),(127,NULL,4,14,129,'481538','Pipers Crisps Anglesey Sea Salt 40G','24',24,24,'Case','5033060100125','5033060101177','CRI10PIP101 PIPERS','A',16,96,'DEFAULT',9.99,'2026-05-25','9999-12-31',0.040,0.022,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-25','9999-12-31','19059045','United Kingdom','G','Pipers Crisps Anglesey Sea Salt 40G','Pipers Crisps Anglesey Sea Salt 40G','5033060100125.png',1,'5033060100125.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','CRIANG016','Ambient',0,0,0,0,0,NULL,NULL,NULL),(128,NULL,5,5,130,'480816','C4 Energy Crb Cosmic Rainbow','12',12,12,'Case','842595119145','842595119152','ENE10C4E100 C4 ENERGY','A',18,144,'DEFAULT',9.99,'2025-10-16','9999-12-31',0.500,0.000,210,'2026-05-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-10-16','9999-12-31','2202100000','Poland','G','C4 Energy Crb Cosmic Rainbow','C4 Energy Crb Cosmic Rainbow','842595119145.png',1,'842595119145.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(129,NULL,1,10,131,'481739','PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','12',12,12,'Case','5060119292036','5060119291961','CON11PHD100 PHD','A',72,576,'DEFAULT',9.99,'2025-10-30','9999-12-31',0.064,0.000,210,'2026-05-28','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-10-30','9999-12-31','19059080','United Kingdom','G','PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk','5060119292036.png',1,'5060119292036.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','131989','Ambient',0,0,0,0,0,NULL,NULL,NULL),(130,NULL,11,17,132,'460938','Tiama Celeb Bodyspray Female 75Ml','6',6,6,'Case','5028748008442','5028748108227','HEA10TIA100 TIAMA','A',128,1152,'DEFAULT',9.99,'2025-11-24','9999-12-31',0.080,0.003,730,'2027-11-24','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-24','9999-12-31','82122000','United Kingdom','G','Tiama Celeb Bodyspray Female 75Ml','Tiama Celeb Bodyspray Female 75Ml','5028748008442.png',1,'5028748008442.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','FBS-71198','Ambient',0,0,0,0,0,NULL,NULL,NULL),(131,NULL,6,15,133,'481912','Bakehouse Minis Cookies 200g','20',20,20,'Case','5397139001851','5397139001868','BIS10BAK100 BAKEHOUSE','Z',18,126,'DEFAULT',9.99,'2025-11-12','9999-12-31',0.200,0.000,210,'2026-06-10','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-11-12','9999-12-31','19059080','United Kingdom','G','Bakehouse Minis Cookies 200g','Bakehouse Minis Cookies 200g','5397139001851.png',1,'5397139001851.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','FEB078','Ambient',0,0,0,0,0,NULL,NULL,NULL),(132,NULL,13,21,134,'462405','Dr Johnson Antiseptic Disinfectant Original','12',12,12,'Case','5025416330027','5025416331024','HOU10DRJ100 DR JOHNSON','A',20,140,'DEFAULT',9.99,'2025-08-11','9999-12-31',0.500,0.003,365,'2026-08-11','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-08-11','9999-12-31','22090011','United Kingdom','G','Dr Johnson Antiseptic Disinfectant Original','Dr Johnson Antiseptic Disinfectant Original','5025416330027.png',1,'5025416330027.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','ASD500','Ambient',0,0,0,0,0,NULL,NULL,NULL),(133,NULL,5,3,135,'482063','UFIT High Protein Shake Drink Chocolate PMP £1.79','8',8,8,'Case','5060317323556','5060317323563','SOF10UFI100 UFIT','Z',31,248,'DEFAULT',9.99,'2026-03-21','9999-12-31',0.310,0.003,210,'2026-08-03','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-03-21','9999-12-31','22029995','United Kingdom','G','UFIT High Protein Shake Drink Chocolate PMP £1.79','UFIT High Protein Shake Drink Chocolate PMP £1.79','5060317323556.png',1,'5060317323556.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(134,NULL,2,6,136,'444992','Goldenfry Beef Gravy Granules 300g','6',6,6,'case','5010105001760','5010105001777','GRO10GOL101 GOLDENFRY','Z',30,270,'DEFAULT',9.99,'2025-12-04','9999-12-31',0.300,0.020,210,'2026-07-02','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-04','9999-12-31','21039090','United Kingdom','G','Goldenfry Beef Gravy Granules 300g','Goldenfry Beef Gravy Granules 300g','5010105001760.png',1,'5010105001760.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','329','Ambient',0,0,0,0,0,NULL,NULL,NULL),(135,NULL,4,14,137,'482364','Pophouse Caramelized Popcorn Classic 180G','15',15,15,'Case','4751028310201','4751028310881','CRI10POP107 POPHOUSE','A',80,144,'DEFAULT',9.99,'2025-12-15','9999-12-31',0.180,0.000,365,'2026-12-15','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2025-12-15','9999-12-31','19019099','United Kingdom','G','Pophouse Caramelized Popcorn Classic 180G','Pophouse Caramelized Popcorn Classic 180G','4751028310201.png',1,'4751028310201.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','POP01','Ambient',0,0,0,0,0,NULL,NULL,NULL),(136,NULL,5,3,138,'482414','Dash Sparkling Peach','12',12,12,'Case','5060489730206','15060489730203','SOF10DAS100 DASH','A',26,208,'DEFAULT',9.99,'2026-06-08','2026-07-26',0.330,0.003,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-08','2026-07-26','21069098','United Kingdom','G','Dash Sparkling Peach','Dash Sparkling Peach','5060489730206.png',1,'5060489730206.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','DBL004','Ambient',0,0,0,0,0,NULL,NULL,NULL),(137,NULL,1,10,60,'482509','Bahlsen Chocolate Leibniz Snack Packs 27.5G','30',30,30,'Case','4017100210860','4017100210860','CON11BAH100 BAHLSEN','Z',30,510,'DEFAULT',9.99,'2026-05-26','9999-12-31',0.030,0.003,210,'2026-12-22','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-26','9999-12-31','1704906500','United Kingdom','G','Bahlsen Chocolate Leibniz Snack Packs 27.5G','Bahlsen Chocolate Leibniz Snack Packs 27.5G','4017100210860.png',1,'4017100210860.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(138,NULL,1,10,139,'482813','Gnaw 70% Dark Chocolate','15',15,15,'Case','5060463492359','5060463492359','CON11GNA101 GNAW','A',12,120,'DEFAULT',9.99,'2026-01-08','9999-12-31',0.080,0.000,210,'2026-08-06','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-01-08','9999-12-31','19053191','United Kingdom','G','Gnaw 70% Dark Chocolate','Gnaw 70% Dark Chocolate','5060463492359.png',1,'5060463492359.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','GPN0001','Ambient',0,0,0,0,0,NULL,NULL,NULL),(139,NULL,4,14,140,'482900','Maretti Bruschette Tomato','7',7,7,'Case','3800205875109','23800205875639','CRI10MAR113 MARETTI','Z',27,324,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.070,0.015,240,'2026-12-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-16','9999-12-31','17049000','United Kingdom','G','Maretti Bruschette Tomato','Maretti Bruschette Tomato','3800205875109.png',1,'3800205875109.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','S214305','Ambient',0,0,0,0,0,NULL,NULL,NULL),(140,NULL,11,17,141,'482805','Ultrex 10\'s Ultra Slim (4x12)','48',48,48,'Case','5060110223374','5060110223374','HEA10ULT100 ULTREX','Z',15,60,'DEFAULT',9.99,'2026-02-03','9999-12-31',0.150,0.000,210,'2026-12-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-01-20','9999-12-31','404103600','United Kingdom','G','Ultrex 10\'s Ultra Slim (4x12)','Ultrex 10\'s Ultra Slim (4x12)','5060110223374.png',1,'5060110223374.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','2318','Ambient',0,0,0,0,0,NULL,NULL,NULL),(141,NULL,1,10,142,'483252','Ferrero Rocher T24 X6 Diamond','6',6,6,'Case','8000500009673','8000500143353','CON11FER100 FERRERO ROCHER','A',18,108,'DEFAULT',9.99,'2026-04-27','9999-12-31',0.310,0.010,225,'2026-12-08','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-27','9999-12-31','18069039','Italy','G','Ferrero Rocher T24 X6 Diamond','Ferrero Rocher T24 X6 Diamond','8000500009673.png',1,'8000500009673.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','XGB620794','Ambient',0,0,0,0,0,NULL,NULL,NULL),(142,NULL,2,7,143,'463463','NESQUIK Cereal Bar MP 8(6x25g) N2 GB','8',8,8,'CASE','5900020031372','5900020031389','CER10NES109 NESQUIK','Z',21,147,'DEFAULT',9.99,'2024-04-11','9999-12-31',0.150,0.010,210,'2026-04-16','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-05-03','9999-12-31','1905907000','United Kingdom','G','NESQUIK Cereal Bar MP 8(6x25g) N2 GB','NESQUIK Cereal Bar MP 8(6x25g) N2 GB','5900020031372.png',1,'5900020031372.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(143,NULL,11,17,144,'464141','Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','24',24,24,'Case','74312002496','10074312002493','HEA10NAT100 NATURE\'S BOUNTY','Z',12,96,'DEFAULT',9.99,'2024-04-05','9999-12-31',0.030,0.010,210,'2026-01-29','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-04-02','9999-12-31','2106909285','United Kingdom','G','Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE','74312002496.png',1,'74312002496.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','12539263','Ambient',0,0,0,0,0,NULL,NULL,NULL),(144,NULL,13,21,145,'466144','Greenshield Anti-Bac Floor Wipes 24\'s','12',12,12,'Case','5060110227495','5060110227549','HOU10GRE100 GREENSHIELD','A',100,100,'DEFAULT',9.99,'2024-05-10','9999-12-31',0.100,0.003,365,'2026-09-11','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-05-10','9999-12-31','34022090','United Kingdom','G','Greenshield Anti-Bac Floor Wipes 24\'s','Greenshield Anti-Bac Floor Wipes 24\'s','5060110227495.png',1,'5060110227495.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(145,NULL,1,10,146,'486096','Moo free Mini Bars Milk','20',20,20,'Case','5060235830938','15060235830935','CON11MOO101 MOO FREE','A',11,847,'DEFAULT',9.99,'2026-05-16','9999-12-31',0.020,0.015,210,'2026-11-26','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-16','9999-12-30','18063210','United Kingdom','G','Moo free Mini Bars Milk','Moo free Mini Bars Milk','5060235830938.png',1,'5060235830938.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(146,NULL,13,21,147,'486231','Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','10',10,10,'Case','5000186802585','5000186696108','HOU10COM100 COMFORT','A',15,90,'DEFAULT',9.99,'2026-04-03','9999-12-31',1.000,0.002,999,'2028-12-27','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-03','9999-12-31','34025090','United Kingdom','G','Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie','5000186802585.png',1,'5000186802585.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','64367608','Ambient',0,0,0,0,0,NULL,NULL,NULL),(147,NULL,1,10,55,'466310','Walkers Dark Chocolates Mint Cream Thins','24',24,24,'Case','5011555024811','5011555022312','CON11WAL100 WALKERS','A',11,132,'DEFAULT',9.99,'2024-05-29','9999-12-31',0.140,0.010,180,'2025-12-30','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-05-29','9999-12-31','18069019','United Kingdom','G','Walkers Dark Chocolates Mint Cream Thins','Walkers Dark Chocolates Mint Cream Thins','5011555024811.png',1,'5011555024811.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','116707','Ambient',0,0,0,0,0,NULL,NULL,NULL),(148,NULL,5,3,148,'442591','AriZona Iced Tea Lemon *6x500ml','6',6,6,'Case','613008730697','613008732530','SOF10ARI101 ARIZONA','A',29,203,'DEFAULT',9.99,'2024-02-06','9999-12-31',0.550,0.003,240,'2026-05-09','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-02-06','9999-12-31','22021024','United Kingdom','G','AriZona Iced Tea Lemon *6x500ml','AriZona Iced Tea Lemon *6x500ml','442591.png',1,'442591.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(149,NULL,5,3,149,'442808','Stute Superior Pure Apple Juice 1 Ltr','12',12,12,'Case','5060628820423','15060628820420','SOF10STU100 STUTE','A',15,75,'DEFAULT',9.99,'2024-02-08','9999-12-31',1.040,0.010,300,'2026-07-15','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2024-02-08','9999-12-31','22021000','United Kingdom','G','Stute Superior Pure Apple Juice 1 Ltr','Stute Superior Pure Apple Juice 1 Ltr','5060628820423.png',1,'5060628820423.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(150,NULL,4,14,150,'610154','NAKD BLUEBERRY MUFFIN','18',18,18,'Case','5060088705940','5060088705957','CRI10NAK105 Nakd','A',0,720,'DEFAULT',9.99,'2026-06-05','2026-08-16',0.040,0.003,95,'2026-09-06','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','2026-08-16','20089778','United Kingdom','G','NAKD BLUEBERRY MUFFIN','NAKD BLUEBERRY MUFFIN','5060088705940.png',1,'5060088705940.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','70104896','Ambient',0,0,0,0,0,NULL,NULL,NULL),(151,NULL,5,2,151,'487049','Yorkshire Tea Bags 10x80','10',10,10,'Case','5010357112061','5010357112061','HOT10YOR101 YORKSHIRE TEA','A',18,108,'DEFAULT',9.99,'2026-04-23','9999-12-31',0.250,0.000,210,'2026-11-19','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-23','9999-12-31','9023000','United Kingdom','G','Yorkshire Tea Bags 10x80','Yorkshire Tea Bags 10x80','5010357112061.png',1,'5010357112061.jpg',NULL,'2026-07-01 04:44:14','2026-07-25 10:04:19','1019','Ambient',0,0,0,0,0,NULL,NULL,NULL),(152,NULL,1,10,152,'487184','Lees 10 Snowballs','12',12,12,'Case','5010082133263','5010082233277','CON11LEE101 LEES','Z',8,80,'DEFAULT',9.99,'2026-04-23','9999-12-31',0.125,0.001,210,'2026-11-19','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-23','9999-12-30','1905907000','United Kingdom','G','Lees 10 Snowballs','Lees 10 Snowballs','5010082133263.png',1,'5010082133263.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 13:24:06','F10144','Ambient',0,0,0,0,0,NULL,NULL,NULL),(153,NULL,11,17,153,'487233','Clean & Clear 100Ml Dual Act Moisturising Cream','6',6,6,'Case','5000207007159','5000207007159','HEA10CLE100 CLEAN & CLEAR','A',88,528,'DEFAULT',9.99,'2026-04-22','9999-12-31',0.100,0.003,210,'2026-11-18','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-04-22','9999-12-31','3304990000','United Kingdom','G','Clean & Clear 100Ml Dual Act Moisturising Cream','Clean & Clear 100Ml Dual Act Moisturising Cream','5000207007159.png',1,'5000207007159.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 12:52:24','CLE005','Ambient',0,0,0,0,0,NULL,NULL,NULL),(154,NULL,3,12,154,'487512','Bip Pop Up Lollipops Disney Marvel Mix 10G','72',72,72,'Case','8714786307346','8714786307360','CON12BIP100 BIP','A',12,96,'DEFAULT',9.99,'2026-05-26','9999-12-31',0.010,0.008,210,'2026-12-22','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-26','9999-12-31','17049065','United Kingdom','G','Bip Pop Up Lollipops Disney Marvel Mix 10G','Bip Pop Up Lollipops Disney Marvel Mix 10G','8714786307346.png',1,'8714786307346.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 13:24:40','73402000','Ambient',0,0,0,0,0,NULL,NULL,NULL),(155,NULL,2,6,155,'487673','Lyles Chocolate Wave Bottle 325G','6',6,6,'Case','5010115803125','5010115103126','GRO10LYL100 LYLES','Z',50,350,'DEFAULT',9.99,'2026-05-18','2026-07-05',0.325,0.018,210,'2026-12-14','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-05-18','2026-07-05','18069019','United Kingdom','G','Lyles Chocolate Wave Bottle 325G','Lyles Chocolate Wave Bottle 325G','5010115803125.png',1,'5010115803125.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 13:40:55','NONE','Ambient',0,0,0,0,0,NULL,NULL,NULL),(156,NULL,4,14,156,'488285','Pip & Nut Peanut Butter Stuffed Original Oat Bar','15',15,15,'Case','5060367181946','5060367182004','CRI10PIP100 PIP & NUT','A',22,748,'DEFAULT',9.99,'2026-06-04','9999-12-31',0.050,0.000,210,'2026-12-31','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-04','9999-12-30','19042099','United Kingdom','G','Pip & Nut Peanut Butter Stuffed Original Oat Bar','Pip & Nut Peanut Butter Stuffed Original Oat Bar','5060367181946.png',1,'5060367181946.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 13:54:25','401040','Ambient',0,0,0,0,0,NULL,NULL,NULL),(157,NULL,12,20,157,'488301','Feedwell Supreme 15KG','1',1,1,'Case','5026433000023','5026433000023','PET10FEE100 Feedwell','A',11,55,'DEFAULT',9.99,'2026-06-05','9999-12-31',15.000,0.000,210,'2027-01-01','STD',NULL,10.99,NULL,NULL,NULL,NULL,'2026-06-05','9999-12-31','23091011','United Kingdom','G','Feedwell Supreme 15KG','Feedwell Supreme 15KG','5026433000023.png',1,'5026433000023.jpg',NULL,'2026-07-01 04:44:14','2026-08-05 22:19:25','200','Ambient',0,0,0,0,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products_backup`
--

DROP TABLE IF EXISTS `products_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_backup` (
  `id` int NOT NULL DEFAULT '0',
  `supplier_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `units_of` varchar(50) DEFAULT NULL,
  `inner_case_quantity` int DEFAULT NULL,
  `outer_case_quantity` int DEFAULT NULL,
  `qty_desc` varchar(255) DEFAULT NULL,
  `barcode_ean` varchar(100) DEFAULT NULL,
  `barcode_case` varchar(100) DEFAULT NULL,
  `group_desc` varchar(255) DEFAULT NULL,
  `vat_code` varchar(50) DEFAULT NULL,
  `layer_quantity` int DEFAULT NULL,
  `pallet_quantity` int DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `cost_from_date` date DEFAULT NULL,
  `cost_to_date` date DEFAULT NULL,
  `weight` decimal(12,3) DEFAULT NULL,
  `volume` decimal(12,3) DEFAULT NULL,
  `shelf_life` int DEFAULT NULL,
  `bbd` varchar(100) DEFAULT NULL,
  `price_list` varchar(100) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `comm_code` varchar(100) DEFAULT NULL,
  `intra_country` varchar(100) DEFAULT NULL,
  `intra_type` varchar(100) DEFAULT NULL,
  `web_short_description` text,
  `web_long_description` longtext,
  `web_image` varchar(255) DEFAULT NULL,
  `live_for_web` tinyint DEFAULT '1',
  `encore_image` varchar(255) DEFAULT NULL,
  `obsolete` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `supplier_reference` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_backup`
--

LOCK TABLES `products_backup` WRITE;
/*!40000 ALTER TABLE `products_backup` DISABLE KEYS */;
INSERT INTO `products_backup` VALUES (323,NULL,1,2,NULL,'Young\'s Cooked & Peeled Prawns £4.50',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(324,NULL,5,6,NULL,'Nescafe Azera Americano 500G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(325,NULL,6,7,NULL,'Mcvities Penguin & Friends Cocoa 5X20G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(326,NULL,6,8,NULL,'Bisto Gravy Granules Beef Pm 2.99 190G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(327,NULL,4,9,NULL,'Red Bull Edition Blue June Berry PM 1.55 250ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(328,NULL,5,10,NULL,'Tetley Decaf Pm 2.19 40S',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(329,NULL,7,11,NULL,'Lindt Creation Lemon,(317648)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(330,NULL,7,12,NULL,'Nando\'S Hot Peri-Peri Marinade 260G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(331,NULL,7,13,NULL,'Candy Castle Crew Bubblegum Bottles PM 1.00 90g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(332,NULL,8,14,NULL,'Golden Wonder Ringos Cheese & Onion Pm 1.00 40G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(333,NULL,7,15,NULL,'Bazooka Chews Sour PM 1.00 120g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(334,NULL,7,16,NULL,'Jack Daniels Bbq Sauce Original 553G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(335,NULL,4,17,NULL,'Fruit Shoot Nas Apple  275ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(336,NULL,4,18,NULL,'Powerade Golden Mango 500Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(337,NULL,4,19,NULL,'Lucozade Alert Mango Peachade Pm 1.00 500Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(338,NULL,6,20,NULL,'Green s Sponge Cake Chocolate PM 1.99 221g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(339,NULL,9,21,NULL,'Rice Krispies Squares Cornflakes 30X31G 79P Pmp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(340,NULL,7,22,NULL,'Bebeto Fizzy Peach Hearts 150G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(341,NULL,6,23,NULL,'Heinz By Nature 6+ Months Egg Custard Rice Jar 6 X 120G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(342,NULL,7,24,NULL,'Snickers Creamy Peanut Nut Butter Chocolate Trio Bar 54.75G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(343,NULL,3,1,NULL,'Cadbury 140G Brunch Pnut 8Ca',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(344,NULL,7,25,NULL,'Chupa Chups Babol Apple 27g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(345,NULL,NULL,26,NULL,'Hartleys Jam Raspberry Seedless Pm 1.99 300G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(346,NULL,6,27,NULL,'John West Plant Power Harissa 145g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(347,NULL,NULL,28,NULL,'Starbucks Pet Chilled Cofee Skinny Latte 220Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(348,NULL,NULL,29,NULL,'Sheba Classica In Terrine With Chicken 85G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(349,NULL,NULL,30,NULL,'Wafflemeister 90g Classic Liege Waffle',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(350,NULL,7,31,NULL,'Free From Fellows Cola Bottles 100G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(351,NULL,4,32,NULL,'Galaxy Chocolate Milkshake 250Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(352,NULL,7,33,NULL,'Haribo Happy Cola 160g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(353,NULL,6,34,NULL,'Jack Links Biltong 20g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(354,NULL,7,35,NULL,'Knoppers Nut Bar 40G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(355,NULL,8,36,NULL,'Proper Chickpea Chips Ghost Chilli & Yuzu 85G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(356,NULL,4,37,NULL,'Rubicon Spring Spk Pink Grapefruit Blood Orange 500Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(357,NULL,7,38,NULL,'Beanies Bubble Gum 50g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(358,NULL,4,39,NULL,'Jelly Belly Berry Blue Fruit Drink 330ml NRB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(359,NULL,7,40,NULL,'Chewits Blue Raspberry Juicy Bites Bag 115G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(360,NULL,7,41,NULL,'Brain Blasterz Candy Spray 28ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(361,NULL,8,42,NULL,'Force Protein Bar Birthday Cake 65g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(362,NULL,4,43,NULL,'Cacaolat Nas 200Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(363,NULL,6,44,NULL,'Filippo Berio Arrabiata Pasta Sauce 340g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(364,NULL,6,45,NULL,'Carnation Evaporated Milk 12X410G Pmp £1.59',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(365,NULL,6,46,NULL,'Del Monte Pineapple Slices In Juice 6 X 3.01Kg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(366,NULL,7,47,NULL,'Barratt Milk Straws Black Jack 10S',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(367,NULL,7,48,NULL,'Wham Extreme Stick Pack 36G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(368,NULL,4,49,NULL,'Zodiac Bubblegum  330Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:33','2026-07-25 08:51:57',NULL),(369,NULL,8,50,NULL,'Huntley & Palmer MINI DIPPER 5PK X 18',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(370,NULL,8,51,NULL,'Eat Real Chilli & Lemon Hummus Chips 110G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(371,NULL,7,52,NULL,'Grenade Caramel Chaos Protein Bar 60G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(372,NULL,7,53,NULL,'Fazer Dumle Original 150G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(373,NULL,6,54,NULL,'Pathos Mushrooms Sliced 2.5Kg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(374,NULL,8,55,NULL,'Walkers Max Paprika 27G 6Pk 27G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(375,NULL,NULL,56,NULL,'Warrior Protein Water - Berry x12 500ml Bottles',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(376,NULL,NULL,57,NULL,'CADBURY MILK DRINK CARAMEL',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(377,NULL,7,58,NULL,'Ritter Salted Caramel 100g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(378,NULL,9,59,NULL,'Weetabix Chocolate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(379,NULL,3,60,NULL,'Bahlsen 10pk Pick Up! Minis',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(380,NULL,4,61,NULL,'CAWSTON Cloudy Apple Juice',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(381,NULL,7,62,NULL,'Diablo No Added Sugar Milk Chocolate  85g  x15',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(382,NULL,7,63,NULL,'Vidal 6X150 TONGUE PAINTER LOLLIES',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(383,NULL,6,64,NULL,'Dole Mandarin in Juice 4-pack 4 x 113g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(384,NULL,9,65,NULL,'Fuel10K Chocolate Breakfast Milk Drink',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(385,NULL,5,66,NULL,'Typhoo Eco Refill £1.29 Pmp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(386,NULL,5,67,NULL,'London Fruit And Herb Lemon & Ginger',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(387,NULL,5,68,NULL,'HORLICKS INSTANT MALTED 400G JAR',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(388,NULL,7,69,NULL,'Fini Halal Fizzy Watermelon Slices 12Bx75G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(389,NULL,3,70,NULL,'Bounty Secret Centre 132G X 12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(390,NULL,4,71,NULL,'Freez Mix Sparkling Blue Hawaii (Tropical Fruits) Flavour Drink 4X6Pk 275Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(391,NULL,4,72,NULL,'Score Immune Blueberry Flavour 500Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(392,NULL,7,73,NULL,'Elizabeth Shaw Dark Mint Creme - 200S 2.45Kg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(393,NULL,6,74,NULL,'Tassimo Costa Cappuccino Coffee Pods 8pk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(394,NULL,6,75,NULL,'Bens Original Caribbean RTH 220g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(395,NULL,7,76,NULL,'Rolo Multipack 12(4X41.6G) Pr £1.85 Xb Mpacks',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(396,NULL,6,77,NULL,'Mcdougalls Fish Batter Mix 3.5Kg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(397,NULL,6,78,NULL,'Cawoods Sardines In Spiced Soya Oil 125G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(398,NULL,NULL,79,NULL,'Wow Hydrate Electrolyte Lemon & Lime Water 500ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(399,NULL,7,4,NULL,'Nestle Damak Caramel Croquant with Pistachio 6x60g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(400,NULL,4,80,NULL,'Prime Hydration Drink 12x500mL Haaland V2 (made to order)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(401,NULL,8,81,NULL,'Yubi Bar Protein Bars Choc Orange 35G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(402,NULL,7,82,NULL,'Kidsmania Chatty Chomper Candy Lollipop 17G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(403,NULL,7,83,NULL,'Baileys Original 35g Bar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(404,NULL,7,84,NULL,'Quality Street Box  265 g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(405,NULL,8,85,NULL,'Cathedral City Baked Bites (19.2g x 5) x 15 srp',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(406,NULL,7,86,NULL,'Cheery Chews Gummy Rush Atomic Peaches Tub 150G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(407,NULL,8,87,NULL,'Skips Prawn Cocktail PM 50p 17g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(408,NULL,7,88,NULL,'Reeses Big Cup Puffs 9X16X98G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(409,NULL,NULL,89,NULL,'HELL ICE COFFEE DOUBLE ESPRESSO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(410,NULL,4,90,NULL,'MEGA BRAIN LICKER SOUR BLUE RASPBERRY CANDY DRINK',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(411,NULL,7,91,NULL,'Millions Tubes Strawberry 55g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(412,NULL,8,92,NULL,'Barebells Marshmallow Rocky Roan Soft Protein Bar 55G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(413,NULL,NULL,93,NULL,'Felix As Good As It Looks Favourites Selection Wet Cat Foodpm 4.75 12 X 85G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(414,NULL,4,94,NULL,'Vita Coco Pressed 330Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(415,NULL,8,95,NULL,'Seabrook Loaded Fire Eaters Smokehouse Cayenne PM 1.25 65G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(416,NULL,4,96,NULL,'Huel Daily A-Z Cherry & Raspberry 330Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(417,NULL,NULL,97,NULL,'Celtic Spring Sports Cap 1L',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(418,NULL,6,98,NULL,'Milo Powder Ghana 400G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(419,NULL,6,99,NULL,'PRINCES TUNA CHNK SFO 12X145G PMP £1.59',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(420,NULL,7,100,NULL,'Beech\'s Champagne Truffles',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(421,NULL,7,101,NULL,'Milka Cow Spots 90G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(422,NULL,7,102,NULL,'McVities Hobnobs Chocolate Flapjack PM 1.49 5Pk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(423,NULL,6,103,NULL,'Tate & Lyles Topping Syrup Butterscotch 325g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(424,NULL,8,104,NULL,'Lorenz Crunchips XCut Cheese & Onion 12x75g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(425,NULL,NULL,105,NULL,'Aquafresh Kids Milk Teeth 50Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(426,NULL,9,106,NULL,'Mornflake Chocolate Squares Pmp 2.49 375G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(427,NULL,8,107,NULL,'Pastri Shop - Choc Drizzle Pastries 3Pk 165G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(428,NULL,7,108,NULL,'Swizzels 6X60 Refreshers Tropical Chew Bar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(429,NULL,7,109,NULL,'Bob Snail Choco Crush - Dark Choc Apple Cherry 30G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(430,NULL,NULL,110,NULL,'CLEAN UPS 2PK MICROFIBRE KITCHEN CLOTHS',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(431,NULL,NULL,111,NULL,'Tenzing Lime And Mint 330Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(432,NULL,6,112,NULL,'CROWN SWEET CORN 3X8',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(433,NULL,NULL,113,NULL,'Dylon Spray Starch With Easy Iron 300Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(434,NULL,NULL,114,NULL,'Buxton Sparkling 8x50cl MP Semi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(435,NULL,NULL,115,NULL,'Perrier Water 4 x 330cl',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(436,NULL,6,116,NULL,'Sarsons Dip & Drizzle Original 250G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(437,NULL,NULL,117,NULL,'Freedom 4pk 2ply TT Soft White',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(438,NULL,4,118,NULL,'KULANA ORANGE BLEND JUICE 12X1LTR SLIM',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(439,NULL,8,119,NULL,'Kettle Lightly Salted 130g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(440,NULL,NULL,120,NULL,'Tropicana Apple PM 1.50 250Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(441,NULL,6,121,NULL,'Pot Noodle Sticky Rib 90g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(442,NULL,8,122,NULL,'Munchkings Pretzel Crush, Honey, Mustard, Onion',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(443,NULL,4,123,NULL,'Levi Roots Caribbean Crush Pm 1.15 500Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(444,NULL,7,124,NULL,'Sweetzone Blue Raspberry Bottles',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(445,NULL,6,125,NULL,'Riva Foods  Retail garlic baguettes',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(446,NULL,NULL,126,NULL,'Winter Spices Disinfectant',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(447,NULL,NULL,127,NULL,'Yazoo Banana 300Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(448,NULL,8,128,NULL,'Takis Blue Heat 100G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(449,NULL,8,129,NULL,'Pipers Crisps Anglesey Sea Salt 40G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(450,NULL,NULL,130,NULL,'C4 Energy Crb Cosmic Rainbow',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(451,NULL,7,131,NULL,'PHD BAR SMART HFSS CHOC PEANUT BUTTER 64G EU6 1X12 -Milk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(452,NULL,NULL,132,NULL,'Tiama Celeb Bodyspray Female 75Ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(453,NULL,3,133,NULL,'Bakehouse Minis Cookies 200g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(454,NULL,NULL,134,NULL,'Dr Johnson Antiseptic Disinfectant Original',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(455,NULL,4,135,NULL,'UFIT High Protein Shake Drink Chocolate PMP £1.79',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(456,NULL,6,136,NULL,'Goldenfry Beef Gravy Granules 300g',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(457,NULL,8,137,NULL,'Pophouse Caramelized Popcorn Classic 180G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(458,NULL,4,138,NULL,'Dash Sparkling Peach',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(459,NULL,7,60,NULL,'Bahlsen Chocolate Leibniz Snack Packs 27.5G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(460,NULL,7,139,NULL,'Gnaw 70% Dark Chocolate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(461,NULL,8,140,NULL,'Maretti Bruschette Tomato',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(462,NULL,NULL,141,NULL,'Ultrex 10\'s Ultra Slim (4x12)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(463,NULL,7,142,NULL,'Ferrero Rocher T24 X6 Diamond',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(464,NULL,9,143,NULL,'NESQUIK Cereal Bar MP 8(6x25g) N2 GB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(465,NULL,NULL,144,NULL,'Natures Bounty Bedtime Bal w/ Mg&B6 60TabXE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(466,NULL,NULL,145,NULL,'Greenshield Anti-Bac Floor Wipes 24\'s',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(467,NULL,7,146,NULL,'Moo free Mini Bars Milk',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(468,NULL,NULL,147,NULL,'Comfort Fabric Conditioner Blue In Iron 1L 28W Ukie',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(469,NULL,7,55,NULL,'Walkers Dark Chocolates Mint Cream Thins',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(470,NULL,4,148,NULL,'AriZona Iced Tea Lemon *6x500ml',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(471,NULL,4,149,NULL,'Stute Superior Pure Apple Juice 1 Ltr',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(472,NULL,8,150,NULL,'NAKD BLUEBERRY MUFFIN',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(473,NULL,5,151,NULL,'Yorkshire Tea Bags 10x80',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(474,NULL,7,152,NULL,'Lees 10 Snowballs',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(475,NULL,NULL,153,NULL,'Clean & Clear 100Ml Dual Act Moisturising Cream',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(476,NULL,7,154,NULL,'Bip Pop Up Lollipops Disney Marvel Mix 10G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(477,NULL,6,155,NULL,'Lyles Chocolate Wave Bottle 325G',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(478,NULL,8,156,NULL,'Pip & Nut Peanut Butter Stuffed Original Oat Bar',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL),(479,NULL,NULL,157,NULL,'Feedwell Supreme 15KG',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,10.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,'2026-06-22 06:13:34','2026-07-25 08:51:57',NULL);
/*!40000 ALTER TABLE `products_backup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_containers`
--

DROP TABLE IF EXISTS `shipping_containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_containers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `container_name` varchar(100) NOT NULL,
  `container_type` enum('Dry','Reefer') NOT NULL,
  `volume_m3` decimal(8,2) NOT NULL,
  `gross_weight_kg` decimal(10,2) NOT NULL,
  `payload_weight_kg` decimal(10,2) NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_countries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone_id` int NOT NULL,
  `country_name` varchar(120) NOT NULL,
  `country_code` char(2) NOT NULL,
  `active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_country_zone` (`zone_id`),
  CONSTRAINT `fk_country_zone` FOREIGN KEY (`zone_id`) REFERENCES `shipping_zones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=583 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_countries`
--

LOCK TABLES `shipping_countries` WRITE;
/*!40000 ALTER TABLE `shipping_countries` DISABLE KEYS */;
INSERT INTO `shipping_countries` VALUES (389,2,'Albania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(390,2,'Algeria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(391,2,'American Samoa','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(392,2,'Angola','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(393,2,'Anguilla','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(394,2,'Antarctica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(395,2,'Antigua and Barbuda','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(396,2,'Argentina','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(397,2,'Aruba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(398,2,'Australia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(399,2,'Austria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(400,2,'Bahamas','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(401,2,'Bahrain','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(402,2,'Bangladesh','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(403,2,'Barbados','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(404,2,'Belgium','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(405,2,'Belize','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(406,2,'Benin','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(407,2,'Bermuda','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(408,2,'Bonaire, Sint Eustatius, and Saba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(409,2,'Bosnia and Herzegovina','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(410,2,'Brazil','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(411,2,'Virgin Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(412,2,'Virgin Islands (U.S.)','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(413,2,'Brunei','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(414,2,'Bulgaria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(415,2,'Burkina Faso','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(416,2,'Cambodia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(417,2,'Cameroon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(418,2,'Canada','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(419,2,'Cabo Verde','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(420,2,'Cayman Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(421,2,'Chile','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(422,2,'China','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(423,2,'Colombia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(424,2,'Comoros','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(425,2,'Congo','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(426,2,'Democratic Republic of The Congo','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(427,2,'Cook Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(428,2,'Costa Rica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(429,2,'Croatia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(430,2,'Cuba','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(431,2,'Curaçao','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(432,2,'Cyprus','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(433,2,'Czechia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(434,2,'Denmark','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(435,2,'Djibouti','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(436,2,'Dominica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(437,2,'Dominican Republic','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(438,2,'Ecuador','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(439,2,'Egypt','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(440,2,'El Salvador','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(441,2,'Equatorial Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(442,2,'Eritrea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(443,2,'Estonia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(444,2,'Ethiopia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(445,2,'Faroe Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(446,2,'Fiji','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(447,2,'Finland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(448,2,'France','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(449,2,'French Guiana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(450,2,'French Polynesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(451,2,'Gabon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(452,2,'Gambia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(453,2,'Georgia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(454,2,'Germany','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(455,2,'Ghana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(456,2,'Gibraltar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(457,2,'Greece','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(458,2,'Grenada','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(459,2,'Guadeloupe','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(460,2,'Guam','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(461,2,'Guatemala','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(462,2,'Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(463,2,'Guinea-Bissau','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(464,2,'Guyana','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(465,2,'Haiti','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(466,2,'Honduras','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(467,2,'Hong Kong','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(468,2,'Hungary','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(469,2,'Iceland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(470,2,'India','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(471,2,'Indonesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(472,2,'Ivory Coast','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(473,2,'Iran','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(474,2,'Iraq','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(475,2,'Ireland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(476,2,'Israel','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(477,2,'Italy','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(478,2,'Jamaica','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(479,2,'Japan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(480,2,'Jordan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(481,2,'Kazakhstan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(482,2,'Kenya','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(483,2,'Kiribati','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(484,2,'Kuwait','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(485,2,'Latvia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(486,2,'Lebanon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(487,2,'Lesotho','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(488,2,'Liberia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(489,2,'Libya','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(490,2,'Lithuania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(491,2,'Luxembourg','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(492,2,'Macao','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(493,2,'Madagascar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(494,2,'Malawi','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(495,2,'Malaysia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(496,2,'Maldives','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(497,2,'Malta','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(498,2,'Marshall Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(499,2,'Martinique','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(500,2,'Mauritius','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(501,2,'Mayotte','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(502,2,'Mexico','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(503,2,'Micronesia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(504,2,'Montenegro','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(505,2,'Montserrat','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(506,2,'Morocco','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(507,2,'Mozambique','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(508,2,'Myanmar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(509,2,'Namibia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(510,2,'Nauru','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(511,2,'Nepal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(512,2,'Netherlands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(513,2,'New Caledonia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(514,2,'New Zealand','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(515,2,'Nicaragua','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(516,2,'Nigeria','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(517,2,'Niue','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(518,2,'Northern Mariana Islands','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(519,2,'Norway','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(520,2,'Oman','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(521,2,'Pakistan','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(522,2,'Palau','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(523,2,'Panama','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(524,2,'Papua New Guinea','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(525,2,'Paraguay','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(526,2,'Peru','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(527,2,'Philippines','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(528,2,'Poland','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(529,2,'Portugal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(530,2,'Puerto Rico','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(531,2,'Qatar','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(532,2,'Réunion','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(533,2,'Romania','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(534,2,'Russia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(535,2,'Saint Kitts and Nevis','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(536,2,'Saint Lucia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(537,2,'Saint Pierre and Miquelon','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(538,2,'Saint Vincent and the Grenadines','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(539,2,'Samoa','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(540,2,'Sao Tome and Principe','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(541,2,'Saudi Arabia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(542,2,'Senegal','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(543,2,'Serbia','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(544,2,'Seychelles','XX',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(545,2,'Sierra Leone','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(546,2,'Singapore','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(547,2,'Sint Maarten','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(548,2,'Slovakia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(549,2,'Slovenia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(550,2,'Solomon Islands','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(551,2,'Somalia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(552,2,'South Africa','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(553,2,'South Korea','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(554,2,'Spain','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(555,2,'Sri Lanka','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(556,2,'Sudan','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(557,2,'Suriname','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(558,2,'Sweden','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(559,2,'Switzerland','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(560,2,'Syria','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(561,2,'Taiwan','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(562,2,'Tanzania','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(563,2,'Thailand','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(564,2,'Timor-Leste','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(565,2,'Togo','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(566,2,'Tonga','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(567,2,'Trinidad and Tobago','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(568,2,'Tunisia','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(569,2,'Turkey','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(570,2,'Turks and Caicos Islands','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(571,2,'Tuvalu','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(572,2,'Ukraine','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(573,2,'United Arab Emirates','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(574,1,'United Kingdom','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(575,2,'USA','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(576,2,'Uruguay','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(577,2,'Vanuatu','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(578,2,'Venezuela','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(579,2,'Vietnam','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(580,2,'Wallis and Futuna','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(581,2,'Yemen','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(582,2,'Zimbabwe','XX',1,'2026-07-25 10:04:26','2026-07-25 10:04:26');
/*!40000 ALTER TABLE `shipping_countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_ports`
--

DROP TABLE IF EXISTS `shipping_ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_ports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country_id` int NOT NULL,
  `port_name` varchar(120) NOT NULL,
  `active` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_port_country` (`country_id`),
  CONSTRAINT `fk_port_country` FOREIGN KEY (`country_id`) REFERENCES `shipping_countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_ports`
--

LOCK TABLES `shipping_ports` WRITE;
/*!40000 ALTER TABLE `shipping_ports` DISABLE KEYS */;
INSERT INTO `shipping_ports` VALUES (477,389,'Durrës',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(478,390,'Algiers',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(479,391,'Pago Pago',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(480,392,'Luanda',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(481,393,'Road Bay',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(482,394,'Ushuaia (nearby in Argentina)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(483,395,'St. John\'s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(484,396,'Buenos Aires',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(485,397,'Oranjestad',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(486,398,'Melbourne',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(487,398,'Sydney',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(488,398,'Brisbane',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(489,398,'Fremantle',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(490,398,'Adelaide',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(491,399,'Vienna (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(492,400,'Nassau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(493,401,'Khalifa Bin Salman',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(494,402,'Chittagong (Cox\'s Bazar also)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(495,403,'Bridgetown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(496,404,'Antwerp',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(497,405,'Belize City',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(498,406,'Cotonou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(499,407,'Hamilton Harbour',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(500,408,'Kralendijk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(501,409,'Neum',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(502,410,'Santos',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(503,410,'Rio de Janeiro',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(504,410,'Salvador',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(505,410,'Paranaguá',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(506,410,'Itajaí',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(507,411,'Charlotte Amalie',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(508,412,'St. Thomas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(509,413,'Muara',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(510,414,'Varna',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(511,415,'Ouagadougou (inland port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(512,416,'Sihanoukville',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(513,417,'Douala',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(514,418,'Vancouver',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(515,419,'Mindelo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(516,420,'George Town',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(517,421,'Valparaíso',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(518,422,'Shanghai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(519,422,'Shenzhen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(520,422,'Ningbo-Zhoushan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(521,422,'Hong Kong',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(522,422,'Guangzhou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(523,422,'Qingdao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(524,423,'Cartagena',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(525,423,'Barranquilla',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(526,424,'Moroni',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(527,425,'Pointe-Noire',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(528,426,'Kinshasa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(529,427,'Avatiu',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(530,428,'Limón',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(531,429,'Rijeka',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(532,430,'Havana',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(533,431,'Willemstad',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(534,432,'Limassol',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(535,433,'Prague (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(536,434,'Copenhagen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(537,434,'Aarhus',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(538,435,'Djibouti',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(539,436,'Roseau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(540,437,'Santo Domingo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(541,437,'Puerto Plata',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(542,438,'Guayaquil',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(543,438,'Esmeraldas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(544,439,'Alexandria',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(545,439,'Port Said',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(546,440,'Acajutla',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(547,441,'Malabo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(548,442,'Massawa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(549,443,'Tallinn',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(550,444,'Djibouti (primary port for Ethiopia)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(551,445,'Tórshavn',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(552,446,'Suva',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(553,447,'Helsinki',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(554,448,'Le Havre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(555,448,'Marseille',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(556,448,'Dunkirk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(557,449,'Cayenne',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(558,450,'Papeete',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(559,451,'Libreville',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(560,452,'Banjul',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(561,453,'Batumi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(562,454,'Hamburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(563,454,'Bremerhaven',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(564,454,'Wilhelmshaven',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(565,454,'Bremen',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(566,454,'Duisburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(567,455,'Tema',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(568,456,'Gibraltar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(569,457,'Piraeus',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(570,458,'St. George\'s',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(571,459,'Pointe-à-Pitre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(572,460,'Apra Harbor',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(573,461,'Puerto Quetzal',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(574,462,'Conakry',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(575,463,'Bissau',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(576,464,'Georgetown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(577,465,'Port-au-Prince',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(578,466,'Puerto Cortés',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(579,467,'Hong Kong',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(580,468,'Budapest (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(581,469,'Reykjavik',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(582,470,'Mumbai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(583,470,'Jawaharlal Nehru (Nhava Sheva)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(584,470,'Chennai',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(585,470,'Kolkata',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(586,470,'Visakhapatnam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(587,470,'Mundra',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(588,471,'Jakarta',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(589,472,'Abidjan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(590,473,'Bandar Abbas',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(591,474,'Umm Qasr',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(592,475,'Dublin',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(593,476,'Haifa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(594,476,'Ashdod',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(595,477,'Genoa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(596,477,'Venice',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(597,477,'Naples',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(598,478,'Kingston',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(599,479,'Yokohama',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(600,479,'Kobe',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(601,479,'Nagoya',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(602,479,'Tokyo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(603,479,'Osaka',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(604,480,'Aqaba',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(605,481,'Aktau (Caspian Sea)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(606,482,'Mombasa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(607,483,'Tarawa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(608,484,'Shuwaikh',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(609,485,'Riga',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(610,486,'Beirut',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(611,487,'Durban (South Africa - main port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(612,488,'Monrovia',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(613,489,'Tripoli',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(614,490,'Klaipėda',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(615,491,'Luxembourg (via the Moselle River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(616,492,'Macao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(617,493,'Toamasina',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(618,494,'Nacala (Mozambique)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(619,495,'Port Klang',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(620,496,'Malé',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(621,497,'Valletta',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(622,498,'Majuro',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(623,499,'Fort-de-France',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(624,500,'Port Louis',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(625,501,'Mamoudzou',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(626,502,'Veracruz',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(627,503,'Pohnpei',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(628,504,'Bar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(629,505,'Plymouth',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(630,506,'Casablanca',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(631,507,'Maputo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(632,508,'Yangon',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(633,509,'Walvis Bay',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(634,510,'Nauru',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(635,511,'Kolkata (India port)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(636,512,'Rotterdam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(637,513,'Nouméa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(638,514,'Auckland',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(639,514,'Wellington',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(640,515,'Corinto',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(641,516,'Lagos',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(642,517,'Alofi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(643,518,'Saipan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(644,519,'Oslo',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(645,520,'Sohar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(646,521,'Karachi',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(647,522,'Malakal',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(648,523,'Balboa',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(649,524,'Port Moresby',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(650,525,'Asunción (via Paraguay River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(651,526,'Callao',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(652,527,'Manila',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(653,528,'Gdańsk',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(654,529,'Lisbon',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(655,529,'Porto',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(656,530,'San Juan',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(657,531,'Doha',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(658,532,'Le Port',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(659,533,'Constanța',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(660,534,'St. Petersburg',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(661,535,'Basseterre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(662,536,'Castries',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(663,537,'Saint Pierre',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(664,538,'Kingstown',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(665,539,'Apia',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(666,540,'São Tomé',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(667,541,'Jeddah',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(668,541,'Dammam',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(669,542,'Dakar',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(670,543,'Belgrade (via Danube River)',1,'2026-07-25 10:04:25','2026-07-25 10:04:25'),(671,544,'Victoria',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(672,545,'Freetown',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(673,546,'Singapore (Primary)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(674,546,'Pasir Panjang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(675,547,'Philipsburg',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(676,548,'Bratislava (via Danube River)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(677,549,'Koper',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(678,550,'Honiara',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(679,551,'Mogadishu',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(680,552,'Durban',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(681,553,'Busan',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(682,553,'Incheon',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(683,553,'Gwangyang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(684,554,'Barcelona',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(685,555,'Colombo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(686,556,'Port Sudan',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(687,557,'Paramaribo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(688,558,'Gothenburg',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(689,559,'Basel',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(690,560,'Latakia',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(691,561,'Kaohsiung',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(692,562,'Dar es Salaam',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(693,563,'Laem Chabang',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(694,564,'Dili',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(695,565,'Lomé',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(696,566,'Nuku\'alofa',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(697,567,'Spain',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(698,568,'Tunis',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(699,569,'Istanbul',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(700,570,'Providenciales',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(701,571,'Funafuti',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(702,572,'Odessa',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(703,573,'Jebel Ali',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(704,574,'Felixstowe',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(705,574,'London',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(706,575,'Los Angeles',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(707,575,'New York and New Jersey',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(708,576,'Montevideo',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(709,577,'Port Vila',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(710,578,'La Guaira',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(711,579,'Ho Chi Minh City',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(712,580,'Mata-Utu',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(713,581,'Aden',1,'2026-07-25 10:04:26','2026-07-25 10:04:26'),(714,582,'Beira (Mozambique)',1,'2026-07-25 10:04:26','2026-07-25 10:04:26');
/*!40000 ALTER TABLE `shipping_ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_zones`
--

DROP TABLE IF EXISTS `shipping_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_zones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(100) NOT NULL,
  `minimum_order` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_group_mapping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_code` varchar(20) NOT NULL,
  `sub_group_name` varchar(150) NOT NULL,
  `storage_type` enum('Ambient','Frozen','Chilled') NOT NULL DEFAULT 'Ambient',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_code` (`group_code`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `sub_category_name` varchar(100) NOT NULL,
  `group_code` varchar(10) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_code` (`group_code`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_registration_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line_1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_comments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `categories_supplied` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `consent_news` tinyint(1) NOT NULL DEFAULT '0',
  `consent_marketing` tinyint(1) NOT NULL DEFAULT '0',
  `contact_time` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_index` varchar(50) DEFAULT NULL,
  `supplier_reference` varchar(100) DEFAULT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `supplier_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_index` (`supplier_index`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `company_name` varchar(200) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` varchar(30) DEFAULT 'customer',
  `status` varchar(30) DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@navsainternational.com','$2y$10$/mFIBBzBIY.2EE71CGo9xORBUXwHpwhFUi2xWNOxYxhLf3OmoHSJW',NULL,NULL,'admin','approved','2026-07-19 07:58:33','2026-07-19 07:00:51','2026-07-25 08:51:57'),(2,'Mamta Ashwar','ashwarmamta22@gmail.com','$2y$10$cr9SSqdlShEDoJQ9GHJigeVq8Nukop23l7eEoRbSaR..oobAuQ9PG','m','9999999998','supplier','approved','2026-07-24 15:07:03','2026-07-24 14:19:06','2026-08-01 13:25:39'),(5,'TEST TEST','navsa.test@example.com','$2y$10$HjRzyZAJ36V/jtzLFszW7.OPA1ZVxtfPttFGmiW1FnIi1sxieABli','TEST','+91 9999999999','customer','approved','2026-07-30 13:02:24','2026-07-30 12:58:30','2026-07-31 12:19:11'),(6,'m m','m@gmail.com','$2y$10$W05mpm35DgUT53S/XEhWiO4OZSZdAtP6TgMp3oxgWnVkmIwYxVzq.','TEST','+91 9999999999','customer','approved','2026-07-31 06:33:09','2026-07-31 06:28:59','2026-08-01 01:04:45'),(8,'Vishwa Ashwar','vishu24@gmail.com','$2y$10$1p8zoq.tyyx.pkZq4x2tL.TEyjiJyvRn6t9A6P8qDtc4GLRlqcf8q','TEST','+91 9999999999','customer','approved','2026-08-01 01:07:22','2026-08-01 01:06:52','2026-08-01 11:49:47'),(9,'TEST TEST','test9@gmail.com','$2y$10$X1/fOE8SwVdRjWBh81rTl.nd9VFWnnsDItxkRzVk5YNPTec6jK1Xq','TEST','+91 9999999999','customer','approved','2026-08-01 12:08:11','2026-08-01 11:37:45','2026-08-01 12:08:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vat_codes`
--

DROP TABLE IF EXISTS `vat_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vat_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(5) NOT NULL,
  `percentage` decimal(6,3) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `vat_treatment` varchar(50) DEFAULT NULL,
  `charge_for_uk` tinyint(1) DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vat_codes_code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vat_codes`
--

LOCK TABLES `vat_codes` WRITE;
/*!40000 ALTER TABLE `vat_codes` DISABLE KEYS */;
INSERT INTO `vat_codes` VALUES (1,'A',20.000,'Standard rated (UK VAT chargeable)','standard',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(2,'C',5.000,'5% (UK VAT chargeable)','reduced',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(3,'D',6.000,'6% (UK VAT chargeable)','special',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(4,'E',0.000,'Exempt (UK VAT chargeable)','exempt',0,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(5,'F',5.000,'Fuel (UK VAT chargeable)','reduced',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(6,'G',7.000,'7% (UK VAT chargeable)','special',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(7,'H',17.920,'16% (UK VAT chargeable)','special',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(8,'M',13.880,'Mixed Biscuits (UK VAT chargeable)','special',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(9,'N',0.000,'No VAT (UK VAT chargeable)','outside_scope',0,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(10,'O',0.000,'Outside scope of VAT (UK VAT chargeable)','outside_scope',0,1,'2026-07-22 05:50:03','2026-07-25 08:51:57'),(11,'Z',0.000,'Zero rated (UK VAT chargeable)','zero_rated',1,1,'2026-07-22 05:50:03','2026-07-25 08:51:57');
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

-- Dump completed on 2026-08-06  9:27:25
