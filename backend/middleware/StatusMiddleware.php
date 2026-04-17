<?php

require_once "config/database.php";

function requireActiveUser($pdo)
{

    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (!isset($_SESSION['user_id'])) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT status FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user['status'] !== 'active') {
        session_destroy(); // 🔴 force logout
        echo json_encode([
            "success" => false,
            "message" => "Account inactive"
        ]);
        exit;
    }
}
