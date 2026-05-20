CREATE DATABASE IF NOT EXISTS campus_maintenance_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE campus_maintenance_system;

-- Departments: academic and administrative units that own users.
CREATE TABLE IF NOT EXISTS departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    office_location VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Users: all login accounts and people who interact with maintenance.
-- Compatibility fields such as user_code, skills, and must_change_password
-- are kept for the existing PHP/React application.
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Technician', 'Staff', 'Student') NOT NULL,
    department_id INT,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    skills VARCHAR(120) DEFAULT NULL,
    must_change_password TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Buildings: campus structures where assets and issues are located.
CREATE TABLE IF NOT EXISTS buildings (
    building_id INT AUTO_INCREMENT PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    building_code VARCHAR(30) NOT NULL UNIQUE,
    number_of_floors INT NOT NULL
) ENGINE=InnoDB;

-- Locations: normalized rooms and spaces inside buildings.
CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    room_number VARCHAR(30) NOT NULL,
    floor_number INT NOT NULL,
    location_type ENUM('Classroom', 'Laboratory', 'Office', 'Dormitory', 'Toilet', 'Hall') NOT NULL,
    CONSTRAINT fk_locations_building
        FOREIGN KEY (building_id)
        REFERENCES buildings(building_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT uq_locations_building_room UNIQUE (building_id, room_number)
) ENGINE=InnoDB;

-- Assets: maintainable equipment assigned to a normalized location.
CREATE TABLE IF NOT EXISTS assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(120) NOT NULL,
    asset_category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    purchase_date DATE,
    warranty_expiry DATE,
    condition_status ENUM('Working', 'Damaged', 'Under Maintenance', 'Out of Service') NOT NULL DEFAULT 'Working',
    location_id INT,
    manufacturer VARCHAR(100),
    CONSTRAINT fk_assets_location
        FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Technicians: technician-specific profile linked one-to-one to users.
CREATE TABLE IF NOT EXISTS technicians (
    technician_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialization ENUM('Electrical', 'Plumbing', 'Network', 'Hardware', 'Civil') NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    availability_status ENUM('Available', 'Busy', 'Offline') NOT NULL DEFAULT 'Available',
    CONSTRAINT fk_technicians_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Maintenance requests: normalized request records for reporting and asset tracking.
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    reported_by INT NOT NULL,
    asset_id INT,
    location_id INT,
    issue_title VARCHAR(150) NOT NULL,
    issue_description TEXT NOT NULL,
    priority_level ENUM('Low', 'Medium', 'High', 'Emergency') NOT NULL DEFAULT 'Medium',
    request_status ENUM('Pending', 'Approved', 'In Progress', 'Completed', 'Rejected') NOT NULL DEFAULT 'Pending',
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_to INT,
    completion_date DATETIME,
    CONSTRAINT fk_maintenance_requests_reporter
        FOREIGN KEY (reported_by)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_requests_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(asset_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_requests_location
        FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_maintenance_requests_technician
        FOREIGN KEY (assigned_to)
        REFERENCES technicians(technician_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Requests: live workflow table used by the existing application UI.
-- It links to maintenance_requests so current screens and normalized reports stay in sync.
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maintenance_request_id INT UNIQUE DEFAULT NULL,
    student_id INT DEFAULT NULL,
    technician_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    dorm VARCHAR(120) DEFAULT NULL,
    block VARCHAR(120) DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Emergency') DEFAULT 'Medium',
    status ENUM('Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed') DEFAULT 'Pending',
    progress_percentage INT DEFAULT 0,
    admin_seen TINYINT(1) DEFAULT 0,
    tech_seen TINYINT(1) DEFAULT 1,
    student_seen TINYINT(1) DEFAULT 1,
    student_hidden TINYINT(1) DEFAULT 0,
    student_name_snapshot VARCHAR(100) DEFAULT NULL,
    student_code_snapshot VARCHAR(50) DEFAULT NULL,
    student_phone_snapshot VARCHAR(30) DEFAULT NULL,
    student_email_snapshot VARCHAR(100) DEFAULT NULL,
    technician_name_snapshot VARCHAR(100) DEFAULT NULL,
    technician_code_snapshot VARCHAR(50) DEFAULT NULL,
    technician_phone_snapshot VARCHAR(30) DEFAULT NULL,
    technician_email_snapshot VARCHAR(100) DEFAULT NULL,
    technician_skills_snapshot VARCHAR(120) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_maintenance_request
        FOREIGN KEY (maintenance_request_id)
        REFERENCES maintenance_requests(request_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_requests_student
        FOREIGN KEY (student_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_requests_technician_user
        FOREIGN KEY (technician_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Work orders: technician work performed against a normalized maintenance request.
CREATE TABLE IF NOT EXISTS work_orders (
    work_order_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    technician_id INT NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    work_description TEXT,
    labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    work_status ENUM('Pending', 'Ongoing', 'Completed') NOT NULL DEFAULT 'Pending',
    CONSTRAINT fk_work_orders_request
        FOREIGN KEY (request_id)
        REFERENCES maintenance_requests(request_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_work_orders_technician
        FOREIGN KEY (technician_id)
        REFERENCES technicians(technician_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Inventory: spare parts and consumables.
CREATE TABLE IF NOT EXISTS inventory (
    part_id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(120) NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    supplier VARCHAR(120),
    reorder_level INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Maintenance parts usage: parts consumed by work orders.
CREATE TABLE IF NOT EXISTS maintenance_parts_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    work_order_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity_used INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_parts_usage_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(work_order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_parts_usage_part
        FOREIGN KEY (part_id)
        REFERENCES inventory(part_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Maintenance history: completed historical maintenance events by asset.
CREATE TABLE IF NOT EXISTS maintenance_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    work_order_id INT NOT NULL,
    maintenance_type ENUM('Preventive', 'Corrective', 'Emergency') NOT NULL,
    maintenance_date DATE NOT NULL,
    notes TEXT,
    CONSTRAINT fk_history_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(asset_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_history_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(work_order_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Maintenance logs: live request timeline used by the current app.
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    actor_name VARCHAR(100) DEFAULT NULL,
    actor_role VARCHAR(30) DEFAULT NULL,
    actor_code VARCHAR(50) DEFAULT NULL,
    action_taken VARCHAR(255),
    remarks TEXT,
    progress_percentage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Notifications: user-facing notices.
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    notification_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Preventive schedules: future planned service dates per asset.
CREATE TABLE IF NOT EXISTS preventive_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    next_service_date DATE NOT NULL,
    maintenance_interval_days INT NOT NULL,
    last_service_date DATE,
    schedule_status ENUM('Scheduled', 'Completed', 'Overdue') NOT NULL DEFAULT 'Scheduled',
    CONSTRAINT fk_schedules_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(asset_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Request attachments: files uploaded against a live app request.
CREATE TABLE IF NOT EXISTS request_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    uploaded_by_user_id INT DEFAULT NULL,
    uploader_name_snapshot VARCHAR(100) DEFAULT NULL,
    uploader_role_snapshot VARCHAR(30) DEFAULT NULL,
    uploader_code_snapshot VARCHAR(50) DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(30) DEFAULT NULL,
    mime_type VARCHAR(120) DEFAULT NULL,
    file_category VARCHAR(60) DEFAULT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    file_description TEXT DEFAULT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_attachments_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_request_attachments_user
        FOREIGN KEY (uploaded_by_user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- User files: binary files owned by a user.
CREATE TABLE IF NOT EXISTS user_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    owner_name_snapshot VARCHAR(100) DEFAULT NULL,
    owner_role_snapshot VARCHAR(30) DEFAULT NULL,
    owner_code_snapshot VARCHAR(50) DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(30) DEFAULT NULL,
    mime_type VARCHAR(120) DEFAULT NULL,
    file_category VARCHAR(60) DEFAULT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    file_description TEXT DEFAULT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_files_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Indexes for common search and reporting fields.
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(asset_category);
CREATE INDEX IF NOT EXISTS idx_assets_condition ON assets(condition_status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON maintenance_requests(request_status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_priority ON maintenance_requests(priority_level);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_date ON maintenance_requests(request_date);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON requests(priority);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(work_status);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity_available);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_schedules_next_service ON preventive_schedules(next_service_date);

INSERT IGNORE INTO departments (department_id, department_name, office_location) VALUES
(1, 'Information Technology', 'Admin Block Room 101'),
(2, 'Engineering', 'Engineering Block Room 205'),
(3, 'Library Services', 'Main Library Office'),
(4, 'Student Affairs', 'Student Center Room 12'),
(5, 'Facilities Management', 'Maintenance Yard Office');

INSERT IGNORE INTO users (
    user_id, user_code, full_name, email, phone, password_hash, role,
    department_id, status, skills, must_change_password
) VALUES
(1, 'ADMIN001', 'System Admin', 'admin@dbu.edu.et', '0911000000', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Admin', 1, 'Active', NULL, 0),
(2, 'DBU2024001', 'Test Student', 'student@dbu.edu.et', '0922000000', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Student', 4, 'Active', NULL, 0),
(3, 'DBU2024002', 'Test Technician', 'technician@dbu.edu.et', '0933000000', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Technician', 5, 'Active', 'Plumbing, Electrical, HVAC', 0),
(4, 'DBU2024003', 'Diana Wanjiku', 'diana.wanjiku@campus.edu', '0745678901', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Staff', 3, 'Active', NULL, 0),
(5, 'DBU2024004', 'Brian Otieno', 'brian.otieno@campus.edu', '0723456789', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Technician', 5, 'Active', 'Network, Hardware', 0),
(6, 'DBU2024005', 'Charles Kibet', 'charles.kibet@campus.edu', '0734567890', '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e', 'Technician', 5, 'Active', 'Electrical', 0);

INSERT IGNORE INTO buildings (building_id, building_name, building_code, number_of_floors) VALUES
(1, 'Science Complex', 'SCI', 4),
(2, 'Administration Block', 'ADM', 3),
(3, 'Main Library', 'LIB', 5),
(4, 'Student Hostel A', 'HSTA', 6),
(5, 'Engineering Workshop', 'ENGW', 2);

INSERT IGNORE INTO locations (location_id, building_id, room_number, floor_number, location_type) VALUES
(1, 1, 'LAB-101', 1, 'Laboratory'),
(2, 1, 'CLS-204', 2, 'Classroom'),
(3, 2, 'ADM-201', 2, 'Office'),
(4, 3, 'LIB-301', 3, 'Hall'),
(5, 4, 'A-405', 4, 'Dormitory'),
(6, 5, 'WRK-01', 1, 'Laboratory');

INSERT IGNORE INTO assets (
    asset_id, asset_name, asset_category, serial_number, purchase_date,
    warranty_expiry, condition_status, location_id, manufacturer
) VALUES
(1, 'Network Switch 24 Port', 'Network Equipment', 'NET-SW-2024-001', '2024-01-15', '2027-01-15', 'Working', 1, 'Cisco'),
(2, 'Ceiling Projector', 'Audio Visual', 'AV-PRJ-2023-014', '2023-03-10', '2026-03-10', 'Damaged', 2, 'Epson'),
(3, 'Library Air Conditioner', 'HVAC', 'HVAC-AC-2022-009', '2022-06-21', '2025-06-21', 'Under Maintenance', 4, 'LG'),
(4, 'Hostel Water Pump', 'Plumbing Equipment', 'PL-WP-2021-005', '2021-09-05', '2024-09-05', 'Out of Service', 5, 'Grundfos'),
(5, 'Office Desktop Computer', 'Computer Hardware', 'PC-ADM-2024-033', '2024-02-01', '2027-02-01', 'Working', 3, 'HP'),
(6, 'Workshop Drill Press', 'Workshop Equipment', 'ENG-DRL-2020-011', '2020-11-12', '2023-11-12', 'Working', 6, 'Bosch');

INSERT IGNORE INTO technicians (technician_id, user_id, specialization, experience_years, availability_status) VALUES
(1, 3, 'Plumbing', 4, 'Available'),
(2, 5, 'Network', 5, 'Busy'),
(3, 6, 'Electrical', 7, 'Available');

INSERT IGNORE INTO maintenance_requests (
    request_id, reported_by, asset_id, location_id, issue_title, issue_description,
    priority_level, request_status, request_date, assigned_to, completion_date
) VALUES
(1, 2, 2, 2, 'Projector not displaying', 'The classroom projector powers on but does not show any image.', 'High', 'In Progress', '2026-05-10 09:15:00', 2, NULL),
(2, 4, 3, 4, 'Library AC leaking water', 'Water is dripping from the indoor AC unit near the reading area.', 'Medium', 'Approved', '2026-05-11 11:30:00', 3, NULL),
(3, 2, 4, 5, 'Hostel water pump failure', 'No water is being pumped to upper hostel floors.', 'Emergency', 'Completed', '2026-05-08 07:45:00', 1, '2026-05-08 16:20:00'),
(4, 1, 1, 1, 'Network outage in lab', 'Computers in the lab cannot connect to the campus network.', 'High', 'Completed', '2026-05-07 10:00:00', 2, '2026-05-07 14:10:00'),
(5, 4, 5, 3, 'Desktop computer overheating', 'The office desktop shuts down after several minutes of use.', 'Medium', 'Pending', '2026-05-12 13:50:00', NULL, NULL);

INSERT IGNORE INTO requests (
    id, maintenance_request_id, student_id, technician_id, title, description, category,
    dorm, block, location, priority, status, progress_percentage, admin_seen,
    tech_seen, student_seen, student_hidden, student_name_snapshot,
    student_code_snapshot, student_phone_snapshot, student_email_snapshot,
    technician_name_snapshot, technician_code_snapshot, technician_phone_snapshot,
    technician_email_snapshot, technician_skills_snapshot
) VALUES
(1, 1, 2, 5, 'Projector not displaying', 'The classroom projector powers on but does not show any image.', 'Audio Visual', 'Science Complex', 'CLS-204', 'Science Complex, CLS-204', 'High', 'In Progress', 45, 1, 0, 0, 0, 'Test Student', 'DBU2024001', '0922000000', 'student@dbu.edu.et', 'Brian Otieno', 'DBU2024004', '0723456789', 'brian.otieno@campus.edu', 'Network, Hardware'),
(2, 2, 4, 6, 'Library AC leaking water', 'Water is dripping from the indoor AC unit near the reading area.', 'HVAC', 'Main Library', 'LIB-301', 'Main Library, LIB-301', 'Medium', 'Assigned', 15, 1, 0, 0, 0, 'Diana Wanjiku', 'DBU2024003', '0745678901', 'diana.wanjiku@campus.edu', 'Charles Kibet', 'DBU2024005', '0734567890', 'charles.kibet@campus.edu', 'Electrical'),
(3, 3, 2, 3, 'Hostel water pump failure', 'No water is being pumped to upper hostel floors.', 'Plumbing', 'Student Hostel A', 'A-405', 'Student Hostel A, A-405', 'Emergency', 'Completed', 100, 1, 1, 0, 0, 'Test Student', 'DBU2024001', '0922000000', 'student@dbu.edu.et', 'Test Technician', 'DBU2024002', '0933000000', 'technician@dbu.edu.et', 'Plumbing, Electrical, HVAC'),
(4, 4, 1, 5, 'Network outage in lab', 'Computers in the lab cannot connect to the campus network.', 'Network Equipment', 'Science Complex', 'LAB-101', 'Science Complex, LAB-101', 'High', 'Completed', 100, 0, 1, 1, 0, 'System Admin', 'ADMIN001', '0911000000', 'admin@dbu.edu.et', 'Brian Otieno', 'DBU2024004', '0723456789', 'brian.otieno@campus.edu', 'Network, Hardware'),
(5, 5, 4, NULL, 'Desktop computer overheating', 'The office desktop shuts down after several minutes of use.', 'Computer Hardware', 'Administration Block', 'ADM-201', 'Administration Block, ADM-201', 'Medium', 'Pending', 0, 0, 1, 1, 0, 'Diana Wanjiku', 'DBU2024003', '0745678901', 'diana.wanjiku@campus.edu', NULL, NULL, NULL, NULL, NULL);

INSERT IGNORE INTO work_orders (
    work_order_id, request_id, technician_id, start_time, end_time,
    work_description, labor_cost, work_status
) VALUES
(1, 1, 2, '2026-05-10 10:00:00', NULL, 'Diagnosing projector signal and HDMI input board.', 1500.00, 'Ongoing'),
(2, 2, 3, '2026-05-11 12:00:00', NULL, 'Inspecting AC drainage line and electrical supply.', 1200.00, 'Ongoing'),
(3, 3, 1, '2026-05-08 08:30:00', '2026-05-08 16:00:00', 'Replaced faulty pump seal and tested water pressure.', 3500.00, 'Completed'),
(4, 4, 2, '2026-05-07 10:30:00', '2026-05-07 13:45:00', 'Reconfigured switch ports and replaced damaged patch cables.', 2500.00, 'Completed'),
(5, 5, 3, NULL, NULL, 'Awaiting approval before inspection.', 0.00, 'Pending');

INSERT IGNORE INTO inventory (part_id, part_name, quantity_available, unit_cost, supplier, reorder_level) VALUES
(1, 'HDMI Cable 5m', 12, 850.00, 'Tech Supplies Ltd', 5),
(2, 'Network Patch Cable', 3, 250.00, 'NetLink Kenya', 10),
(3, 'Pump Seal Kit', 6, 1800.00, 'AquaFix Supplies', 4),
(4, 'AC Drain Pipe', 2, 600.00, 'CoolAir Distributors', 5),
(5, 'CPU Cooling Fan', 8, 1200.00, 'CompuParts Ltd', 3);

INSERT IGNORE INTO maintenance_parts_usage (usage_id, work_order_id, part_id, quantity_used, total_cost) VALUES
(1, 1, 1, 1, 850.00),
(2, 3, 3, 1, 1800.00),
(3, 4, 2, 4, 1000.00),
(4, 2, 4, 1, 600.00),
(5, 5, 5, 0, 0.00);

INSERT IGNORE INTO maintenance_history (history_id, asset_id, work_order_id, maintenance_type, maintenance_date, notes) VALUES
(1, 4, 3, 'Emergency', '2026-05-08', 'Water pump restored after replacing seal kit.'),
(2, 1, 4, 'Corrective', '2026-05-07', 'Network connectivity restored in science laboratory.'),
(3, 2, 1, 'Corrective', '2026-05-10', 'Projector inspection started, input board may need replacement.'),
(4, 3, 2, 'Corrective', '2026-05-11', 'AC drainage issue under inspection.'),
(5, 5, 5, 'Corrective', '2026-05-12', 'Computer overheating request logged, pending inspection.');

INSERT IGNORE INTO maintenance_logs (id, request_id, user_id, actor_name, actor_role, actor_code, action_taken, remarks, progress_percentage) VALUES
(1, 1, 2, 'Test Student', 'Student', 'DBU2024001', 'Request Submitted', 'Student submitted a new maintenance request', 0),
(2, 1, 1, 'System Admin', 'Admin', 'ADMIN001', 'Technician Assigned', 'Assigned to Brian Otieno', 10),
(3, 3, 3, 'Test Technician', 'Technician', 'DBU2024002', 'Request Completed', 'Pump seal replaced and tested', 100),
(4, 4, 5, 'Brian Otieno', 'Technician', 'DBU2024004', 'Request Completed', 'Network connectivity restored', 100),
(5, 5, 4, 'Diana Wanjiku', 'Staff', 'DBU2024003', 'Request Submitted', 'Desktop overheating request logged', 0);

INSERT IGNORE INTO notifications (notification_id, user_id, message, notification_date, is_read) VALUES
(1, 2, 'Your projector maintenance request has been assigned to a technician.', '2026-05-10 09:30:00', FALSE),
(2, 4, 'Your AC maintenance request has been approved.', '2026-05-11 11:45:00', FALSE),
(3, 2, 'The hostel water pump issue has been completed.', '2026-05-08 16:30:00', TRUE),
(4, 1, 'Network outage work order has been completed.', '2026-05-07 14:20:00', TRUE),
(5, 4, 'Desktop overheating request is pending approval.', '2026-05-12 14:00:00', FALSE);

INSERT IGNORE INTO preventive_schedules (
    schedule_id, asset_id, next_service_date, maintenance_interval_days,
    last_service_date, schedule_status
) VALUES
(1, 1, '2026-06-15', 90, '2026-03-15', 'Scheduled'),
(2, 2, '2026-06-10', 120, '2026-02-10', 'Scheduled'),
(3, 3, '2026-05-01', 180, '2025-11-01', 'Overdue'),
(4, 4, '2026-08-08', 90, '2026-05-08', 'Scheduled'),
(5, 6, '2026-07-12', 180, '2026-01-12', 'Scheduled');

-- Useful SQL Queries

-- View pending maintenance requests
SELECT
    mr.request_id,
    mr.issue_title,
    mr.priority_level,
    mr.request_status,
    mr.request_date,
    u.full_name AS reported_by,
    a.asset_name,
    b.building_name,
    l.room_number
FROM maintenance_requests mr
JOIN users u ON mr.reported_by = u.user_id
LEFT JOIN assets a ON mr.asset_id = a.asset_id
LEFT JOIN locations l ON mr.location_id = l.location_id
LEFT JOIN buildings b ON l.building_id = b.building_id
WHERE mr.request_status = 'Pending'
ORDER BY mr.request_date ASC;

-- View technician workload
SELECT
    t.technician_id,
    u.full_name AS technician_name,
    t.specialization,
    t.availability_status,
    COUNT(mr.request_id) AS assigned_requests,
    SUM(CASE WHEN mr.request_status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_requests,
    SUM(CASE WHEN mr.request_status = 'Completed' THEN 1 ELSE 0 END) AS completed_requests
FROM technicians t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN maintenance_requests mr ON t.technician_id = mr.assigned_to
GROUP BY t.technician_id, u.full_name, t.specialization, t.availability_status
ORDER BY assigned_requests DESC;

-- View maintenance history of an asset. Replace 1 with the asset_id you need.
SELECT
    a.asset_id,
    a.asset_name,
    mh.maintenance_type,
    mh.maintenance_date,
    wo.work_description,
    wo.labor_cost,
    mh.notes
FROM maintenance_history mh
JOIN assets a ON mh.asset_id = a.asset_id
JOIN work_orders wo ON mh.work_order_id = wo.work_order_id
WHERE a.asset_id = 1
ORDER BY mh.maintenance_date DESC;

-- View inventory below reorder level
SELECT
    part_id,
    part_name,
    quantity_available,
    reorder_level,
    supplier
FROM inventory
WHERE quantity_available <= reorder_level
ORDER BY quantity_available ASC;

-- View total maintenance cost per asset
SELECT
    a.asset_id,
    a.asset_name,
    COALESCE(SUM(wo.labor_cost), 0) AS total_labor_cost,
    COALESCE(SUM(mpu.total_cost), 0) AS total_parts_cost,
    COALESCE(SUM(wo.labor_cost), 0) + COALESCE(SUM(mpu.total_cost), 0) AS total_maintenance_cost
FROM assets a
LEFT JOIN maintenance_requests mr ON a.asset_id = mr.asset_id
LEFT JOIN work_orders wo ON mr.request_id = wo.request_id
LEFT JOIN maintenance_parts_usage mpu ON wo.work_order_id = mpu.work_order_id
GROUP BY a.asset_id, a.asset_name
ORDER BY total_maintenance_cost DESC;

-- View most frequently failing assets
SELECT
    a.asset_id,
    a.asset_name,
    a.serial_number,
    COUNT(mr.request_id) AS failure_count
FROM assets a
JOIN maintenance_requests mr ON a.asset_id = mr.asset_id
GROUP BY a.asset_id, a.asset_name, a.serial_number
ORDER BY failure_count DESC, a.asset_name ASC;
