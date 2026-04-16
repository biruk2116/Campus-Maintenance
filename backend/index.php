<?php

// ========================
// LOAD DATABASE
// ========================
require_once "config/database.php";

// ========================
// BASIC ROUTING (SIMPLE API STYLE)
// ========================

// Get action from URL
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {

    // ========================
    // TEST CONNECTION
    // ========================
    case 'test':
        echo "Backend is working + DB connected!";
        break;

    // ========================
    // LOGIN ROUTE (we will build later)
    // ========================
    case 'login':
        require_once "controllers/AuthController.php";
        login($pdo);
        break;

    // ========================
    // DEFAULT
    // ========================
    default:
        echo "Invalid API route";
        break;
}

?>