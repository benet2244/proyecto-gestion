<?php
require 'config.php'; // Asegura que la conexión a la DB esté disponible

header('Content-Type: application/json');

// --- CONEXIÓN A LA BASE DE DATOS (Usando PDO) ---
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Error de conexión PDO: " . $e->getMessage());
    echo json_encode(['error' => 'Error de conexión a la base de datos.']);
    exit;
}

try {
    // Consulta para contar amenazas por tipo de incidente
    $sql = "SELECT 
                tipo_incidente, 
                COUNT(*) as count 
            FROM 
                detections 
            GROUP BY 
                tipo_incidente 
            ORDER BY 
                count DESC";

    $stmt = $pdo->query($sql);
    $analytics = $stmt->fetchAll();

    echo json_encode($analytics);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta de base de datos: ' . $e->getMessage()]);
}
