<?php
/*
 * Archivo de Configuración de la Base de Datos
 * --------------------------------------------
 *
 * Este archivo contiene la configuración para la conexión a la base de datos MySQL.
 * Rellena los valores de las variables con los detalles de tu servidor XAMPP.
 *
 */

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---

// El servidor donde se aloja tu base de datos (usualmente 'localhost' para XAMPP)
define('DB_SERVER', 'localhost');

// El nombre de usuario para acceder a la base de datos (usualmente 'root' para XAMPP)
define('DB_USERNAME', 'root');

// La contraseña del usuario de la base de datos (usualmente está vacía '' para XAMPP)
define('DB_PASSWORD', '');

// El nombre de la base de datos que creaste en phpMyAdmin
define('DB_NAME', 'nombre_de_tu_base_de_datos');


// --- INTENTO DE CONEXIÓN A LA BASE DE DATOS ---

/*
 * Crea la conexión a la base de datos MySQL usando la extensión mysqli.
 * La 'arroba' (@) antes de mysqli_connect suprime las advertencias de conexión
 * para poder manejarlas de forma personalizada.
 */
$mysqli = @new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Comprobar la conexión
if ($mysqli->connect_errno) {
    // Si hay un error, se termina el script y se muestra un mensaje de error.
    // En un entorno de producción, deberías registrar este error en lugar de mostrarlo.
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => 'Error de conexión a la base de datos',
        'message' => 'No se pudo conectar a MySQL: ' . $mysqli->connect_error
    ]);
    exit();
}

// Opcional: Establecer el juego de caracteres a UTF-8 para soportar acentos y caracteres especiales.
$mysqli->set_charset("utf8");


/*
 * ¡CONEXIÓN EXITOSA!
 * -------------------
 *
 * A partir de este punto, puedes incluir este archivo (`require_once 'config.php';`)
 * en tus otros scripts de backend para utilizar la variable `$mysqli` y realizar
 * consultas a la base de datos.
 *
 * Ejemplo de uso en otro archivo (ej. get_incidents.php):
 *
 *   <?php
 *   require_once 'config.php';
 *
 *   $result = $mysqli->query("SELECT * FROM incidents");
 *   // ... procesar el resultado
 *   ?>
 *
 */

?>
