<?php

require_once "config/database.php";
require_once "services/PasswordService.php";
require_once "utils/Response.php";

/*
-----------------------------------
VALIDATE STUDENT ID (DBU1601069 format)
-----------------------------------
*/
function isValidStudentId($user_code) {
    return preg_match('/^DBU\d{7}$/i', $user_code);
}

/*
-----------------------------------
CREATE USER (ADMIN ONLY)
-----------------------------------
*/
function createUser($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized access");
    }

    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $role = $_POST['role'] ?? '';
    $user_code = $_POST['user_code'] ?? '';

    if (!$name || !$role || !$user_code) {
        response(false, "Missing required fields");
    }

    if (!in_array($role, ['student', 'technician'])) {
        response(false, "Invalid role selected");
    }

    // Role-specific validation
    if ($role === 'student' && !isValidStudentId($user_code)) {
        response(false, "Invalid Student ID format. Must be DBUXXXXXXX");
    }

    $check = $pdo->prepare("SELECT id FROM users WHERE user_code = ?");
    $check->execute([$user_code]);

    if ($check->fetch()) {
        response(false, "User code already exists");
    }

    $plainPassword = generatePassword();
    $hashedPassword = hashPassword($plainPassword);

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

    response(true, "User created successfully", [
        "user_code" => $user_code,
        "temporary_password" => $plainPassword
    ]);
}

/*
-----------------------------------
UPDATE USER (ADMIN ONLY)
-----------------------------------
*/
function updateUser($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $id = $_POST['id'] ?? '';
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $status = $_POST['status'] ?? 'active';

    if (!$id || !$name) {
        response(false, "ID and Name are required");
    }

    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, status = ? WHERE id = ?");
    $stmt->execute([$name, $email, $status, $id]);

    response(true, "User updated successfully");
}

/*
-----------------------------------
RESET PASSWORD (ADMIN ONLY)
-----------------------------------
*/
function resetPassword($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $id = $_POST['id'] ?? '';

    if (!$id) {
        response(false, "User ID required");
    }

    $plainPassword = generatePassword();
    $hashedPassword = hashPassword($plainPassword);

    $stmt = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 1 WHERE id = ?");
    $stmt->execute([$hashedPassword, $id]);

    response(true, "Password reset successfully", [
        "temporary_password" => $plainPassword
    ]);
}

/*
-----------------------------------
DELETE USER (ADMIN ONLY)
-----------------------------------
*/
function deleteUser($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $user_id = $_POST['user_id'] ?? '';

    if (!$user_id) {
        response(false, "User ID required");
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$user_id]);

    response(true, "User deleted successfully");
}

/*
-----------------------------------
GET TECHNICIANS (ADMIN ONLY)
-----------------------------------
*/
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

/*
-----------------------------------
GET ALL USERS (ADMIN ONLY)
-----------------------------------
*/
function getAllUsers($pdo)
{
    if ($_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->query("SELECT id, user_code, name, email, role, status, created_at FROM users WHERE role != 'admin'");
    response(true, "Users list", $stmt->fetchAll(PDO::FETCH_ASSOC));
}
