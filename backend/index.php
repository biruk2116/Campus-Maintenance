<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

require_once "config/database.php";
require_once "utils/Response.php";
require_once "middleware/AuthMiddleware.php";
require_once "middleware/RoleMiddleware.php";
require_once "middleware/StatusMiddleware.php";

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

    case 'updateUser':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        updateUser($pdo);
        break;

    case 'deleteUser':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        deleteUser($pdo);
        break;

    case 'resetPassword':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        resetPassword($pdo);
        break;

    case 'resetUserPassword':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        resetUserPassword($pdo);
        break;

    case 'getAllUsers':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/UserController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        getAllUsers($pdo);
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

    case 'deleteRequest':
        requireAuth();
        requireRole(['admin', 'student']);
        requireActiveUser($pdo);

        require_once "controllers/RequestController.php";
        deleteRequest($pdo);
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
        require_once "controllers/TechnicianController.php";

        requireAuth();
        requireRole(['technician']);
        requireActiveUser($pdo);

        getAssignedRequests($pdo);
        break;

    case 'deactivateUser':
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

    case 'getNotificationCounts':
        require_once "controllers/RequestController.php";
        requireAuth();
        getNotificationCounts($pdo);
        break;

    case 'markNotificationsRead':
        require_once "controllers/RequestController.php";
        requireAuth();
        markNotificationsRead($pdo);
        break;

    case 'purgeRequests':
        require_once "middleware/RoleMiddleware.php";
        require_once "middleware/StatusMiddleware.php";
        require_once "controllers/RequestController.php";

        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);

        purgeRequests($pdo);
        break;

    default:
        echo json_encode([
            "success" => false,
            "message" => "Invalid route"
        ]);
        break;
}
