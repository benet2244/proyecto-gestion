<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DE RESPUESTA Y CORS ---
header('Content-Type: application/json');

// --- CONEXIÓN A LA BASE DE DATOS (Usando MySQLi) ---
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($mysqli->connect_error) {
    http_response_code(500);
    error_log('Error de conexión a la base de datos: ' . $mysqli->connect_error);
    echo json_encode(['error' => 'Error de conexión a la base de datos.']);
    exit();
}
$mysqli->set_charset("utf8");

// --- OBTENCIÓN DE PARÁMETROS ---
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $mysqli->real_escape_string($_GET['id']) : null;

// --- LÓGICA PRINCIPAL (ROUTER) ---
switch ($method) {
    case 'GET':
        if ($id) {
            get_detection($mysqli, $id);
        } else {
            get_all_detections($mysqli);
        }
        break;
    case 'POST':
        create_detection($mysqli);
        break;
    case 'PUT':
        update_detection($mysqli, $id);
        break;
    case 'DELETE':
        delete_detection($mysqli, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

$mysqli->close();

// --- FUNCIONES DE LÓGICA ---

function get_all_detections($mysqli) {
    $result = $mysqli->query("SELECT * FROM detections ORDER BY fecha_incidente DESC");
    if (!$result) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $mysqli->error]);
        return;
    }
    $detections = [];
    while ($row = $result->fetch_assoc()) {
        $detections[] = $row;
    }
    echo json_encode($detections);
}

function get_detection($mysqli, $id) {
    $stmt = $mysqli->prepare("SELECT * FROM detections WHERE id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al preparar la consulta: ' . $mysqli->error]);
        return;
    }
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $detection = $result->fetch_assoc();
        echo json_encode($detection);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Detección no encontrada']);
    }
    $stmt->close();
}

function create_detection($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    $id = "DET-" . strtoupper(substr(uniqid(), -6));
    
    // Lista de campos esperados y sus valores por defecto
    $fields = [
        'tipo_incidente' => null, 'prioridad' => 'Media', 'fecha_incidente' => null, 'responsable' => null, 
        'equipo_afectado' => null, 'direccion_mac' => null, 'dependencia' => null, 'estado_equipo' => 'En Alerta', 
        'acciones_tomadas' => null, 'hash' => null, 'detalles' => null, 'estado' => 'Abierto', 'nivel_amenaza' => 'Desconocido'
    ];
    
    $columns = ['id'];
    $placeholders = ['?'];
    $values = [$id];
    $types = 's';

    foreach ($fields as $field => $default) {
        $columns[] = $field;
        $placeholders[] = '?';
        $values[] = $data[$field] ?? $default;
        $types .= 's'; // Tratar todos como strings para bind_param
    }
    
    // Formatear la fecha si está presente
    $date_index = array_search('fecha_incidente', $columns);
    if ($date_index !== false && $values[$date_index]) {
        $values[$date_index] = date('Y-m-d H:i:s', strtotime($values[$date_index]));
    }

    $sql = "INSERT INTO detections (" . implode(", ", $columns) . ") VALUES (" . implode(", ", $placeholders) . ")";
    $stmt = $mysqli->prepare($sql);
    
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        http_response_code(201);
        $data['id'] = $id; // Añadir el ID generado al objeto de respuesta
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear la detección: ' . $stmt->error, 'sql' => $sql]);
    }
    $stmt->close();
}

function update_detection($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de detección no proporcionado']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    $allowed_fields = [
        'tipo_incidente', 'prioridad', 'fecha_incidente', 'responsable', 
        'equipo_afectado', 'direccion_mac', 'dependencia', 'estado_equipo', 
        'acciones_tomadas', 'hash', 'detalles', 'estado', 'nivel_amenaza'
    ];
    
    $updates = [];
    $params = [];
    $types = "";

    foreach ($data as $key => $value) {
        if (in_array($key, $allowed_fields)) {
            $updates[] = "`$key` = ?";
            
            // Formatear la fecha si es el campo de fecha
            if ($key === 'fecha_incidente' && $value) {
                 $params[] = date('Y-m-d H:i:s', strtotime($value));
            } else {
                 $params[] = $value;
            }
            $types .= "s";
        }
    }

    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No se proporcionaron campos válidos para actualizar']);
        return;
    }

    $sql = "UPDATE detections SET " . implode(', ', $updates) . " WHERE id = ?";
    $types .= "s";
    $params[] = $id;

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        get_detection($mysqli, $id); // Devuelve el objeto actualizado
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar la detección: ' . $stmt->error]);
    }
    $stmt->close();
}


function delete_detection($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de detección no proporcionado']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM detections WHERE id = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(['message' => 'Detección eliminada correctamente']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Detección no encontrada para eliminar']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar la detección: ' . $stmt->error]);
    }
    $stmt->close();
}
?>
