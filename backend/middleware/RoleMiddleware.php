<?php

function requireRole($roles = []) {

    if (!isset($_SESSION['role'])) {
        echo json_encode([
            "success" => false,
            "message" => "Role not found"
        ]);
        exit;
    }

    if (!in_array($_SESSION['role'], $roles)) {
        echo json_encode([
            "success" => false,
            "message" => "Access denied"
        ]);
        exit;
    }
}

?>