<?php

require_once "utils/Response.php";

function getAssignedRequests($pdo) {

    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'technician') {
        response(false, "Unauthorized");
    }

    $stmt = $pdo->prepare("
        SELECT r.*, u.name AS student_name
        FROM requests r
        JOIN users u ON r.student_id = u.id
        WHERE r.technician_id = ?
        ORDER BY r.created_at DESC
    ");

    $stmt->execute([$_SESSION['user_id']]);

    response(true, "Assigned requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}