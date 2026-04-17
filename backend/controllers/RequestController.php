<?php

require_once "config/database.php";
require_once "utils/Response.php";


// ========================
// CREATE REQUEST (STUDENT)
// ========================
// ========================
// CREATE REQUEST (STUDENT)
// ========================
function createRequest($pdo)
{
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
        response(false, "Only students can create requests");
    }

    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';
    $location = $_POST['location'] ?? '';
    $priority = $_POST['priority'] ?? 'Medium';

    if (!$title || !$description || !$category || !$location) {
        response(false, "Title, Description, Category, and Location are required");
    }

    $stmt = $pdo->prepare("
        INSERT INTO requests (title, description, category, location, priority, student_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    ");

    $stmt->execute([
        $title,
        $description,
        $category,
        $location,
        $priority,
        $_SESSION['user_id']
    ]);

    response(true, "Request submitted successfully");
}

// ========================
// GET STUDENT REQUESTS
// ========================
function getStudentRequests($pdo)
{
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->prepare("
        SELECT r.*, u.name as technician_name 
        FROM requests r
        LEFT JOIN users u ON r.technician_id = u.id
        WHERE r.student_id = ?
        ORDER BY r.created_at DESC
    ");

    $stmt->execute([$_SESSION['user_id']]);

    response(true, "Student requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

// ========================
// GET ALL REQUESTS (ADMIN)
// ========================
function getAllRequests($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->query("
        SELECT r.*, s.name AS student_name, t.name AS technician_name
        FROM requests r
        JOIN users s ON r.student_id = s.id
        LEFT JOIN users t ON r.technician_id = t.id
        ORDER BY r.created_at DESC
    ");

    response(true, "All requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

// ========================
// ASSIGN TECHNICIAN (ADMIN)
// ========================
function assignTechnician($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $request_id = $_POST['request_id'] ?? '';
    $technician_id = $_POST['technician_id'] ?? '';

    if (!$request_id || !$technician_id) {
        response(false, "Missing data");
    }

    $stmt = $pdo->prepare("
        UPDATE requests
        SET technician_id = ?, status = 'Assigned'
        WHERE id = ?
    ");

    $stmt->execute([$technician_id, $request_id]);

    // Log the assignment
    $log = $pdo->prepare("INSERT INTO maintenance_logs (request_id, user_id, action_taken, remarks) VALUES (?, ?, ?, ?)");
    $log->execute([$request_id, $_SESSION['user_id'], 'Assigned Technician', 'Technician assigned by Admin']);

    response(true, "Technician assigned successfully");
}

// ========================
// TECHNICIAN UPDATE PROGRESS
// ========================
function updateProgress($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'technician') {
        response(false, "Unauthorized");
    }

    $request_id = $_POST['request_id'] ?? '';
    $progress = $_POST['progress_percentage'] ?? 0;
    $remarks = $_POST['remarks'] ?? '';
    $status = $_POST['status'] ?? 'In Progress';

    if (!$request_id) {
        response(false, "Request ID is required");
    }

    // Update maintenance_logs
    $stmt = $pdo->prepare("
        INSERT INTO maintenance_logs (request_id, user_id, action_taken, remarks, progress_percentage)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $request_id,
        $_SESSION['user_id'],
        'Updated Progress',
        $remarks,
        $progress
    ]);

    // Update request status and percentage
    $update = $pdo->prepare("
        UPDATE requests
        SET status = ?, progress_percentage = ?
        WHERE id = ?
    ");

    $update->execute([$status, $progress, $request_id]);

    response(true, "Progress updated successfully");
}

// ========================
// GET REQUEST PROGRESS HISTORY
// ========================
function getRequestProgress($pdo)
{
    if (!isset($_SESSION['user_id'])) {
        response(false, "Unauthorized");
    }

    $request_id = $_GET['request_id'] ?? $_POST['request_id'] ?? '';

    if (!$request_id) {
        response(false, "Request ID required");
    }

    $stmt = $pdo->prepare("
        SELECT l.*, u.name AS action_by
        FROM maintenance_logs l
        JOIN users u ON l.user_id = u.id
        WHERE l.request_id = ?
        ORDER BY l.created_at DESC
    ");

    $stmt->execute([$request_id]);

    response(true, "Progress history", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

// ========================
// DELETE REQUEST (ADMIN ONLY)
// ========================
function deleteRequest($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $id = $_POST['id'] ?? '';
    if (!$id) {
        response(false, "ID required");
    }

    $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ?");
    $stmt->execute([$id]);

    response(true, "Request deleted successfully");
}
