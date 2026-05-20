<?php

require_once "config/database.php";
require_once "services/PasswordService.php";
require_once "utils/Response.php";

function login($pdo) {

    $user_code = $_POST['user_code'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$user_code || !$password) {
        response(false, "Missing credentials");
    }

    // Find user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_code = ?");
    $stmt->execute([$user_code]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    // Check status
    if ($user['status'] != 'Active') {
        response(false, "Account is inactive");
    }

    // Verify password
    if (!verifyPassword($password, $user['password_hash'])) {
        response(false, "Invalid password");
    }

    // Must change password check
    if ($user['must_change_password'] == 1) {
        response(true, "Password change required", [
            "action" => "change_password",
            "user_id" => $user['user_id']
        ]);
    }

    // SUCCESS LOGIN
    response(true, "Login successful", [
        "user_id" => $user['user_id'],
        "role" => strtolower($user['role']),
        "name" => $user['full_name']
    ]);
}


?>
