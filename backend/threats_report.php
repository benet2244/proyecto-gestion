<?php
require 'config.php';

header('Content-Type: application/json');

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

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action === 'export_csv') {
        exportDetectionsToCSV($pdo);
    } elseif ($action === 'backup_sql') {
        backupDetectionsToSQL($pdo);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'No se especificó ninguna acción']);
}

function exportDetectionsToCSV($pdo) {
    $filename = 'detections_export_' . date("Y-m-d") . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    $output = fopen('php://output', 'w');
    
    // Encabezados del CSV
    fputcsv($output, ['ID', 'Tipo Incidente', 'Prioridad', 'Fecha', 'Responsable', 'Equipo Afectado', 'MAC', 'Dependencia', 'Estado Equipo', 'Acciones', 'Hash', 'Nivel Amenaza', 'Detalles', 'Estado']);

    try {
        $stmt = $pdo->query("SELECT * FROM detections ORDER BY fecha_incidente DESC");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            fputcsv($output, $row);
        }
    } catch (PDOException $e) {
        // No se puede cambiar el header aquí, pero se puede loggear el error.
        error_log("Error al exportar a CSV: " . $e->getMessage());
    }
    
    fclose($output);
    exit;
}

function backupDetectionsToSQL($pdo) {
    $filename = 'detections_backup_' . date("Y-m-d_H-i-s") . '.sql';
    header('Content-Type: application/sql; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');

    try {
        $output = "-- Backup de la tabla 'detections' el " . date("Y-m-d H:i:s") . " --\n\n";

        // Estructura de la tabla
        $output .= "DROP TABLE IF EXISTS `detections`;\n";
        $stmt = $pdo->query("SHOW CREATE TABLE detections");
        $tableStructure = $stmt->fetch(PDO::FETCH_ASSOC);
        $output .= $tableStructure['Create Table'] . ";\n\n";

        // Datos de la tabla
        $stmt = $pdo->query("SELECT * FROM detections");
        if ($stmt->rowCount() > 0) {
            $output .= "-- Volcado de datos para la tabla `detections` --\n";
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $output .= "INSERT INTO `detections` VALUES (";
                $values = [];
                foreach ($row as $value) {
                    $values[] = $pdo->quote($value);
                }
                $output .= implode(", ", $values) . ");\n";
            }
        }
        echo $output;

    } catch (PDOException $e) {
        error_log("Error al hacer backup SQL: " . $e->getMessage());
        // Devuelve un error simple si aún no se ha enviado salida
        if (!headers_sent()) {
            http_response_code(500);
            echo "-- ERROR: " . $e->getMessage();
        }
    }
    exit;
}
