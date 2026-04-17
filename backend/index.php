<?php

require_once "config/database.php";
require_once "utils/Response.php";
require_once "middleware/AuthMiddleware.php";

header('Content-Type: application/json; charset=utf-8');

$rawBody = file_get_contents('php://input');
if ($rawBody) {
    $jsonData = json_decode($rawBody, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($jsonData)) {
        $_POST = array_merge($_POST, $jsonData);
        $_REQUEST = array_merge($_REQUEST, $jsonData);
    }
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        require_once "controllers/AuthController.php";
        login($pdo);
        break;

    case 'createRequest':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['student']);
        requireActiveUser($pdo);

        createRequest($pdo);
        break;

    case 'getStudentRequests':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['student']);
        requireActiveUser($pdo);

        getStudentRequests($pdo);
        break;

    case 'createUser':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        createUser($pdo);
        break;

    case 'assignTechnician':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        assignTechnician($pdo);
        break;

    case 'getAllRequests':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        getAllRequests($pdo);
        break;

    case 'updateProgress':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['technician']);
        requireActiveUser($pdo);

        updateProgress($pdo);
        break;

    case 'logout':
        require_once "controllers/AuthController.php";
        logout();
        break;

    case 'checkSession':
        require_once "controllers/AuthController.php";
        checkSession();
        break;

    case 'changePassword':
        require_once "controllers/AuthController.php";
        requireAuth();
        requireActiveUser($pdo);
        changePassword($pdo);
        break;

    case 'getAssignedRequests':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/TechnicianController.php";

        requireAuth();
        requireRole(['technician']);
        requireActiveUser($pdo);

        getAssignedRequests($pdo);
        break;

    case 'deactivateUser':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        deactivateUser($pdo);
        break;

    case 'getRequestProgress':
        require_once "controllers/RequestController.php";

        requireAuth();
        requireActiveUser($pdo);

        getRequestProgress($pdo);
        break;

    case 'getTechnicians':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        getTechnicians($pdo);
        break;

    default:
        echo json_encode([
            "success" => false,
            "message" => "Invalid route"
        ]);
        break;
}
