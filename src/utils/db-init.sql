-- Script de inicialización de base de datos
-- Ejecutar este script para crear las tablas necesarias

CREATE DATABASE IF NOT EXISTS beneficios_scraper;
USE beneficios_scraper;

-- Tabla de ejemplo para datos scrapeados
CREATE TABLE IF NOT EXISTS scraped_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scraper_name VARCHAR(100) NOT NULL,
  scraper_type ENUM('api', 'html', 'browser') NOT NULL,
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scraper_name (scraper_name),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ejemplo para talentos de LinkedIn
CREATE TABLE IF NOT EXISTS linkedin_talents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  company VARCHAR(255),
  position VARCHAR(255),
  raw_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email (email),
  INDEX idx_company (company),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de logs de ejecución de scrapers
CREATE TABLE IF NOT EXISTS scraper_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scraper_name VARCHAR(100) NOT NULL,
  scraper_type ENUM('api', 'html', 'browser') NOT NULL,
  status ENUM('success', 'error') NOT NULL,
  records_count INT DEFAULT 0,
  error_message TEXT,
  execution_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scraper_name (scraper_name),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
