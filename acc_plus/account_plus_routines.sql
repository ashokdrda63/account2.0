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
-- Dumping routines for database 'account_plus'
--
/*!50003 DROP PROCEDURE IF EXISTS `loadMasterTbl` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `loadMasterTbl`(IN check_date DATE)
BEGIN
	DECLARE finished_curRecords INTEGER DEFAULT 0;
	DECLARE finished_curRecordsOb INTEGER DEFAULT 0;
	
	DECLARE data_scheme_name varchar(100) DEFAULT "";
	DECLARE data_vch_type varchar(100) DEFAULT "";
	DECLARE data_vch_ty varchar(100) DEFAULT "";
	DECLARE data_amount_rec DECIMAL(15,3) DEFAULT 0;
	DECLARE data_amount_pay DECIMAL(15,3) DEFAULT 0;
	DECLARE data_acc_id varchar(100) DEFAULT "";
	DECLARE data_vch_date varchar(100) DEFAULT "";
	
	DECLARE master_data_CR DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_CP DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_BR DECIMAL(15,3) DEFAULT 0;
	
	DECLARE master_data_bank_exp DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_bank_rec DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_bank_adv DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_cash_rec DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_cash_exp DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_cash_adv DECIMAL(15,3) DEFAULT 0;
	DECLARE obdata_budget_name varchar(100) DEFAULT "";
	DECLARE obdata_scheme_name varchar(100) DEFAULT "";
	DECLARE obdata_amt_rec DECIMAL(15,3) DEFAULT 0;
	DECLARE obdata_amt_pay DECIMAL(15,3) DEFAULT 0;
	
	DECLARE master_data_AR DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_AP DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_PR DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_PP DECIMAL(15,3) DEFAULT 0;
	DECLARE master_data_trxn_date DATE;
	DECLARE master_data_trxn_name varchar(255) DEFAULT "";
	DECLARE master_data_insert_flag INTEGER DEFAULT 0;
	
	DECLARE master_ob_cash DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_bank DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_adv DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_pl DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_tot DECIMAL(15,3) DEFAULT 0;
	
	DECLARE master_cb_cash DECIMAL(15,3) DEFAULT 0;
	DECLARE master_cb_bank DECIMAL(15,3) DEFAULT 0;
	DECLARE master_cb_pl DECIMAL(15,3) DEFAULT 0;
	DECLARE master_cb_adv DECIMAL(15,3) DEFAULT 0;
	DECLARE master_tot_cb DECIMAL(15,3) DEFAULT 0;

	DECLARE master_ob_cash_next DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_bank_next DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_pl_next DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_adv_next DECIMAL(15,3) DEFAULT 0;
	DECLARE master_ob_tot_next DECIMAL(15,3) DEFAULT 0;


	begin
		-- declare cursor for fetching total received and total paid record from obmaster_master_view
		DECLARE cursorRecordForOb CURSOR FOR SELECT scheme_name, budget_name, amt_rec, amt_pay FROM obmaster_master_view;

		-- declare NOT FOUND handler
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished_curRecordsOb = 1;
	
		OPEN cursorRecordForOb;
		getTotalObSum: LOOP
			FETCH  cursorRecordForOb INTO obdata_scheme_name, obdata_budget_name, obdata_amt_rec, obdata_amt_pay;
			IF finished_curRecordsOb = 1 THEN 
				LEAVE getTotalObSum;
			END IF;
			SET master_ob_tot = master_ob_tot + obdata_amt_rec;
			IF SUBSTR(obdata_budget_name, 1, 3) = "CAS" THEN
				SET master_ob_cash = master_ob_cash + obdata_amt_rec;
			ELSEIF SUBSTR(obdata_budget_name, 1, 3) = "BAN" THEN
				SET master_ob_bank = master_ob_bank + obdata_amt_rec;
			ELSEIF SUBSTR(obdata_budget_name, 1, 3) = "ADV" THEN
				SET master_ob_adv = master_ob_adv + obdata_amt_rec;
			ELSEIF SUBSTR(obdata_budget_name, 1, 3) = "PL" THEN
				SET master_ob_pl = master_ob_pl + obdata_amt_rec;
			END IF;
		END LOOP getTotalObSum;	
		/*INSERT INTO master_date (ob_cash, ob_bank, ob_adv, ob_pl,ob_tot, scheme_name, cash_rev, cash_exp, bank_rev, bank_exp, pl_rev, pl_exp, adv_rev, adv_exp, entry_date) 
		values (master_ob_cash, master_ob_bank, master_ob_adv, master_ob_pl, master_ob_tot, data_scheme_name, master_data_CR, master_data_CP, master_data_BR, 
		master_data_BP, master_data_PR, master_data_PP, master_data_AR, master_data_AP, check_date);
		INSERT INTO master_date (ob_cash, ob_bank, ob_adv, ob_pl,ob_tot, scheme_name) values 
		(master_ob_cash, master_ob_bank, master_ob_adv, master_ob_pl, master_ob_tot, 'SCHEME1');*/
		CLOSE cursorRecordForOb;
	end;

	begin
	-- declare cursor for fetching records for a particular date from outward_vchentry_view
	DECLARE curRecordsForDate CURSOR FOR SELECT scheme_name, vch_ty, vch_type, amount_rec, amount_pay, acc_id, vch_date 
	FROM inword_vchentry_view WHERE vch_date = check_date;

	-- declare NOT FOUND handler
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished_curRecords = 1;
	

	OPEN curRecordsForDate;
	getCurRecordsForDate: LOOP
		FETCH curRecordsForDate INTO data_scheme_name, data_vch_ty, data_vch_type, data_amount_rec, data_amount_pay, data_acc_id,  data_vch_date;
		IF finished_curRecords = 1 THEN 
			LEAVE getCurRecordsForDate;
		END IF;
		-- Build getCurRecordsForDate list.
		-- Add various schemes in IF and ELSEIF loops.
		IF (data_vch_type = "BP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "EXP") THEN 
			SET master_data_bank_exp = master_data_bank_exp + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "BR" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "BAN") THEN 
			SET master_data_bank_rec = master_data_bank_rec + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "BP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "ADV") THEN 
			SET master_data_bank_adv = master_data_bank_adv + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "BP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "LIB") THEN 
			SET master_data_bank_adv = master_data_bank_adv + data_amount_rec;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "CR" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "CAS") THEN 
			SET master_data_cash_rec = master_data_cash_rec + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "CP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "EXP") THEN 
			SET master_data_cash_exp = master_data_cash_exp + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "CP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "ADV") THEN 
			SET master_data_cash_adv = master_data_cash_adv + data_amount_pay;
			SET master_data_insert_flag = 1;
		ELSEIF (data_vch_type = "CP" AND data_vch_ty = "TO" AND SUBSTR(data_acc_id, 1, 3) = "LIB") THEN 
			SET master_data_cash_adv = master_data_cash_adv + data_amount_rec;
			SET master_data_insert_flag = 1;
		
		END IF;
		SET master_data_trxn_date = data_vch_date;
		SET master_data_trxn_name = CONCAT("Trxns on Date: ", check_date);
	END LOOP getCurRecordsForDate;
	IF master_data_insert_flag = 1 THEN
		IF (NOT EXISTS (SELECT master_date_id from master_date)) THEN
			SET master_cb_cash = ((master_ob_cash+master_data_cash_rec)-master_data_cash_exp);
			SET master_cb_bank = ((master_ob_bank+master_data_bank_rec)-master_data_bank_exp);
			/*SET master_cb_pl = ((master_ob_pl+master_data_PR)-master_data_PP); add this to master_tot_cb*/
			SET master_cb_adv = ((master_ob_adv+master_data_bank_adv)+master_data_cash_adv);
			SET master_tot_cb = (master_cb_cash+master_cb_bank+master_cb_adv);
			
			INSERT INTO master_date (ob_cash, ob_bank, ob_adv, ob_tot, cash_rec, cash_exp, cash_adv, bank_rec, bank_exp, bank_adv, cb_cash, cb_bank, cb_adv, tot_cb, entry_date) values (master_ob_cash, master_ob_bank, master_ob_adv, master_ob_tot, master_data_cash_rec, master_data_cash_exp, master_data_cash_adv, master_data_bank_rec, master_data_bank_exp, master_data_bank_adv, master_cb_cash, master_cb_bank, master_cb_adv, master_tot_cb, check_date);
		ELSE
			SELECT cb_cash, cb_bank, cb_adv, tot_cb INTO master_ob_cash_next, master_ob_bank_next, master_ob_adv_next, master_ob_tot_next FROM master_date WHERE entry_date=(SELECT entry_date FROM master_date order by entry_date DESC LIMIT 1);
		
			SET master_cb_cash = ((master_ob_cash_next+master_data_cash_rec)-master_data_cash_exp);
			SET master_cb_bank = ((master_ob_bank_next+master_data_bank_rec)-master_data_bank_exp);
			/*SET master_cb_pl = ((master_ob_pl_next+master_data_PR)-master_data_PP); add this to master_tot_cb*/
			SET master_cb_adv = ((master_ob_adv_next+master_data_bank_adv)+master_data_cash_adv);
			SET master_tot_cb = (master_cb_cash+master_cb_bank+master_cb_adv);
			
			INSERT INTO master_date (ob_cash, ob_bank, ob_adv, ob_tot, cash_rec, cash_exp, cash_adv, bank_rec, bank_exp, bank_adv, cb_cash, cb_bank, cb_adv, tot_cb, entry_date) values (master_ob_cash_next, master_ob_bank_next, master_ob_adv_next, master_ob_tot_next, master_data_cash_rec, master_data_cash_exp, master_data_cash_adv, master_data_bank_rec, master_data_bank_exp, master_data_bank_adv, master_cb_cash, master_cb_bank, master_cb_adv, master_tot_cb, check_date);
		END IF;
	END IF;
	CLOSE curRecordsForDate;
	end;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `loadMasterTbl_dated` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `loadMasterTbl_dated`(IN start_date DATE, IN end_date DATE, IN scheme_name_input varchar(255))
BEGIN
	DECLARE looping_date DATE;
	DECLARE start_date_inword DATE;
	DECLARE end_date_inword DATE;

	CALL reset_loadMasterTbl(scheme_name_input);
	SELECT DISTINCT vch_date INTO start_date_inword FROM inword_vchentry_view ivv  order by ivv.vch_date ASC LIMIT 1;
	SELECT DISTINCT vch_date INTO end_date_inword FROM inword_vchentry_view ivv  order by ivv.vch_date DESC LIMIT 1;
	SET looping_date = start_date_inword;
	WHILE looping_date <= end_date_inword DO
	CALL loadMasterTbl(looping_date);	
	/*// @a gives you the result of innerproc*/
	SET looping_date = DATE_ADD(looping_date, INTERVAL 1 DAY);
	END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reset_loadMasterTbl` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `reset_loadMasterTbl`(IN scheme_name_input varchar(255))
BEGIN	
	TRUNCATE TABLE master_date;
	TRUNCATE TABLE inword_vchentry_view;
	TRUNCATE TABLE obmaster_master_view;
	
	SET @scheme_name_input := scheme_name_input;
	
	SET @inword_vchentry_view = CONCAT("INSERT INTO inword_vchentry_view(scheme_name, vchno, vch_ty, vch_type, acc_id, account_desc, amount_rec, amount_pay, vch_date) SELECT scheme_name, vchno, vch_ty, vch_type, acc_id, account_desc, amount_rec, amount_pay, vch_date from  inword_vchentry where scheme_name = ? ORDER by vch_date");

	SET @obmaster_master_view = CONCAT("INSERT INTO obmaster_master_view(scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name, 		amt_rec, amt_pay) SELECT scheme_id, scheme_name, budget_id, budget_name, acc_id, acc_name, amt_rec, amt_pay from  obmaster_master where scheme_name = ?");
	
	PREPARE stmt3 FROM @inword_vchentry_view;
	EXECUTE stmt3 USING @scheme_name_input; -- <-- input for placeholder
	DEALLOCATE PREPARE stmt3;

	PREPARE stmt3 FROM @obmaster_master_view;
	EXECUTE stmt3 USING @scheme_name_input; -- <-- input for placeholder
	DEALLOCATE PREPARE stmt3;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-21 12:21:06
