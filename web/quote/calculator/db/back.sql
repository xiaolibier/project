-- MySQL dump 10.16  Distrib 10.1.21-MariaDB, for Win32 (AMD64)
--
-- Host: 118.190.132.68    Database: 118.190.132.68
-- ------------------------------------------------------
-- Server version	5.5.13-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `budget_summary`
--

DROP TABLE IF EXISTS `budget_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budget_summary` (
  `id` int(12) NOT NULL AUTO_INCREMENT COMMENT '项目id',
  `serial_number` varchar(64) NOT NULL COMMENT '项目编号',
  `version_num` int(12) DEFAULT '0',
  `version` varchar(64) NOT NULL COMMENT '版本',
  `pversion` varchar(64) DEFAULT '0' COMMENT '父版本',
  `type` varchar(32) DEFAULT NULL,
  `name` varchar(800) DEFAULT '' COMMENT '项目名称',
  `center_number` varchar(32) DEFAULT '0' COMMENT '中心数',
  `budget_price` varchar(32) DEFAULT NULL COMMENT '预算费用',
  `sponsor` varchar(64) DEFAULT ' ' COMMENT '申办方',
  `sponsor_code` varchar(32) DEFAULT ' ',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '项目创建时间',
  `remarks` varchar(512) DEFAULT NULL COMMENT '备注',
  `json1` text COMMENT '预算汇总信息',
  `json2` text COMMENT '预算详细信息',
  `json3` text COMMENT '预算差旅信息',
  `json4` text COMMENT '差旅中心信息',
  `json5` text COMMENT '详细情况',
  `state` varchar(32) DEFAULT '暂存' COMMENT '1.暂存、2.审核中，3.审核通过4.审核驳回，\n审核通过可以打印和输',
  `user` varchar(64) DEFAULT '0' COMMENT '创建项目的用户名',
  `user_phone` varchar(64) DEFAULT '000',
  `is_delete` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8 COMMENT='预算汇总';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_summary`
--


--
-- Table structure for table `price`
--

DROP TABLE IF EXISTS `price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `price` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `plane_price` float NOT NULL DEFAULT '0',
  `train_price` float NOT NULL DEFAULT '0',
  `default_transportation` varchar(10) NOT NULL DEFAULT '火车',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `sponsor`
--

DROP TABLE IF EXISTS `sponsor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsor` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL COMMENT '申办方名称',
  `code` varchar(32) DEFAULT NULL COMMENT '申办方编码',
  `address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `sponsor_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsor_old` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL COMMENT '申办方名称',
  `code` varchar(32) DEFAULT NULL COMMENT '申办方编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsor_old`
--


--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(64) NOT NULL COMMENT '用户名称',
  `password` varchar(256) NOT NULL DEFAULT '96e79218965eb72c92a549dd5a330112' COMMENT '密码',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `contact` varchar(64) DEFAULT NULL COMMENT '联系方式',
  `role` varchar(32) NOT NULL DEFAULT 'user' COMMENT '1.只通知给notifier;\n2.预算通过之后，回复预算编辑者\n3.admin有最高权限，能够看到所有信息',
  `account` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COMMENT='用户表';




DROP TABLE IF EXISTS `open_budget_calculator`;
CREATE TABLE `open_budget_calculator` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` varchar(64) DEFAULT NULL COMMENT '预算类型',
  `name` varchar(256) DEFAULT NULL  COMMENT '项目简称',
  `audit_num` varchar(64) DEFAULT NULL COMMENT '稽查次数',
  `patient_num` varchar(64) DEFAULT NULL COMMENT '稽查病例数',
  `center_num` varchar(64) DEFAULT NULL COMMENT '稽查中心数',
  `audit_time` varchar(64) DEFAULT NULL COMMENT '稽查服务时间',
  `travell_cost` varchar(64) DEFAULT NULL COMMENT '差旅费',
  `tech_serve_cost` varchar(64) DEFAULT NULL COMMENT '技术服务费',
  `tax` varchar(64) DEFAULT NULL COMMENT '税费',
  `total_cost` varchar(64) DEFAULT NULL COMMENT '总费用',
  `user_id` int(16) DEFAULT NULL COMMENT '用户id',
  `ip` varchar(64) DEFAULT NULL COMMENT 'ip地址',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';
