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
$result = $mysqli->query("SELECT * FROM incidents ORDER BY reportedAt DESC");
if (!$result) {
    die('Error al obtener los incidentes: ' . $mysqli->error);
}

// --- GENERACIÓN DEL CSV ---

$filename = "incidentes_" . date('Y-m-d') . ".csv";

// Cabeceras para forzar la descarga del archivo
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Crear un puntero de archivo en memoria para la salida de PHP
$output = fopen('php://output', 'w');

// Escribir la fila de encabezados del CSV
fputcsv($output, [
    'ID',
    'Título',
    'Descripción',
    'Gravedad',
    'Estado',
    'Fecha de Reporte',
    'Asignación de Workstream'
]);

// Iterar sobre los resultados de la base de datos y escribir cada fila en el CSV
while ($row = $result->fetch_assoc()) {
    // Convertir datos complejos (como JSON) a una cadena legible para el CSV
    $workstreamAssignment = isset($row['workstreamAssignment']) ? json_decode($row['workstreamAssignment']) : null;
    $workstream_str = '';
    if (is_object($workstreamAssignment)) {
        $assignments = [];
        foreach ($workstreamAssignment as $role => $name) {
            if (!empty($name)) {
                $assignments[] = ucfirst($role) . ": " . $name;
            }
        }
        $workstream_str = implode("; ", $assignments);
    }

    fputcsv($output, [
        $row['id'],
        $row['title'],
        $row['description'],
        $row['severity'],
        $row['status'],
        $row['reportedAt'],
        $workstream_str
    ]);
}

// Cerrar el puntero del archivo
fclose($output);

// Cerrar la conexión a la base de datos
$mysqli->close();

exit();
?>
