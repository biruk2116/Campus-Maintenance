<?php

require_once __DIR__ . "/../utils/Response.php";

function getAssignedRequests($pdo)
{
    $stmt = $pdo->prepare("
        SELECT
            r.*,
            COALESCE(u.name, r.student_name_snapshot) AS student_name,
            COALESCE(u.user_code, r.student_code_snapshot) AS student_code,
            COALESCE(u.phone_number, r.student_phone_snapshot) AS student_phone
        FROM requests r
        LEFT JOIN users u ON r.student_id = u.id
        WHERE r.technician_id = ?
        ORDER BY
            CASE
                WHEN r.status = 'Assigned' THEN 1
                WHEN r.status = 'In Progress' THEN 2
                WHEN r.status = 'On Hold' THEN 3
                WHEN r.status = 'Completed' THEN 4
                ELSE 5
            END,
            r.updated_at DESC
    ");

    $stmt->execute([$_SESSION['user_id']]);

    response(true, "Assigned requests", $stmt->fetchAll(PDO::FETCH_ASSOC));
}

?>
