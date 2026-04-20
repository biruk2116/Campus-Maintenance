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
        INSERT INTO requests (title, description, category, location, priority, student_id, status, admin_seen)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', 0)
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
        SELECT r.*, u.name as technician_name, u.skills as technician_skills, u.phone_number as technician_phone
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
        SELECT r.*, s.name AS student_name, t.name AS technician_name, t.skills AS technician_skills
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
        SET technician_id = ?, status = 'Assigned', tech_seen = 0
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

    $role = $_SESSION['role'];
    $user_id = $_SESSION['user_id'];

    if ($role === 'admin') {
        $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        // Students can only delete their OWN requests IF they are COMPLETED
        $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ? AND student_id = ? AND status = 'Completed'");
        $stmt->execute([$id, $user_id]);

        if ($stmt->rowCount() === 0) {
            response(false, "Unauthorized: Self-purge only allowed for completed personal orders.");
        }
    }

    response(true, "Request purged successfully");
}

// ========================
// GET NOTIFICATION COUNTS
// ========================
function getNotificationCounts($pdo)
{
    if (!isset($_SESSION['user_id'])) {
        response(false, "Unauthorized");
    }

    $role = $_SESSION['role'];
    $userId = $_SESSION['user_id'];
    $count = 0;

    if ($role === 'admin') {
        $stmt = $pdo->query("SELECT COUNT(*) FROM requests WHERE admin_seen = 0 AND status = 'Pending'");
        $count = $stmt->fetchColumn();
    } elseif ($role === 'technician') {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM requests WHERE technician_id = ? AND tech_seen = 0");
        $stmt->execute([$userId]);
        $count = $stmt->fetchColumn();
    }

    response(true, "Notification counts", ["unread" => (int)$count]);
}

// ========================
// MARK NOTIFICATIONS AS READ
// ========================
function markNotificationsRead($pdo)
{
    if (!isset($_SESSION['user_id'])) {
        response(false, "Unauthorized");
    }

    $role = $_SESSION['role'];
    $userId = $_SESSION['user_id'];

    if ($role === 'admin') {
        $stmt = $pdo->query("UPDATE requests SET admin_seen = 1 WHERE admin_seen = 0");
    } elseif ($role === 'technician') {
        $stmt = $pdo->prepare("UPDATE requests SET tech_seen = 1 WHERE technician_id = ? AND tech_seen = 0");
        $stmt->execute([$userId]);
    }

    response(true, "Notifications marked as read");
}

// ========================
// PURGE COMPLETED REQUESTS (ADMIN ONLY)
// ========================
function purgeRequests($pdo)
{
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->prepare("DELETE FROM requests WHERE status = 'Completed'");
    $stmt->execute();

    response(true, "All completed operations have been purged from the grid.");
}
