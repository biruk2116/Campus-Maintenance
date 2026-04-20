<?php

require_once __DIR__ . "/../services/PasswordService.php";
require_once __DIR__ . "/../utils/Response.php";

function buildUserPayload(array $user)
{
    return [
        "user_id" => (int)$user['id'],
        "role" => $user['role'],
        "name" => $user['name'],
        "user_code" => $user['user_code'],
        "phone_number" => $user['phone_number'] ?? null,
        "skills" => $user['skills'] ?? null,
        "must_change_password" => (int)$user['must_change_password']
    ];
}

function login($pdo)
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $user_code = strtoupper(trim($_POST['user_code'] ?? ''));
    $password = $_POST['password'] ?? '';

    if (!$user_code || !$password) {
        response(false, "Missing credentials");
    }

    $stmt = $pdo->prepare("
        SELECT id, user_code, name, phone_number, skills, password, role, status, must_change_password
        FROM users
        WHERE user_code = ?
        LIMIT 1
    ");
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

    if ((int)$user['must_change_password'] === 1) {
        $_SESSION = [];
        session_regenerate_id(true);

        response(true, "Password change required", [
            "action" => "change_password",
            "user_code" => $user['user_code'],
            "role" => $user['role'],
            "name" => $user['name'],
            "must_change_password" => 1
        ]);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['user_code'] = $user['user_code'];

    response(true, "Login successful", buildUserPayload($user));
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

function checkSession($pdo)
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (!isset($_SESSION['user_id'])) {
        response(false, "No active session");
    }

    $stmt = $pdo->prepare("
        SELECT id, user_code, name, phone_number, skills, role, status, must_change_password
        FROM users
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['status'] !== 'active') {
        $_SESSION = [];
        session_destroy();
        response(false, "No active session");
    }

    $_SESSION['role'] = $user['role'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['user_code'] = $user['user_code'];

    response(true, "Session active", buildUserPayload($user));
}

function changePassword($pdo)
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $old_password = $_POST['old_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $user_code = strtoupper(trim($_POST['user_code'] ?? ''));

    if (!$old_password || !$new_password) {
        response(false, "All fields are required");
    }

    if (strlen($new_password) < 6) {
        response(false, "New password must be at least 6 characters");
    }

    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("
            SELECT id, user_code, password, must_change_password
            FROM users
            WHERE id = ?
            LIMIT 1
        ");
        $stmt->execute([$_SESSION['user_id']]);
    } elseif ($user_code) {
        $stmt = $pdo->prepare("
            SELECT id, user_code, password, must_change_password
            FROM users
            WHERE user_code = ?
            LIMIT 1
        ");
        $stmt->execute([$user_code]);
    } else {
        response(false, "Unauthorized");
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !verifyPassword($old_password, $user['password'])) {
        response(false, "Old password incorrect");
    }

    $new_hash = hashPassword($new_password);
    $update = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 0 WHERE id = ?");
    $update->execute([$new_hash, $user['id']]);

    if (isset($_SESSION['user_id'])) {
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_code'] = $user['user_code'];
    }

    response(true, "Password updated successfully", [
        "user_code" => $user['user_code'],
        "must_change_password" => 0
    ]);
}

?>
