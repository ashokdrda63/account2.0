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
-- Table structure for table `acc_budget_map_master`
--

DROP TABLE IF EXISTS `acc_budget_map_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acc_budget_map_master` (
  `seq_no` int NOT NULL AUTO_INCREMENT,
  `acc_id` varchar(45) DEFAULT NULL,
  `acc_name` varchar(45) DEFAULT NULL,
  `budget_id` varchar(45) DEFAULT NULL,
  `budget_name` varchar(45) DEFAULT NULL,
  `delete` varchar(45) DEFAULT NULL,
  `edit` varchar(45) DEFAULT NULL,
  `acc_budget_map_mastercol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`seq_no`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acc_budget_map_master`
--

LOCK TABLES `acc_budget_map_master` WRITE;
/*!40000 ALTER TABLE `acc_budget_map_master` DISABLE KEYS */;
INSERT INTO `acc_budget_map_master` VALUES (52,'GRA_1','GRANT - IN -AID','INC_1','INCOME',NULL,NULL,NULL),(53,'EXP_53','EXP- MLALAD','EXP_1','EXPENDITURE',NULL,NULL,NULL),(54,'CAS_53','CASH-IN-HAND (MPLALAD)','CAS_1','CASH-IN-HAND',NULL,NULL,NULL),(55,'MLA_53','MLALAD (11276457352','BAN_1','BANK',NULL,NULL,NULL),(56,'PL _56','PL A/C','BAN_1','BANK',NULL,NULL,NULL),(57,'','','','',NULL,NULL,NULL),(58,'PAI_56','PAID AMOUNT','LIA_1','LIABILITY',NULL,NULL,NULL),(59,'ELE_59','ELECTION  AMOOUNT','LIA_1','LIABILITY',NULL,NULL,NULL),(60,'SP _60','SP ACCOUNTS 45687','BAN_1','BANK',NULL,NULL,NULL),(61,'CAS_61','CASH-IN-HAND (SPL FUND)','CAS_1','CASH-IN-HAND',NULL,NULL,NULL),(62,'ASH_62','ASHOK KUMAR BEHERA','ADV_1','ADVANCE',NULL,NULL,NULL),(63,'INT_63','INTEREST','INC_1','INCOME',NULL,NULL,NULL),(64,'MLA_64','MLALAD A/C 1172548797','BAN_1','BANK',NULL,NULL,NULL);
/*!40000 ALTER TABLE `acc_budget_map_master` ENABLE KEYS */;
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
