<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DEL BACKUP ---
$tableName = 'detections';
$backupFile = 'backup_detections_' . date("Y-m-d_H-i-s") . '.sql';

// --- CONSTRUCCIÓN DEL COMANDO MYSqldump ---
$command = sprintf(
    'mysqldump --user=%s --password=%s --host=%s %s %s > %s',
    escapeshellarg(DB_USER),
    escapeshellarg(DB_PASS),
    escapeshellarg(DB_HOST),
    escapeshellarg(DB_NAME),
    escapeshellarg($tableName),
    escapeshellarg($backupFile)
);

// --- EJECUCIÓN Y DESCARGA ---
shell_exec($command . ' 2>&1');

if (file_exists($backupFile)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($backupFile) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($backupFile));

    ob_clean();
    flush();

    readfile($backupFile);

    unlink($backupFile);

    exit();
} else {
    http_response_code(500);
    echo "Error: No se pudo generar el archivo de backup.";
}
?>