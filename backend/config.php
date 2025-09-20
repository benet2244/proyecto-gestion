<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Cargar variables de entorno desde el archivo .env en la raíz del proyecto
// Asegúrate de que la librería vlucas/phpdotenv esté instalada vía Composer
// require_once __DIR__ . '/../vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
// $dotenv->load();


// Definir constantes para la conexión a la base de datos
// Estas variables se leerán desde el entorno de Docker Compose
define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_NAME', getenv('DB_DATABASE'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASS', getenv('DB_PASSWORD'));

// Verificar que las variables de entorno se hayan cargado
if (!DB_NAME || !DB_USER || !DB_PASS) {
    http_response_code(500);
    // No expongas detalles sensibles en producción
    error_log("Error: La configuración de la base de datos no está completa en las variables de entorno.");
    echo json_encode(['error' => 'Error interno del servidor. La configuración de la base de datos está incompleta.']);
    exit;
}
