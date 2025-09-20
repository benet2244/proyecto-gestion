<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// Establecer el encabezado de la respuesta a JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // PERMITIR CROSS-ORIGIN (SOLO PARA DESARROLLO)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar solicitudes OPTIONS (pre-flight) para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Obtener el método de la solicitud (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];

// Obtener el ID del incidente si se proporciona en la URL (ej. /incidents.php?id=INC-001)
$id = isset($_GET['id']) ? $mysqli->real_escape_string($_GET['id']) : null;


// --- LÓGICA PARA MANEJAR LAS SOLICITUDES ---

switch ($method) {
    case 'GET':
        if ($id) {
            // --- OBTENER UN SOLO INCIDENTE ---
            $result = $mysqli->query("SELECT * FROM incidents WHERE id = '$id'");
            if ($result && $result->num_rows > 0) {
                $incident = $result->fetch_assoc();
                // NOTA: Los campos JSON (como 'updates', 'systems', etc.) necesitarán ser decodificados
                // Ejemplo: $incident['updates'] = json_decode($incident['updates']);
                echo json_encode($incident);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Incidente no encontrado']);
            }
        } else {
            // --- OBTENER TODOS LOS INCIDENTES ---
            $result = $mysqli->query("SELECT * FROM incidents ORDER BY reportedAt DESC");
            $incidents = [];
            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    // NOTA: También decodificar campos JSON aquí si es necesario
                    $incidents[] = $row;
                }
            }
            echo json_encode($incidents);
        }
        break;

    case 'POST':
        // --- CREAR UN NUEVO INCIDENTE ---
        $data = json_decode(file_get_contents('php://input'), true);

        // Validar y escapar los datos (¡MUY IMPORTANTE!)
        $title = $mysqli->real_escape_string($data['title']);
        $description = $mysqli->real_escape_string($data['description']);
        $severity = $mysqli->real_escape_string($data['severity']);
        // ... escapar todos los demás campos ...

        // Los campos complejos como arrays u objetos se guardan como JSON
        $workstreamAssignment_json = json_encode($data['workstreamAssignment']);

        // Generar un nuevo ID (ej. INC-006)
        // Esta es una forma simple, en producción podrías usar UUIDs o autoincremento
        $count_result = $mysqli->query("SELECT COUNT(*) as total FROM incidents");
        $count_row = $count_result->fetch_assoc();
        $new_id_num = $count_row['total'] + 1;
        $new_id = 'INC-' . str_pad($new_id_num, 3, '0', STR_PAD_LEFT);
        
        $reportedAt = date('Y-m-d H:i:s'); // Fecha y hora actual

        $sql = "INSERT INTO incidents (id, title, description, severity, status, reportedAt, workstreamAssignment) VALUES ('$new_id', '$title', '$description', '$severity', 'Identificación', '$reportedAt', '$workstreamAssignment_json')";

        if ($mysqli->query($sql)) {
            http_response_code(201);
            $data['id'] = $new_id; // Devolver el nuevo incidente con su ID
            $data['reportedAt'] = $reportedAt;
            echo json_encode($data);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el incidente: ' . $mysqli->error]);
        }
        break;

    case 'PUT':
        // --- ACTUALIZAR UN INCIDENTE EXISTENTE ---
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de incidente no proporcionado']);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        // Construir la consulta de actualización dinámicamente
        $updates = [];
        foreach ($data as $key => $value) {
            // Escapar el valor
            $escaped_value = is_array($value) || is_object($value)
                ? $mysqli->real_escape_string(json_encode($value))
                : $mysqli->real_escape_string($value);

            // Escapar la clave (nombre del campo)
            $escaped_key = $mysqli->real_escape_string($key);

            $updates[] = "$escaped_key = '$escaped_value'";
        }

        if (count($updates) > 0) {
            $sql = "UPDATE incidents SET " . implode(', ', $updates) . " WHERE id = '$id'";
            if ($mysqli->query($sql)) {
                // Devolver el objeto actualizado
                $result = $mysqli->query("SELECT * FROM incidents WHERE id = '$id'");
                $updated_incident = $result->fetch_assoc();
                echo json_encode($updated_incident);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar el incidente: ' . $mysqli->error]);
            }
        }
        break;

    case 'DELETE':
        // --- ELIMINAR UN INCIDENTE ---
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID de incidente no proporcionado']);
            exit;
        }

        $sql = "DELETE FROM incidents WHERE id = '$id'";
        if ($mysqli->query($sql)) {
            if ($mysqli->affected_rows > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Incidente eliminado correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Incidente no encontrado para eliminar']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al eliminar el incidente: ' . $mysqli->error]);
        }
        break;

    default:
        // Método no permitido
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

// Cerrar la conexión a la base de datos
$mysqli->close();
?>
