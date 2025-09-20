<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DE RESPUESTA Y CORS ---
header('Content-Type: application/json');

// --- CONEXIÓN A LA BASE DE DATOS ---
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
            get_incident($mysqli, $id);
        } else {
            get_all_incidents($mysqli);
        }
        break;

    case 'POST':
        create_incident($mysqli);
        break;

    case 'PUT':
        update_incident($mysqli, $id);
        break;

    case 'DELETE':
        delete_incident($mysqli, $id);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

// Cerrar la conexión
$mysqli->close();


// --- FUNCIONES DE LÓGICA ---

function get_all_incidents($mysqli) {
    $result = $mysqli->query("SELECT id, title, description, severity, status, reportedAt FROM incidents ORDER BY reportedAt DESC");
     if (!$result) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $mysqli->error]);
        return;
    }
    $incidents = [];
    while ($row = $result->fetch_assoc()) {
        $incidents[] = $row;
    }
    echo json_encode($incidents);
}

function get_incident($mysqli, $id) {
    $stmt = $mysqli->prepare("SELECT * FROM incidents WHERE id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al preparar la consulta: ' . $mysqli->error]);
        return;
    }
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $incident = $result->fetch_assoc();
        // Decodificar campos JSON antes de enviarlos
        $incident['workstreamAssignment'] = json_decode($incident['workstreamAssignment'], true);
        // ... (decodificar otros campos JSON si los hay) ...
        echo json_encode($incident);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Incidente no encontrado']);
    }
    $stmt->close();
}

function create_incident($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    $new_id = "INC-" . strtoupper(substr(uniqid(), -6));
    
    // Asignar valores desde $data o usar valores por defecto
    $title = $data['title'] ?? 'Sin Título';
    $description = $data['description'] ?? '';
    $severity = $data['severity'] ?? 'Baja';
    $status = $data['status'] ?? 'Identificación';
    // Codificar campos que vienen como objetos/arrays a JSON
    $workstreamAssignment = json_encode($data['workstreamAssignment'] ?? []);
    $reportedAt = date('Y-m-d H:i:s');

    $sql = "INSERT INTO incidents (id, title, description, severity, status, reportedAt, workstreamAssignment) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("sssssss", $new_id, $title, $description, $severity, $status, $reportedAt, $workstreamAssignment);

    if ($stmt->execute()) {
        http_response_code(201);
        // Devolver el objeto creado con su nuevo ID y fecha
        $data['id'] = $new_id;
        $data['reportedAt'] = $reportedAt;
        echo json_encode($data);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear el incidente: ' . $stmt->error]);
    }
    $stmt->close();
}

function update_incident($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de incidente no proporcionado']);
        return;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    $allowed_fields = ['title', 'description', 'severity', 'status', 'workstreamAssignment'];
    $updates = [];
    $params = [];
    $types = "";

    foreach ($data as $key => $value) {
        if (in_array($key, $allowed_fields)) {
            $updates[] = "`$key` = ?";
            
            // Si el valor es un array u objeto, codificarlo a JSON
            if (is_array($value) || is_object($value)) {
                $params[] = json_encode($value);
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

    $sql = "UPDATE incidents SET " . implode(', ', $updates) . " WHERE id = ?";
    $types .= "s";
    $params[] = $id;

    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        get_incident($mysqli, $id); // Devuelve el incidente actualizado
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar el incidente: ' . $stmt->error]);
    }
    $stmt->close();
}

function delete_incident($mysqli, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de incidente no proporcionado']);
        return;
    }

    $stmt = $mysqli->prepare("DELETE FROM incidents WHERE id = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(['message' => 'Incidente eliminado correctamente']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Incidente no encontrado para eliminar']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar el incidente: ' . $stmt->error]);
    }
    $stmt->close();
}
?>