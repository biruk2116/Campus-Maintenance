<?php

require_once __DIR__ . "/../services/PasswordService.php";
require_once __DIR__ . "/../utils/Response.php";

function isValidInstitutionId($user_code)
{
    return preg_match('/^DBU\d{7}$/i', $user_code);
}

function findUserByCode($pdo, $user_code)
{
    $stmt = $pdo->prepare("
        SELECT id, user_code, name, role, status, phone_number, skills, must_change_password
        FROM users
        WHERE user_code = ?
        LIMIT 1
    ");
    $stmt->execute([$user_code]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createUser($pdo)
{
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $role = $_POST['role'] ?? '';
    $user_code = strtoupper(trim($_POST['user_code'] ?? ''));
    $phone_number = trim($_POST['phone_number'] ?? '');
    $skills = trim($_POST['skills'] ?? '');

    if (!$name || !$role || !$user_code) {
        response(false, "Name, user ID, and role are required");
    }

    if (!in_array($role, ['student', 'technician'], true)) {
        response(false, "Invalid role selected");
    }

    if (!isValidInstitutionId($user_code)) {
        response(false, "Invalid ID format. Use DBU followed by 7 digits");
    }

    if ($role === 'technician' && !$skills) {
        response(false, "Technician ability is required");
    }

    if (findUserByCode($pdo, $user_code)) {
        response(false, "User ID already exists");
    }

    $plainPassword = generatePassword(8);
    $hashedPassword = hashPassword($plainPassword);

    $stmt = $pdo->prepare("
        INSERT INTO users (
            user_code,
            name,
            email,
            phone_number,
            password,
            role,
            status,
            skills,
            must_change_password
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, 1)
    ");

    $stmt->execute([
        $user_code,
        $name,
        $email ?: null,
        $phone_number ?: null,
        $hashedPassword,
        $role,
        $role === 'technician' ? $skills : null
    ]);

    response(true, "User created successfully", [
        "name" => $name,
        "role" => $role,
        "user_code" => $user_code,
        "temporary_password" => $plainPassword
    ]);
}

function updateUser($pdo)
{
    $id = $_POST['id'] ?? '';
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone_number = trim($_POST['phone_number'] ?? '');
    $status = $_POST['status'] ?? 'active';
    $skills = trim($_POST['skills'] ?? '');

    if (!$id || !$name) {
        response(false, "ID and name are required");
    }

    $stmt = $pdo->prepare("
        UPDATE users
        SET name = ?, email = ?, phone_number = ?, status = ?, skills = ?
        WHERE id = ? AND role != 'admin'
    ");
    $stmt->execute([
        $name,
        $email ?: null,
        $phone_number ?: null,
        $status,
        $skills ?: null,
        $id
    ]);

    response(true, "User updated successfully");
}

function resetPassword($pdo)
{
    $id = $_POST['id'] ?? '';

    if (!$id) {
        response(false, "User ID is required");
    }

    $stmt = $pdo->prepare("SELECT id, user_code FROM users WHERE id = ? AND role != 'admin' LIMIT 1");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    $plainPassword = generatePassword(8);
    $hashedPassword = hashPassword($plainPassword);

    $reset = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 1 WHERE id = ?");
    $reset->execute([$hashedPassword, $user['id']]);

    response(true, "Password reset successfully", [
        "user_code" => $user['user_code'],
        "temporary_password" => $plainPassword
    ]);
}

function deleteUser($pdo)
{
    $user_id = $_POST['user_id'] ?? '';

    if (!$user_id) {
        response(false, "User ID required");
    }

    $stmt = $pdo->prepare("
        SELECT id, role
        FROM users
        WHERE id = ? AND role != 'admin'
        LIMIT 1
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    $usageCheck = $pdo->prepare("
        SELECT COUNT(*)
        FROM requests
        WHERE student_id = ? OR technician_id = ?
    ");
    $usageCheck->execute([$user_id, $user_id]);

    if ((int)$usageCheck->fetchColumn() > 0) {
        response(false, "This user already has maintenance records. Reset or deactivate the account instead.");
    }

    $delete = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $delete->execute([$user_id]);

    response(true, "User deleted successfully");
}

function getTechnicians($pdo)
{
    $stmt = $pdo->query("
        SELECT id, user_code, name, phone_number, skills
        FROM users
        WHERE role = 'technician' AND status = 'active'
        ORDER BY name ASC
    ");

    response(true, "Technicians list", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function getAllUsers($pdo)
{
    $stmt = $pdo->query("
        SELECT id, user_code, name, email, phone_number, role, status, skills, must_change_password, created_at
        FROM users
        WHERE role != 'admin'
        ORDER BY created_at DESC
    ");

    response(true, "Users list", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function resetUserPassword($pdo)
{
    $user_code = strtoupper(trim($_POST['user_code'] ?? ''));

    if (!$user_code) {
        response(false, "User ID is required");
    }

    $user = findUserByCode($pdo, $user_code);

    if (!$user || $user['role'] === 'admin') {
        response(false, "User not found");
    }

    $plainPassword = generatePassword(8);
    $hashedPassword = hashPassword($plainPassword);

    $stmt = $pdo->prepare("UPDATE users SET password = ?, must_change_password = 1 WHERE id = ?");
    $stmt->execute([$hashedPassword, $user['id']]);

    response(true, "Password reset successfully", [
        "user_code" => $user['user_code'],
        "temporary_password" => $plainPassword
    ]);
}

function deactivateUser($pdo)
{
    $user_id = $_POST['user_id'] ?? '';
    $status = $_POST['status'] ?? 'inactive';

    if (!$user_id || !in_array($status, ['active', 'inactive'], true)) {
        response(false, "Invalid request");
    }

    $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ? AND role != 'admin'");
    $stmt->execute([$status, $user_id]);

    response(true, "User status updated successfully");
}

?>
