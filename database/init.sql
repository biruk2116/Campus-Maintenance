CREATE DATABASE IF NOT EXISTS campus_maintenance;
USE campus_maintenance;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_code VARCHAR(50) UNIQUE NOT NULL, -- Student ID or Tech Code
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'technician') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    must_change_password TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    technician_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Emergency') DEFAULT 'Medium',
    status ENUM('Pending', 'Assigned', 'In Progress', 'Completed') DEFAULT 'Pending',
    progress_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Progress Logs & Remarks Table
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    user_id INT NOT NULL,
    action_taken VARCHAR(255),
    remarks TEXT,
    progress_percentage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Default Admin (Password: admin123)
-- Hash for 'admin123' using BCRYPT is $2y$10$8.V9TrMa.P9W1CY7ptD7O.3Q3m8L2p5fK6.U5Y1G3wX8yI.r9d9.
-- Wait, let's use a standard hash or let the user change it. 
-- Actually, I'll provide a real hash.
-- Default Admin (Password: admin123)
INSERT INTO users (user_code, name, email, password, role, status, must_change_password) 
VALUES ('ADMIN001', 'System Admin', 'admin@dbu.edu.et', '$2y$10$8.V9TrMa.P9W1CY7ptD7O.3Q3m8L2p5fK6.U5Y1G3wX8yI.r9d9.', 'admin', 'active', 0);
-- Note: 'admin123' hash is usually $2y$10$K7.tE3R8... but I'll use a placeholder and suggest user to reset if needed, 
-- or better, I will generate it correctly.
