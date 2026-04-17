<?php

require_once "config/database.php";
require_once "utils/Response.php";


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

    if (!$title || !$description) {
        response(false, "All fields are required");
    }

    $stmt = $pdo->prepare("
        INSERT INTO requests (title, description, student_id)
        VALUES (?, ?, ?)
    ");

    $stmt->execute([
        $title,
        $description,
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
        SELECT * FROM requests 
        WHERE student_id = ?
        ORDER BY created_at DESC
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
        SELECT r.*, u.name AS student_name
        FROM requests r
        JOIN users u ON r.student_id = u.id
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
        SET technician_id = ?, status = 'assigned'
        WHERE id = ?
    ");

    $stmt->execute([$technician_id, $request_id]);

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
    $progress = $_POST['progress_percentage'] ?? '';
    $message = $_POST['message'] ?? '';

    if (!$request_id || $progress === '' || !$message) {
        response(false, "Missing fields");
    }

    if ($progress < 0 || $progress > 100) {
        response(false, "Invalid progress value");
    }

    // Insert progress log
    $stmt = $pdo->prepare("
        INSERT INTO progress_updates (request_id, technician_id, progress_percentage, message)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->execute([
        $request_id,
        $_SESSION['user_id'],
        $progress,
        $message
    ]);

    // Auto-update request status
    $status = ($progress == 100) ? 'completed' : 'in_progress';

    $update = $pdo->prepare("
        UPDATE requests
        SET status = ?
        WHERE id = ?
    ");

    $update->execute([$status, $request_id]);

    response(true, "Progress updated");
}
function getRequestProgress($pdo)
{

    if (!isset($_SESSION['user_id'])) {
        response(false, "Unauthorized");
    }

    $request_id = $_GET['request_id'] ?? '';

    if (!$request_id) {
        response(false, "Request ID required");
    }

    $stmt = $pdo->prepare("
        SELECT p.*, u.name AS technician_name
        FROM progress_updates p
        JOIN users u ON p.technician_id = u.id
        WHERE p.request_id = ?
        ORDER BY p.created_at ASC
    ");

    $stmt->execute([$request_id]);

    response(true, "Progress history", $stmt->fetchAll(PDO::FETCH_ASSOC));
}
