<?php

require_once __DIR__ . "/../services/PasswordService.php";
require_once __DIR__ . "/../utils/Response.php";

function isValidInstitutionId($user_code)
{
    return preg_match('/^DBU\d{7}$/i', $user_code);
}

function isValidFullName($name)
{
    return preg_match('/^[A-Za-z]+(?:[ .\'-][A-Za-z]+)+$/', $name);
}

function technicianSpecializationFromSkills($skills)
{
    $value = strtolower($skills);
    if (strpos($value, 'electrical') !== false) {
        return 'Electrical';
    }
    if (strpos($value, 'plumbing') !== false) {
        return 'Plumbing';
    }
    if (strpos($value, 'network') !== false) {
        return 'Network';
    }
    if (strpos($value, 'civil') !== false) {
        return 'Civil';
    }
    return 'Hardware';
}

function getUserFormOptions($pdo)
{
    $departments = $pdo->query("
        SELECT department_id, department_name, office_location
        FROM departments
        ORDER BY department_name ASC
    ")->fetchAll(PDO::FETCH_ASSOC);

    $specializations = $pdo->query("
        SELECT specialization_name
        FROM technician_specializations
        ORDER BY specialization_name ASC
    ")->fetchAll(PDO::FETCH_COLUMN);

    response(true, "User form options", [
        "departments" => $departments,
        "roles" => ['Student', 'Staff', 'Technician'],
        "specializations" => $specializations
    ]);
}

function createDepartment($pdo)
{
    $departmentName = trim($_POST['department_name'] ?? '');
    $officeLocation = trim($_POST['office_location'] ?? '');

    if (!$departmentName || !$officeLocation) {
        response(false, "Department name and office location are required");
    }

    if (strlen($departmentName) < 3) {
        response(false, "Department name must be at least 3 characters");
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO departments (department_name, office_location)
            VALUES (?, ?)
        ");
        $stmt->execute([$departmentName, $officeLocation]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            response(false, "Department already exists");
        }
        response(false, "Unable to create department");
    }

    response(true, "Department created successfully", [
        "department_id" => (int)$pdo->lastInsertId(),
        "department_name" => $departmentName,
        "office_location" => $officeLocation
    ]);
}

function createTechnicianSpecialization($pdo)
{
    $specializationName = trim($_POST['specialization_name'] ?? '');

    if (!$specializationName) {
        response(false, "Specialization name is required");
    }

    if (strlen($specializationName) < 3) {
        response(false, "Specialization name must be at least 3 characters");
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO technician_specializations (specialization_name)
            VALUES (?)
        ");
        $stmt->execute([$specializationName]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            response(false, "Specialization already exists");
        }
        response(false, "Unable to create specialization");
    }

    response(true, "Specialization created successfully", [
        "specialization_name" => $specializationName
    ]);
}

function findUserByCode($pdo, $user_code)
{
    $stmt = $pdo->prepare("
        SELECT user_id AS id, user_code, full_name AS name, LOWER(role) AS role, LOWER(status) AS status, phone AS phone_number, skills, must_change_password
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
    $role = strtolower(trim($_POST['role'] ?? ''));
    $user_code = strtoupper(trim($_POST['user_code'] ?? ''));
    $phone_number = trim($_POST['phone_number'] ?? '');
    $skills = trim($_POST['skills'] ?? '');
    $departmentId = $_POST['department_id'] ?? null;
    $specialization = trim($_POST['specialization'] ?? '');
    $experienceYears = (int)($_POST['experience_years'] ?? 0);
    $availabilityStatus = $_POST['availability_status'] ?? 'Available';

    if (!$name || !$role || !$user_code) {
        response(false, "Full name, user ID, and role are required");
    }

    if (strlen($name) < 5 || !isValidFullName($name)) {
        response(false, "Enter a valid full name using at least first and last name");
    }

    if (!in_array($role, ['student', 'staff', 'technician'], true)) {
        response(false, "Invalid role selected");
    }

    if (!isValidInstitutionId($user_code)) {
        response(false, "Invalid ID format. Use DBU followed by 7 digits");
    }

    $departmentId = $departmentId !== null && $departmentId !== '' ? (int)$departmentId : null;
    if ($departmentId) {
        $departmentStmt = $pdo->prepare("SELECT department_id FROM departments WHERE department_id = ? LIMIT 1");
        $departmentStmt->execute([$departmentId]);
        if (!$departmentStmt->fetchColumn()) {
            response(false, "Selected department was not found");
        }
    }

    if ($role === 'technician') {
        if (!$specialization && $skills) {
            $specialization = technicianSpecializationFromSkills($skills);
        }

        $specializationStmt = $pdo->prepare("
            SELECT specialization_name
            FROM technician_specializations
            WHERE specialization_name = ?
            LIMIT 1
        ");
        $specializationStmt->execute([$specialization]);

        if (!$specializationStmt->fetchColumn()) {
            response(false, "Technician specialization is required");
        }
        $skills = $skills ?: $specialization;
    }

    if ($availabilityStatus && !in_array($availabilityStatus, ['Available', 'Busy', 'Offline'], true)) {
        $availabilityStatus = 'Available';
    }

    if (findUserByCode($pdo, $user_code)) {
        response(false, "User ID already exists");
    }

    $plainPassword = generatePassword(8);
    $hashedPassword = hashPassword($plainPassword);

    $stmt = $pdo->prepare("
        INSERT INTO users (
            user_code,
            full_name,
            email,
            phone,
            password_hash,
            role,
            department_id,
            status,
            skills,
            must_change_password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', ?, 1)
    ");

    $stmt->execute([
        $user_code,
        $name,
        $email ?: null,
        $phone_number ?: null,
        $hashedPassword,
        ucfirst($role),
        $departmentId,
        $role === 'technician' ? $skills : null
    ]);

    if ($role === 'technician') {
        $userId = (int)$pdo->lastInsertId();
        $techStmt = $pdo->prepare("
            INSERT INTO technicians (user_id, specialization, experience_years, availability_status)
            VALUES (?, ?, ?, ?)
        ");
        $techStmt->execute([$userId, $specialization, max(0, $experienceYears), $availabilityStatus]);
    }

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
        SET full_name = ?, email = ?, phone = ?, status = ?, skills = ?
        WHERE user_id = ? AND role != 'Admin'
    ");
    $stmt->execute([
        $name,
        $email ?: null,
        $phone_number ?: null,
        ucfirst($status),
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

    $stmt = $pdo->prepare("SELECT user_id AS id, user_code FROM users WHERE user_id = ? AND role != 'Admin' LIMIT 1");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    $plainPassword = generatePassword(8);
    $hashedPassword = hashPassword($plainPassword);

    $reset = $pdo->prepare("UPDATE users SET password_hash = ?, must_change_password = 1 WHERE user_id = ?");
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
        SELECT user_id AS id, LOWER(role) AS role
        FROM users
        WHERE user_id = ? AND role != 'Admin'
        LIMIT 1
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        response(false, "User not found");
    }

    $pdo->beginTransaction();

    try {
        if ($user['role'] === 'student') {
            $stmt = $pdo->prepare("UPDATE requests SET student_id = NULL WHERE student_id = ?");
            $stmt->execute([$user_id]);
        }

        if ($user['role'] === 'technician') {
            $stmt = $pdo->prepare("UPDATE requests SET technician_id = NULL WHERE technician_id = ?");
            $stmt->execute([$user_id]);
        }

        $logStmt = $pdo->prepare("UPDATE maintenance_logs SET user_id = NULL WHERE user_id = ?");
        $logStmt->execute([$user_id]);

        $delete = $pdo->prepare("DELETE FROM users WHERE user_id = ?");
        $delete->execute([$user_id]);

        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        response(false, "Unable to delete user from the database");
    }

    response(true, "User deleted successfully from the database");
}

function getTechnicians($pdo)
{
    $stmt = $pdo->query("
        SELECT
            u.user_id AS id,
            u.user_code,
            u.full_name AS name,
            u.phone AS phone_number,
            COALESCE(t.specialization, u.skills) AS skills,
            t.availability_status
        FROM users u
        LEFT JOIN technicians t ON u.user_id = t.user_id
        WHERE u.role = 'Technician' AND u.status = 'Active'
        ORDER BY full_name ASC
    ");

    response(true, "Technicians list", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function getAllUsers($pdo)
{
    $stmt = $pdo->query("
        SELECT
            u.user_id AS id,
            u.user_code,
            u.full_name AS name,
            u.email,
            u.phone AS phone_number,
            LOWER(u.role) AS role,
            LOWER(u.status) AS status,
            u.department_id,
            d.department_name,
            u.skills,
            t.specialization,
            t.experience_years,
            t.availability_status,
            u.must_change_password,
            u.created_at
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.department_id
        LEFT JOIN technicians t ON u.user_id = t.user_id
        WHERE u.role != 'Admin'
        ORDER BY u.created_at DESC
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

    $stmt = $pdo->prepare("UPDATE users SET password_hash = ?, must_change_password = 1 WHERE user_id = ?");
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

    $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE user_id = ? AND role != 'Admin'");
    $stmt->execute([ucfirst($status), $user_id]);

    response(true, "User status updated successfully");
}

?>
