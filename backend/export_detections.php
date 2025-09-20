<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONEXIÓN A LA BASE DE DATOS ---
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($mysqli->connect_error) {
    die('Error de conexión a la base de datos: ' . $mysqli->connect_error);
}
$mysqli->set_charset("utf8");

// --- OBTENCIÓN DE DATOS ---
$result = $mysqli->query("SELECT * FROM detections ORDER BY fecha_incidente DESC");
if (!$result) {
    die('Error al obtener las detecciones: ' . $mysqli->error);
}

// --- GENERACIÓN DEL CSV ---
$filename = "detecciones_" . date('Y-m-d') . ".csv";

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$output = fopen('php://output', 'w');

fputcsv($output, [
    'ID', 'Tipo de Incidente', 'Prioridad', 'Fecha', 'Responsable', 
    'Equipo Afectado', 'Dirección MAC', 'Dependencia', 'Estado del Equipo', 
    'Acciones Tomadas', 'Hash', 'Detalles', 'Estado', 'Nivel de Amenaza'
]);

while ($row = $result->fetch_assoc()) {
    fputcsv($output, [
        $row['id'],
        $row['tipo_incidente'],
        $row['prioridad'],
        $row['fecha_incidente'],
        $row['responsable'],
        $row['equipo_afectado'],
        $row['direccion_mac'],
        $row['dependencia'],
        $row['estado_equipo'],
        $row['acciones_tomadas'],
        $row['hash'],
        $row['detalles'],
        $row['estado'],
        $row['nivel_amenaza']
    ]);
}

fclose($output);
$mysqli->close();
exit();
?>
