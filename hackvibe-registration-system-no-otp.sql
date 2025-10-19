-- HackVibe 2025 Registration System (No OTP Version)
-- Comprehensive Database Schema with Security and Transparency Features
-- Run this SQL in your Hostinger phpMyAdmin or MySQL console

-- Create the registrations table with all fields for team registration
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leader_name` varchar(100) NOT NULL,
  `leader_email` varchar(100) NOT NULL,
  `leader_phone` varchar(15) NOT NULL,
  `leader_tshirt_size` enum('S','M','L','XL','XXL') NOT NULL DEFAULT 'M',
  `college_name` varchar(200) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  `member2_name` varchar(100) NOT NULL,
  `member2_email` varchar(100) NOT NULL,
  `member2_phone` varchar(15) NOT NULL,
  `member2_tshirt_size` enum('S','M','L','XL','XXL') NOT NULL DEFAULT 'M',
  `member3_name` varchar(100) NOT NULL,
  `member3_email` varchar(100) NOT NULL,
  `member3_phone` varchar(15) NOT NULL,
  `member3_tshirt_size` enum('S','M','L','XL','XXL') NOT NULL DEFAULT 'M',
  `utr_number` varchar(12) NOT NULL,
  `account_holder_name` varchar(100) NOT NULL,
  `project_idea` text,
  `payment_screenshot` varchar(255),
  `team_photo` varchar(255),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending','verified','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `leader_email` (`leader_email`),
  UNIQUE KEY `leader_phone` (`leader_phone`),
  UNIQUE KEY `team_name` (`team_name`),
  UNIQUE KEY `utr_number` (`utr_number`),
  UNIQUE KEY `member2_email` (`member2_email`),
  UNIQUE KEY `member2_phone` (`member2_phone`),
  UNIQUE KEY `member3_email` (`member3_email`),
  UNIQUE KEY `member3_phone` (`member3_phone`),
  KEY `created_at` (`created_at`),
  KEY `ip_address` (`ip_address`),
  KEY `college_name` (`college_name`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leader_email ON registrations(leader_email);
CREATE INDEX IF NOT EXISTS idx_leader_phone ON registrations(leader_phone);
CREATE INDEX IF NOT EXISTS idx_team_name ON registrations(team_name);
CREATE INDEX IF NOT EXISTS idx_utr_number ON registrations(utr_number);
CREATE INDEX IF NOT EXISTS idx_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_ip_address ON registrations(ip_address);
CREATE INDEX IF NOT EXISTS idx_college_name ON registrations(college_name);
CREATE INDEX IF NOT EXISTS idx_member2_email ON registrations(member2_email);
CREATE INDEX IF NOT EXISTS idx_member2_phone ON registrations(member2_phone);
CREATE INDEX IF NOT EXISTS idx_member3_email ON registrations(member3_email);
CREATE INDEX IF NOT EXISTS idx_member3_phone ON registrations(member3_phone);
CREATE INDEX IF NOT EXISTS idx_status ON registrations(status);

-- Create uploads directory tracking table
CREATE TABLE IF NOT EXISTS `uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `upload_type` enum('payment_screenshot', 'team_photo') NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  KEY `upload_type` (`upload_type`),
  FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit log table for transparency
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) NOT NULL,
  `operation_type` enum('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  `record_id` int(11) NOT NULL,
  `old_values` json,
  `new_values` json,
  `changed_by` varchar(100),
  `changed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45),
  `user_agent` varchar(500),
  PRIMARY KEY (`id`),
  KEY `table_name` (`table_name`),
  KEY `operation_type` (`operation_type`),
  KEY `changed_at` (`changed_at`),
  KEY `record_id` (`record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create security log table for monitoring
CREATE TABLE IF NOT EXISTS `security_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` enum('login_attempt', 'failed_login', 'suspicious_activity', 'data_access', 'file_upload') NOT NULL,
  `description` text,
  `ip_address` varchar(45),
  `user_agent` varchar(500),
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_type` (`event_type`),
  KEY `ip_address` (`ip_address`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a view for recent registrations (last 24 hours)
CREATE OR REPLACE VIEW recent_registrations AS
SELECT 
    id,
    leader_name,
    leader_email,
    leader_phone,
    leader_tshirt_size,
    college_name,
    team_name,
    member2_name,
    member2_email,
    member2_phone,
    member2_tshirt_size,
    member3_name,
    member3_email,
    member3_phone,
    member3_tshirt_size,
    utr_number,
    account_holder_name,
    project_idea,
    payment_screenshot,
    team_photo,
    status,
    created_at
FROM registrations 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY created_at DESC;

-- Create a view for registration statistics
CREATE OR REPLACE VIEW registration_stats AS
SELECT 
    COUNT(*) as total_registrations,
    COUNT(DISTINCT college_name) as unique_colleges,
    COUNT(DISTINCT team_name) as unique_teams,
    COUNT(*) * 3 as total_participants,
    SUM(CASE WHEN payment_screenshot IS NOT NULL THEN 1 ELSE 0 END) as paid_registrations,
    SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_registrations,
    DATE(created_at) as registration_date
FROM registrations 
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- Create a view for team details with all members
CREATE OR REPLACE VIEW team_details AS
SELECT 
    r.id,
    r.team_name,
    r.college_name,
    r.utr_number,
    r.leader_name as leader_name,
    r.leader_email as leader_email,
    r.leader_phone as leader_phone,
    r.leader_tshirt_size as leader_tshirt_size,
    r.member2_name as member2_name,
    r.member2_email as member2_email,
    r.member2_phone as member2_phone,
    r.member2_tshirt_size as member2_tshirt_size,
    r.member3_name as member3_name,
    r.member3_email as member3_email,
    r.member3_phone as member3_phone,
    r.member3_tshirt_size as member3_tshirt_size,
    r.project_idea,
    r.payment_screenshot,
    r.team_photo,
    r.status,
    r.created_at as registration_date
FROM registrations r
ORDER BY r.created_at DESC;

-- Create a stored procedure to get team summary
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GetTeamSummary()
BEGIN
    SELECT 
        'Total Teams' as metric, 
        COUNT(*) as value 
    FROM registrations
    UNION ALL
    SELECT 
        'Total Participants' as metric, 
        COUNT(*) * 3 as value 
    FROM registrations
    UNION ALL
    SELECT 
        'Colleges Represented' as metric, 
        COUNT(DISTINCT college_name) as value 
    FROM registrations
    UNION ALL
    SELECT 
        'Pending Verifications' as metric, 
        COUNT(*) as value 
    FROM registrations 
    WHERE status = 'pending';
END //
DELIMITER ;

-- Insert sample data for testing (optional)
INSERT INTO registrations (
    leader_name, leader_email, leader_phone, leader_tshirt_size,
    college_name, team_name,
    member2_name, member2_email, member2_phone, member2_tshirt_size,
    member3_name, member3_email, member3_phone, member3_tshirt_size,
    utr_number, account_holder_name, status
) VALUES (
    'John Doe', 'john@example.com', '9876543210', 'L',
    'Sample University', 'Team Alpha',
    'Jane Smith', 'jane@example.com', '9876543211', 'M',
    'Bob Johnson', 'bob@example.com', '9876543212', 'XL',
    'UTR1234567890', 'John Doe', 'pending'
) ON DUPLICATE KEY UPDATE id=id;

-- Create triggers for audit logging
DELIMITER //
CREATE TRIGGER IF NOT EXISTS audit_registrations_insert
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation_type, record_id, new_values, ip_address)
    VALUES ('registrations', 'INSERT', NEW.id, JSON_OBJECT(
        'leader_name', NEW.leader_name,
        'leader_email', NEW.leader_email,
        'team_name', NEW.team_name,
        'college_name', NEW.college_name
    ), NEW.ip_address);
END //

CREATE TRIGGER IF NOT EXISTS audit_registrations_update
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, operation_type, record_id, old_values, new_values, ip_address)
    VALUES ('registrations', 'UPDATE', NEW.id, JSON_OBJECT(
        'leader_name', OLD.leader_name,
        'leader_email', OLD.leader_email,
        'team_name', OLD.team_name,
        'college_name', OLD.college_name
    ), JSON_OBJECT(
        'leader_name', NEW.leader_name,
        'leader_email', NEW.leader_email,
        'team_name', NEW.team_name,
        'college_name', NEW.college_name
    ), NEW.ip_address);
END //
DELIMITER ;

-- Show table structure
DESCRIBE registrations;
DESCRIBE uploads;
DESCRIBE audit_log;
DESCRIBE security_log;

-- Show created views
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Show created procedures
SHOW PROCEDURE STATUS WHERE Db = DATABASE();
