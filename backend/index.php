<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/utils/Response.php";
require_once __DIR__ . "/middleware/AuthMiddleware.php";
require_once __DIR__ . "/middleware/RoleMiddleware.php";
require_once __DIR__ . "/middleware/StatusMiddleware.php";

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
        require_once __DIR__ . "/controllers/AuthController.php";
        login($pdo);
        break;

    case 'logout':
        require_once __DIR__ . "/controllers/AuthController.php";
        logout();
        break;

    case 'checkSession':
        require_once __DIR__ . "/controllers/AuthController.php";
        checkSession($pdo);
        break;

    case 'changePassword':
        require_once __DIR__ . "/controllers/AuthController.php";
        changePassword($pdo);
        break;

    case 'createRequest':
        requireAuth();
        requireRole(['student']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        createRequest($pdo);
        break;

    case 'getStudentRequests':
        requireAuth();
        requireRole(['student']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        getStudentRequests($pdo);
        break;

    case 'createUser':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        createUser($pdo);
        break;

    case 'updateUser':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        updateUser($pdo);
        break;

    case 'deleteUser':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        deleteUser($pdo);
        break;

    case 'resetPassword':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        resetPassword($pdo);
        break;

    case 'resetUserPassword':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        resetUserPassword($pdo);
        break;

    case 'getAllUsers':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        getAllUsers($pdo);
        break;

    case 'deactivateUser':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        deactivateUser($pdo);
        break;

    case 'getTechnicians':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/UserController.php";
        getTechnicians($pdo);
        break;

    case 'assignTechnician':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        assignTechnician($pdo);
        break;

    case 'getAllRequests':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        getAllRequests($pdo);
        break;

    case 'deleteRequest':
        requireAuth();
        requireRole(['admin', 'student']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        deleteRequest($pdo);
        break;

    case 'updateProgress':
        requireAuth();
        requireRole(['technician']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        updateProgress($pdo);
        break;

    case 'getAssignedRequests':
        requireAuth();
        requireRole(['technician']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/TechnicianController.php";
        getAssignedRequests($pdo);
        break;

    case 'getRequestProgress':
        requireAuth();
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        getRequestProgress($pdo);
        break;

    case 'getNotificationCounts':
        requireAuth();
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        getNotificationCounts($pdo);
        break;

    case 'markNotificationsRead':
        requireAuth();
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        markNotificationsRead($pdo);
        break;

    case 'purgeRequests':
        requireAuth();
        requireRole(['admin']);
        requireActiveUser($pdo);
        require_once __DIR__ . "/controllers/RequestController.php";
        purgeRequests($pdo);
        break;

    default:
        response(false, "Invalid route");
}

?>
