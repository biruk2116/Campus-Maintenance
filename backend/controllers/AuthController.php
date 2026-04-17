<?php

require_once __DIR__ . "/../services/PasswordService.php";
require_once __DIR__ . "/../utils/Response.php";

function login($pdo)
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $user_code = $_POST['user_code'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$user_code || !$password) {
        response(false, "Missing credentials");
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_code = ?");
    $stmt->execute([$user_code]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    if ($user['status'] !== 'active') {
        response(false, "Account is inactive");
    }

    if (!verifyPassword($password, $user['password'])) {
        response(false, "Invalid password");
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['name'] = $user['name'];

    if ($user['must_change_password'] == 1) {
        response(true, "Password change required", [
            "action" => "change_password"
        ]);
    }

    response(true, "Login successful", [
        "user_id" => $user['id'],
        "role" => $user['role'],
        "name" => $user['name']
    ]);
}

function logout()
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $_SESSION = [];
    session_destroy();
    response(true, "Logged out successfully");
}

function checkSession()
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (isset($_SESSION['user_id'])) {
        response(true, "Session active", [
            "user_id" => $_SESSION['user_id'],
            "role" => $_SESSION['role'],
            "name" => $_SESSION['name']
        ]);
    }

    response(false, "No active session");
}

function changePassword($pdo)
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (!isset($_SESSION['user_id'])) {
        response(false, "Unauthorized");
    }

    $old_password = $_POST['old_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';

    if (!$old_password || !$new_password) {
        response(false, "All fields are required");
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !verifyPassword($old_password, $user['password'])) {
        response(false, "Old password incorrect");
    }

    $new_hash = hashPassword($new_password);
    $update = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?");
    $update->execute([$new_hash, $_SESSION['user_id']]);

    response(true, "Password updated successfully");
}
