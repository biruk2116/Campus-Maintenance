<?php

require_once "config/database.php";
require_once "services/PasswordService.php";
require_once "utils/Response.php";

/*
-----------------------------------
CREATE USER (ADMIN ONLY)
-----------------------------------
*/
function createUser($pdo)
{

    // ========================
    // SECURITY CHECK (ADMIN ONLY)
    // ========================
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized access");
    }

    // ========================
    // INPUT DATA
    // ========================
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $role = $_POST['role'] ?? '';
    $user_code = $_POST['user_code'] ?? '';

    // ========================
    // VALIDATION
    // ========================
    if (!$name || !$role || !$user_code) {
        response(false, "Missing required fields");
    }

    if (!in_array($role, ['student', 'technician'])) {
        response(false, "Invalid role selected");
    }

    // ========================
    // CHECK DUPLICATE USER_CODE
    // ========================
    $check = $pdo->prepare("SELECT id FROM users WHERE user_code = ?");
    $check->execute([$user_code]);

    if ($check->fetch()) {
        response(false, "User code already exists");
    }

    // ========================
    // GENERATE PASSWORD (OPTION B)
    // ========================
    $plainPassword = generatePassword();
    $hashedPassword = hashPassword($plainPassword);

    // ========================
    // INSERT USER
    // ========================
    $stmt = $pdo->prepare("
        INSERT INTO users 
        (user_code, name, email, password, role, must_change_password, status)
        VALUES (?, ?, ?, ?, ?, 1, 'active')
    ");

    $stmt->execute([
        $user_code,
        $name,
        $email,
        $hashedPassword,
        $role
    ]);

    // ========================
    // RESPONSE (PASSWORD SHOWN ONCE ONLY)
    // ========================
    response(true, "User created successfully", [
        "user_code" => $user_code,
        "temporary_password" => $plainPassword
    ]);
}
function deactivateUser($pdo)
{

    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $user_id = $_POST['user_id'] ?? '';

    if (!$user_id) {
        response(false, "User ID required");
    }

    $stmt = $pdo->prepare("
        UPDATE users 
        SET status = 'inactive' 
        WHERE id = ?
    ");

    $stmt->execute([$user_id]);

    response(true, "User deactivated successfully");
}
function getTechnicians($pdo)
{

    if ($_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->query("
        SELECT id, name 
        FROM users 
        WHERE role = 'technician' AND status = 'active'
    ");

    response(true, "Technicians list", $stmt->fetchAll(PDO::FETCH_ASSOC));
}
