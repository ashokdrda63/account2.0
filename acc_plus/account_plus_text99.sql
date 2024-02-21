-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: account_plus
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `text99`
--

DROP TABLE IF EXISTS `text99`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `text99` (
  `idtext99` int NOT NULL,
  `text99col` varchar(45) NOT NULL,
  `text99col1` varchar(45) NOT NULL,
  `text99col2` varchar(45) NOT NULL,
  `text99col3` varchar(45) NOT NULL,
  `text99col4` varchar(45) NOT NULL,
  `text99col5` varchar(45) NOT NULL,
  `text99col6` varchar(45) NOT NULL,
  `text99col7` varchar(45) NOT NULL,
  `text99col8` varchar(45) NOT NULL,
  `text99col9` varchar(45) NOT NULL,
  `text99col10` varchar(45) NOT NULL,
  `text99col11` varchar(45) NOT NULL,
  `text99col12` varchar(45) NOT NULL,
  `text99col13` varchar(45) NOT NULL,
  `text99col14` varchar(45) NOT NULL,
  PRIMARY KEY (`idtext99`,`text99col`,`text99col1`,`text99col2`,`text99col3`,`text99col4`,`text99col5`,`text99col6`,`text99col7`,`text99col8`,`text99col9`,`text99col10`,`text99col11`,`text99col12`,`text99col13`,`text99col14`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `text99`
--

LOCK TABLES `text99` WRITE;
/*!40000 ALTER TABLE `text99` DISABLE KEYS */;
/*!40000 ALTER TABLE `text99` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-21 12:21:03
