<?php

require_once __DIR__ . "/../utils/Response.php";

function getAssignedRequests($pdo)
{
    $stmt = $pdo->prepare("
        SELECT
            r.*,
            mr.asset_id,
            mr.location_id,
            a.asset_name,
            a.serial_number,
            a.condition_status,
            l.location_type,
            b.building_name,
            l.room_number,
            COALESCE(u.full_name, r.student_name_snapshot) AS student_name,
            COALESCE(u.user_code, r.student_code_snapshot) AS student_code,
            COALESCE(u.phone, r.student_phone_snapshot) AS student_phone
        FROM requests r
        LEFT JOIN maintenance_requests mr ON r.maintenance_request_id = mr.request_id
        LEFT JOIN assets a ON mr.asset_id = a.asset_id
        LEFT JOIN locations l ON mr.location_id = l.location_id
        LEFT JOIN buildings b ON l.building_id = b.building_id
        LEFT JOIN users u ON r.student_id = u.user_id
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
