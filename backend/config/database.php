<?php

$host = "localhost";
$db_name = "campus_maintenance";
$username = "root";
$password = "";
$charset = "utf8mb4";

function columnExists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
    ");
    $stmt->execute([$table, $column]);
    return (int)$stmt->fetchColumn() > 0;
}

function foreignKeyDeleteRule(PDO $pdo, string $constraintName): ?string
{
    $stmt = $pdo->prepare("
        SELECT rc.DELETE_RULE
        FROM information_schema.REFERENTIAL_CONSTRAINTS rc
        WHERE rc.CONSTRAINT_SCHEMA = DATABASE() AND rc.CONSTRAINT_NAME = ?
        LIMIT 1
    ");
    $stmt->execute([$constraintName]);
    $rule = $stmt->fetchColumn();
    return $rule !== false ? $rule : null;
}

function ensureColumn(PDO $pdo, string $table, string $column, string $sql): void
{
    if (!columnExists($pdo, $table, $column)) {
        $pdo->exec($sql);
    }
}

function ensureDatabaseSchema(PDO $pdo): void
{
    ensureColumn($pdo, 'requests', 'dorm', "ALTER TABLE requests ADD COLUMN dorm VARCHAR(120) DEFAULT NULL AFTER category");
    ensureColumn($pdo, 'requests', 'block', "ALTER TABLE requests ADD COLUMN block VARCHAR(120) DEFAULT NULL AFTER dorm");
    ensureColumn($pdo, 'requests', 'student_name_snapshot', "ALTER TABLE requests ADD COLUMN student_name_snapshot VARCHAR(100) DEFAULT NULL AFTER student_hidden");
    ensureColumn($pdo, 'requests', 'student_code_snapshot', "ALTER TABLE requests ADD COLUMN student_code_snapshot VARCHAR(50) DEFAULT NULL AFTER student_name_snapshot");
    ensureColumn($pdo, 'requests', 'student_phone_snapshot', "ALTER TABLE requests ADD COLUMN student_phone_snapshot VARCHAR(30) DEFAULT NULL AFTER student_code_snapshot");
    ensureColumn($pdo, 'requests', 'student_email_snapshot', "ALTER TABLE requests ADD COLUMN student_email_snapshot VARCHAR(100) DEFAULT NULL AFTER student_phone_snapshot");
    ensureColumn($pdo, 'requests', 'technician_name_snapshot', "ALTER TABLE requests ADD COLUMN technician_name_snapshot VARCHAR(100) DEFAULT NULL AFTER student_email_snapshot");
    ensureColumn($pdo, 'requests', 'technician_code_snapshot', "ALTER TABLE requests ADD COLUMN technician_code_snapshot VARCHAR(50) DEFAULT NULL AFTER technician_name_snapshot");
    ensureColumn($pdo, 'requests', 'technician_phone_snapshot', "ALTER TABLE requests ADD COLUMN technician_phone_snapshot VARCHAR(30) DEFAULT NULL AFTER technician_code_snapshot");
    ensureColumn($pdo, 'requests', 'technician_email_snapshot', "ALTER TABLE requests ADD COLUMN technician_email_snapshot VARCHAR(100) DEFAULT NULL AFTER technician_phone_snapshot");
    ensureColumn($pdo, 'requests', 'technician_skills_snapshot', "ALTER TABLE requests ADD COLUMN technician_skills_snapshot VARCHAR(120) DEFAULT NULL AFTER technician_email_snapshot");

    ensureColumn($pdo, 'maintenance_logs', 'actor_name', "ALTER TABLE maintenance_logs ADD COLUMN actor_name VARCHAR(100) DEFAULT NULL AFTER user_id");
    ensureColumn($pdo, 'maintenance_logs', 'actor_role', "ALTER TABLE maintenance_logs ADD COLUMN actor_role VARCHAR(30) DEFAULT NULL AFTER actor_name");
    ensureColumn($pdo, 'maintenance_logs', 'actor_code', "ALTER TABLE maintenance_logs ADD COLUMN actor_code VARCHAR(50) DEFAULT NULL AFTER actor_role");

    $pdo->exec("ALTER TABLE requests MODIFY COLUMN student_id INT NULL");
    $pdo->exec("ALTER TABLE requests MODIFY COLUMN technician_id INT NULL");
    $pdo->exec("ALTER TABLE maintenance_logs MODIFY COLUMN user_id INT NULL");

    if (foreignKeyDeleteRule($pdo, 'fk_requests_student') !== 'SET NULL') {
        $pdo->exec("ALTER TABLE requests DROP FOREIGN KEY fk_requests_student");
        $pdo->exec("ALTER TABLE requests ADD CONSTRAINT fk_requests_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL");
    }

    if (foreignKeyDeleteRule($pdo, 'fk_requests_technician') !== 'SET NULL') {
        $pdo->exec("ALTER TABLE requests DROP FOREIGN KEY fk_requests_technician");
        $pdo->exec("ALTER TABLE requests ADD CONSTRAINT fk_requests_technician FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL");
    }

    if (foreignKeyDeleteRule($pdo, 'fk_logs_user') !== 'SET NULL') {
        $pdo->exec("ALTER TABLE maintenance_logs DROP FOREIGN KEY fk_logs_user");
        $pdo->exec("ALTER TABLE maintenance_logs ADD CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL");
    }

    $pdo->exec("
        UPDATE requests r
        LEFT JOIN users s ON r.student_id = s.id
        LEFT JOIN users t ON r.technician_id = t.id
        SET
            r.student_name_snapshot = COALESCE(r.student_name_snapshot, s.name),
            r.student_code_snapshot = COALESCE(r.student_code_snapshot, s.user_code),
            r.student_phone_snapshot = COALESCE(r.student_phone_snapshot, s.phone_number),
            r.student_email_snapshot = COALESCE(r.student_email_snapshot, s.email),
            r.technician_name_snapshot = COALESCE(r.technician_name_snapshot, t.name),
            r.technician_code_snapshot = COALESCE(r.technician_code_snapshot, t.user_code),
            r.technician_phone_snapshot = COALESCE(r.technician_phone_snapshot, t.phone_number),
            r.technician_email_snapshot = COALESCE(r.technician_email_snapshot, t.email),
            r.technician_skills_snapshot = COALESCE(r.technician_skills_snapshot, t.skills)
    ");

    $pdo->exec("
        UPDATE maintenance_logs l
        LEFT JOIN users u ON l.user_id = u.id
        SET
            l.actor_name = COALESCE(l.actor_name, u.name),
            l.actor_role = COALESCE(l.actor_role, u.role),
            l.actor_code = COALESCE(l.actor_code, u.user_code)
    ");
}

try {
    $dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    ensureDatabaseSchema($pdo);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

?>
