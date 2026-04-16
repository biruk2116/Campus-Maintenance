<?php

function requireAuth() {

    session_start();

    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "success" => false,
            "message" => "Authentication required"
        ]);
        exit;
    }
}

?>