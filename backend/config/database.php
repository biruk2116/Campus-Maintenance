<?php

// ========================
// DATABASE CONFIGURATION
// ========================

$host = "localhost";
$db_name = "campus_maintenance";
$username = "root";
$password = ""; // XAMPP default is empty
$charset = "utf8mb4";

try {
    // Create connection using PDO
    $dsn = "mysql:host=$host;dbname=$db_name;charset=$charset";

    $pdo = new PDO($dsn, $username, $password);

    // Enable error mode (VERY IMPORTANT for debugging)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

?>