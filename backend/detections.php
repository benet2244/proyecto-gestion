<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DE RESPUESTA Y CORS ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar la solicitud pre-flight OPTIONS de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- CONEXIÓN A LA BASE DE DATOS ---
$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $mysqli->connect_error]);
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
    $detections = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $detections[] = $row;
        }
    }
    echo json_encode($detections);
}

function get_detection($mysqli, $id) {
    $stmt = $mysqli->prepare("SELECT * FROM detections WHERE id = ?");
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
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    $id = "DET-" . strtoupper(substr(uniqid(), -6));
    
    // Lista de campos esperados
    $fields = [
        'tipo_incidente', 'prioridad', 'fecha_incidente', 'responsable', 
        'equipo_afectado', 'direccion_mac', 'dependencia', 'estado_equipo', 
        'acciones_tomadas', 'hash', 'detalles', 'estado', 'nivel_amenaza'
    ];
    
    $values = [];
    foreach ($fields as $field) {
        $values[] = $data[$field] ?? null;
    }

    $sql = "INSERT INTO detections (id, " . implode(", ", $fields) . ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    
    $types = 's' . str_repeat('s', count($fields));
    $stmt->bind_param($types, $id, ...$values);

    if ($stmt->execute()) {
        http_response_code(201);
        $data['id'] = $id;
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear la detección: ' . $stmt->error]);
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
    if ($data === null) {
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
            $updates[] = "$key = ?";
            $params[] = $value;
            $types .= "s";
        }
    }

    if (count($updates) > 0) {
        $sql = "UPDATE detections SET " . implode(', ', $updates) . " WHERE id = ?";
        $types .= "s";
        $params[] = $id;

        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            get_detection($mysqli, $id);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar la detección: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No se proporcionaron campos válidos para actualizar']);
    }
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