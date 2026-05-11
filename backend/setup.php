<?php

/**
 * Database Setup Script
 * Run this once to initialize the database with tables and test data
 */

header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$db_name = "campus_maintenance";
$username = "root";
$password = "";
$charset = "utf8mb4";

try {
    // Connect to MySQL without selecting a database
    $pdo = new PDO("mysql:host=$host;charset=$charset", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read the init.sql file
    $sqlFile = __DIR__ . "/../database/init.sql";
    
    if (!file_exists($sqlFile)) {
        throw new Exception("init.sql file not found at: $sqlFile");
    }

    $sqlContent = file_get_contents($sqlFile);

    // Remove SQL comments before splitting statements. Keeping comment lines in place
    // caused valid CREATE/INSERT statements to be skipped when a comment preceded them.
    $sqlContent = preg_replace('/^\s*--.*$/m', '', $sqlContent);

    // Split SQL statements by semicolon
    $statements = array_filter(
        array_map('trim', preg_split('/;/', $sqlContent)),
        fn($stmt) => !empty($stmt)
    );

    $executedCount = 0;
    $errors = [];

    foreach ($statements as $statement) {
        try {
            if (!empty($statement)) {
                $pdo->exec($statement);
                $executedCount++;
            }
        } catch (PDOException $e) {
            // Only log non-duplicate key errors
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                $errors[] = [
                    "error" => $e->getMessage(),
                    "statement" => substr($statement, 0, 180)
                ];
            }
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Database initialized successfully",
        "details" => [
            "statements_executed" => $executedCount,
            "errors_ignored" => count($errors),
            "errors" => $errors,
            "test_credentials" => [
                [
                    "role" => "admin",
                    "user_code" => "ADMIN001",
                    "password" => "admin123"
                ],
                [
                    "role" => "student",
                    "user_code" => "DBU-2024-STU",
                    "password" => "admin123"
                ],
                [
                    "role" => "technician",
                    "user_code" => "DBU-2024-TEC",
                    "password" => "admin123"
                ]
            ]
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection or setup failed",
        "error" => $e->getMessage()
    ]);
    exit;
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Setup error",
        "error" => $e->getMessage()
    ]);
    exit;
}
?>
