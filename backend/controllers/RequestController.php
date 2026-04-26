<?php

require_once __DIR__ . "/../utils/Response.php";

function getUserSnapshotById($pdo, $user_id)
{
    $stmt = $pdo->prepare("
        SELECT id, user_code, name, email, phone_number, role, skills
        FROM users
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$user_id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function clampProgress($progress)
{
    $value = (int)$progress;
    if ($value < 0) {
        return 0;
    }
    if ($value > 100) {
        return 100;
    }
    return $value;
}

function getRequestById($pdo, $request_id)
{
    $stmt = $pdo->prepare("
        SELECT *
        FROM requests
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$request_id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createMaintenanceLog($pdo, $request_id, $user_id, $action, $remarks, $progress = null)
{
    $actor = $user_id ? getUserSnapshotById($pdo, $user_id) : null;

    $stmt = $pdo->prepare("
        INSERT INTO maintenance_logs (request_id, user_id, actor_name, actor_role, actor_code, action_taken, remarks, progress_percentage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $request_id,
        $user_id ?: null,
        $actor['name'] ?? ($_SESSION['name'] ?? null),
        $actor['role'] ?? ($_SESSION['role'] ?? null),
        $actor['user_code'] ?? ($_SESSION['user_code'] ?? null),
        $action,
        $remarks,
        $progress
    ]);
}

function createRequest($pdo)
{
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $dorm = trim($_POST['dorm'] ?? '');
    $block = trim($_POST['block'] ?? '');
    $priority = $_POST['priority'] ?? 'Medium';

    if (!$location && $dorm && $block) {
        $location = "{$dorm}, Block {$block}";
    }

    if (!$title || !$description || !$category || !$location) {
        response(false, "Title, description, category, and location are required");
    }

    if (!$dorm || !$block) {
        response(false, "Dorm and block are required");
    }

    $student = getUserSnapshotById($pdo, $_SESSION['user_id']);
    if (!$student) {
        response(false, "Student account not found");
    }

    $allowedPriorities = ['Low', 'Medium', 'High', 'Emergency'];
    if (!in_array($priority, $allowedPriorities, true)) {
        $priority = 'Medium';
    }

    $stmt = $pdo->prepare("
        INSERT INTO requests (
            title,
            description,
            category,
            dorm,
            block,
            location,
            priority,
            student_id,
            status,
            progress_percentage,
            admin_seen,
            tech_seen,
            student_seen,
            student_hidden,
            student_name_snapshot,
            student_code_snapshot,
            student_phone_snapshot,
            student_email_snapshot
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 0, 0, 1, 1, 0, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $title,
        $description,
        $category,
        $dorm,
        $block,
        $location,
        $priority,
        $_SESSION['user_id'],
        $student['name'],
        $student['user_code'],
        $student['phone_number'] ?: null,
        $student['email'] ?: null
    ]);

    $requestId = (int)$pdo->lastInsertId();
    createMaintenanceLog($pdo, $requestId, $_SESSION['user_id'], 'Request Submitted', 'Student submitted a new maintenance request', 0);

    response(true, "Request submitted successfully", [
        "request_id" => $requestId
    ]);
}

function getStudentRequests($pdo)
{
    $stmt = $pdo->prepare("
        SELECT
            r.*,
            COALESCE(t.name, r.technician_name_snapshot) AS technician_name,
            COALESCE(t.skills, r.technician_skills_snapshot) AS technician_skills,
            COALESCE(t.phone_number, r.technician_phone_snapshot) AS technician_phone
        FROM requests r
        LEFT JOIN users t ON r.technician_id = t.id
        WHERE r.student_id = ? AND r.student_hidden = 0
        ORDER BY
            CASE
                WHEN r.status = 'Pending' THEN 1
                WHEN r.status = 'Assigned' THEN 2
                WHEN r.status = 'In Progress' THEN 3
                WHEN r.status = 'On Hold' THEN 4
                WHEN r.status = 'Completed' THEN 5
                ELSE 6
            END,
            r.updated_at DESC
    ");

    $stmt->execute([$_SESSION['user_id']]);

    response(true, "Student requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function getAllRequests($pdo)
{
    $stmt = $pdo->query("
        SELECT
            r.*,
            COALESCE(s.name, r.student_name_snapshot) AS student_name,
            COALESCE(s.user_code, r.student_code_snapshot) AS student_code,
            COALESCE(s.phone_number, r.student_phone_snapshot) AS student_phone,
            COALESCE(t.name, r.technician_name_snapshot) AS technician_name,
            COALESCE(t.user_code, r.technician_code_snapshot) AS technician_code,
            COALESCE(t.phone_number, r.technician_phone_snapshot) AS technician_phone,
            COALESCE(t.skills, r.technician_skills_snapshot) AS technician_skills
        FROM requests r
        LEFT JOIN users s ON r.student_id = s.id
        LEFT JOIN users t ON r.technician_id = t.id
        ORDER BY
            CASE
                WHEN r.status = 'Pending' THEN 1
                WHEN r.status = 'Assigned' THEN 2
                WHEN r.status = 'In Progress' THEN 3
                WHEN r.status = 'On Hold' THEN 4
                WHEN r.status = 'Completed' THEN 5
                ELSE 6
            END,
            r.updated_at DESC
    ");

    response(true, "All requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function assignTechnician($pdo)
{
    $request_id = $_POST['request_id'] ?? '';
    $technician_id = $_POST['technician_id'] ?? '';

    if (!$request_id || !$technician_id) {
        response(false, "Request and technician are required");
    }

    $request = getRequestById($pdo, $request_id);
    if (!$request) {
        response(false, "Request not found");
    }

    if ($request['status'] === 'Completed') {
        response(false, "Completed requests cannot be reassigned");
    }

    $techStmt = $pdo->prepare("
        SELECT id, user_code, name, email, phone_number, skills
        FROM users
        WHERE id = ? AND role = 'technician' AND status = 'active'
        LIMIT 1
    ");
    $techStmt->execute([$technician_id]);
    $technician = $techStmt->fetch(PDO::FETCH_ASSOC);

    if (!$technician) {
        response(false, "Selected technician is not available");
    }

    $progress = max((int)$request['progress_percentage'], 10);
    $stmt = $pdo->prepare("
        UPDATE requests
        SET technician_id = ?, status = 'Assigned', progress_percentage = ?, tech_seen = 0, admin_seen = 1, student_seen = 0,
            technician_name_snapshot = ?, technician_code_snapshot = ?, technician_phone_snapshot = ?, technician_email_snapshot = ?, technician_skills_snapshot = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $technician_id,
        $progress,
        $technician['name'],
        $technician['user_code'],
        $technician['phone_number'] ?: null,
        $technician['email'] ?: null,
        $technician['skills'] ?: null,
        $request_id
    ]);

    createMaintenanceLog(
        $pdo,
        $request_id,
        $_SESSION['user_id'],
        'Technician Assigned',
        "Assigned to {$technician['name']} ({$technician['skills']})",
        $progress
    );

    response(true, "Technician assigned successfully");
}

function updateProgress($pdo)
{
    $request_id = $_POST['request_id'] ?? '';
    $progress = clampProgress($_POST['progress_percentage'] ?? 0);
    $remarks = trim($_POST['remarks'] ?? '');
    $status = $_POST['status'] ?? 'In Progress';

    if (!$request_id) {
        response(false, "Request ID is required");
    }

    if (!$remarks) {
        response(false, "Remarks are required");
    }

    $allowedStatuses = ['Assigned', 'In Progress', 'On Hold', 'Completed'];
    if (!in_array($status, $allowedStatuses, true)) {
        $status = 'In Progress';
    }

    $request = getRequestById($pdo, $request_id);
    if (!$request) {
        response(false, "Request not found");
    }

    if ((int)$request['technician_id'] !== (int)$_SESSION['user_id']) {
        response(false, "You can only update requests assigned to you");
    }

    if ($status === 'Completed') {
        $progress = 100;
    } elseif ($progress === 100) {
        $status = 'Completed';
    } elseif ($status === 'Assigned' && $progress > 0) {
        $status = 'In Progress';
    }

    $update = $pdo->prepare("
        UPDATE requests
        SET status = ?, progress_percentage = ?, admin_seen = 0, tech_seen = 1, student_seen = 0
        WHERE id = ?
    ");
    $update->execute([$status, $progress, $request_id]);

    $action = $status === 'Completed' ? 'Request Completed' : 'Progress Updated';
    createMaintenanceLog($pdo, $request_id, $_SESSION['user_id'], $action, $remarks, $progress);

    response(true, "Progress updated successfully");
}

function getRequestProgress($pdo)
{
    $request_id = $_GET['request_id'] ?? $_POST['request_id'] ?? '';

    if (!$request_id) {
        response(false, "Request ID required");
    }

    $request = getRequestById($pdo, $request_id);
    if (!$request) {
        response(false, "Request not found");
    }

    $role = $_SESSION['role'];
    $userId = (int)$_SESSION['user_id'];

    $authorized = $role === 'admin'
        || ($role === 'student' && (int)$request['student_id'] === $userId)
        || ($role === 'technician' && (int)$request['technician_id'] === $userId);

    if (!$authorized) {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->prepare("
        SELECT l.*, u.name AS action_by
        FROM maintenance_logs l
        LEFT JOIN users u ON l.user_id = u.id
        WHERE l.request_id = ?
        ORDER BY l.created_at DESC, l.id DESC
    ");

    $stmt->execute([$request_id]);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $logs = array_map(function ($log) {
        if (!$log['action_by']) {
            $log['action_by'] = $log['actor_name'] ?: 'Former user';
        }
        return $log;
    }, $logs);

    response(true, "Progress history", $logs);
}

function deleteRequest($pdo)
{
    $id = $_POST['id'] ?? '';

    if (!$id) {
        response(false, "Request ID required");
    }

    $request = getRequestById($pdo, $id);
    if (!$request) {
        response(false, "Request not found");
    }

    $role = $_SESSION['role'];
    $user_id = (int)$_SESSION['user_id'];

    if ($role === 'admin') {
        if ($request['status'] !== 'Completed') {
            response(false, "Only completed requests can be deleted");
        }

        $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ?");
        $stmt->execute([$id]);

        response(true, "Completed request deleted successfully");
    }

    if ($role === 'student') {
        $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ? AND student_id = ?");
        $stmt->execute([$id, $user_id]);

        if ($stmt->rowCount() === 0) {
            response(false, "You can only delete your own requests");
        }

        response(true, "Request deleted successfully");
    }

    if ($role === 'technician') {
        $stmt = $pdo->prepare("
            DELETE FROM requests
            WHERE id = ? AND technician_id = ? AND status = 'Completed'
        ");
        $stmt->execute([$id, $user_id]);

        if ($stmt->rowCount() === 0) {
            response(false, "You can only delete completed tasks from your history");
        }

        response(true, "Completed task deleted successfully");
    }

    response(false, "Unauthorized");
}

function getNotificationCounts($pdo)
{
    $role = $_SESSION['role'];
    $userId = (int)$_SESSION['user_id'];
    $count = 0;

    if ($role === 'admin') {
        $stmt = $pdo->query("SELECT COUNT(*) FROM requests WHERE admin_seen = 0");
        $count = (int)$stmt->fetchColumn();
    } elseif ($role === 'technician') {
        $stmt = $pdo->prepare("
            SELECT COUNT(*)
            FROM requests
            WHERE technician_id = ? AND tech_seen = 0 AND status != 'Completed'
        ");
        $stmt->execute([$userId]);
        $count = (int)$stmt->fetchColumn();
    } elseif ($role === 'student') {
        $stmt = $pdo->prepare("
            SELECT COUNT(*)
            FROM requests
            WHERE student_id = ? AND student_seen = 0 AND student_hidden = 0
        ");
        $stmt->execute([$userId]);
        $count = (int)$stmt->fetchColumn();
    }

    response(true, "Notification counts", ["unread" => $count]);
}

function markNotificationsRead($pdo)
{
    $role = $_SESSION['role'];
    $userId = (int)$_SESSION['user_id'];

    if ($role === 'admin') {
        $stmt = $pdo->prepare("UPDATE requests SET admin_seen = 1 WHERE admin_seen = 0");
        $stmt->execute();
    } elseif ($role === 'technician') {
        $stmt = $pdo->prepare("
            UPDATE requests
            SET tech_seen = 1
            WHERE technician_id = ? AND tech_seen = 0
        ");
        $stmt->execute([$userId]);
    } elseif ($role === 'student') {
        $stmt = $pdo->prepare("
            UPDATE requests
            SET student_seen = 1
            WHERE student_id = ? AND student_hidden = 0 AND student_seen = 0
        ");
        $stmt->execute([$userId]);
    }

    response(true, "Notifications marked as read");
}

function purgeRequests($pdo)
{
    $stmt = $pdo->prepare("DELETE FROM requests WHERE status = 'Completed'");
    $stmt->execute();

    response(true, "All completed requests were deleted");
}

?>
