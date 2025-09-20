<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Leer la configuración de la base de datos desde las variables de entorno
$host = getenv('DB_HOST') ?: 'db'; // 'db' es el nombre del servicio de Docker
$dbname = getenv('DB_DATABASE');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');
$charset = 'utf8mb4';

// Verificar que las variables de entorno se hayan cargado
if (!$dbname || !$username || !$password) {
    http_response_code(500);
    echo json_encode(['error' => 'La configuración de la base de datos no está completa. Asegúrate de que el archivo .env exista y esté configurado en docker-compose.yml.']);
    exit;
}

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    // No exponer detalles de la contraseña en el error
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
    exit;
}
