<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DEL BACKUP ---

// Nombre de la tabla que queremos respaldar
$tableName = 'incidents';

// Nombre del archivo de backup
$backupFile = 'backup_incidents_' . date("Y-m-d_H-i-s") . '.sql';

// --- VALIDACIÓN DE SEGURIDAD (BÁSICA) ---
// En un entorno de producción, asegúrate de que solo usuarios autenticados
// y con los permisos adecuados puedan ejecutar este script.


// --- CONSTRUCCIÓN DEL COMANDO MYSqldump ---

// NOTA: Es crucial que las credenciales (DB_USER, DB_PASS) no contengan caracteres
// que puedan ser mal interpretados por la shell. Usa escapeshellarg.
$command = sprintf(
    'mysqldump --user=%s --password=%s --host=%s %s %s > %s',
    escapeshellarg(getenv('DB_USER')),
    escapeshellarg(getenv('DB_PASSWORD')),
    escapeshellarg(getenv('DB_HOST')),
    escapeshellarg(getenv('DB_DATABASE')),
    escapeshellarg($tableName),
    escapeshellarg($backupFile)
);

// --- EJECUCIÓN Y DESCARGA ---

// Ejecutar el comando. La salida (stdout) se redirige al archivo de backup.
// stderr se redirige a una variable para capturar errores.
$output = null;
$return_var = null;
shell_exec($command . ' 2>&1'); // Captura stdout y stderr

// Verificar si el archivo de backup se creó correctamente
if (file_exists($backupFile)) {
    // Preparar las cabeceras para forzar la descarga
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($backupFile) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($backupFile));

    // Limpiar el buffer de salida antes de leer el archivo
    ob_clean();
    flush();

    // Leer el archivo y enviarlo al buffer de salida
    readfile($backupFile);

    // Eliminar el archivo de backup del servidor después de la descarga
    unlink($backupFile);

    exit();
} else {
    // Si el archivo no se creó, hubo un error con mysqldump
    http_response_code(500);
    echo "Error: No se pudo generar el archivo de backup.";
    if (isset($output)) {
        echo "\nDetalles del error:\n" . $output;
    }
}

?>
