<?php
// Incluir el archivo de configuración para la conexión a la base de datos
require_once 'config.php';

// --- CONFIGURACIÓN DE RESPUESTA Y CORS ---
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Para desarrollo. En producción, restríngelo a tu dominio de frontend.
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
    $result = $mysqli->query("SELECT * FROM incidents ORDER BY reportedAt DESC");
    $incidents = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            // Decodificar campos JSON para que el frontend los reciba como objetos/arrays
            $row['workstreamAssignment'] = json_decode($row['workstreamAssignment']);
            $incidents[] = $row;
        }
    }
    echo json_encode($incidents);
}

function get_incident($mysqli, $id) {
    $stmt = $mysqli->prepare("SELECT * FROM incidents WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $incident = $result->fetch_assoc();
        $incident['workstreamAssignment'] = json_decode($incident['workstreamAssignment']);
        echo json_encode($incident);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Incidente no encontrado']);
    }
    $stmt->close();
}

function create_incident($mysqli) {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    // Generar un ID único (más robusto que el contador)
    $new_id = "INC-" . strtoupper(substr(uniqid(), -6));
    
    // Lista de campos esperados
    $title = $data['title'] ?? 'Sin Título';
    $description = $data['description'] ?? '';
    $severity = $data['severity'] ?? 'Baja';
    $status = $data['status'] ?? 'Identificación';
    $workstreamAssignment = json_encode($data['workstreamAssignment'] ?? []);
    $reportedAt = date('Y-m-d H:i:s');

    $sql = "INSERT INTO incidents (id, title, description, severity, status, reportedAt, workstreamAssignment) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("sssssss", $new_id, $title, $description, $severity, $status, $reportedAt, $workstreamAssignment);

    if ($stmt->execute()) {
        http_response_code(201);
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
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos JSON inválidos']);
        return;
    }

    // Campos permitidos para actualización
    $allowed_fields = ['title', 'description', 'severity', 'status', 'workstreamAssignment'];
    $updates = [];
    $params = [];
    $types = "";

    foreach ($data as $key => $value) {
        if (in_array($key, $allowed_fields)) {
            $updates[] = "$key = ?";
            
            // Si es un array/objeto, lo codificamos como JSON
            if (is_array($value) || is_object($value)) {
                $params[] = json_encode($value);
            } else {
                $params[] = $value;
            }
            $types .= "s"; // Tratar todos los params como strings
        }
    }

    if (count($updates) > 0) {
        $sql = "UPDATE incidents SET " . implode(', ', $updates) . " WHERE id = ?";
        $types .= "s"; // Añadir el tipo para el ID
        $params[] = $id;

        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                 get_incident($mysqli, $id); // Devuelve el incidente actualizado
            } else {
                // Si no se afectaron filas, puede que los datos enviados fueran los mismos
                // o que el incidente no existiera.
                 get_incident($mysqli, $id);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar el incidente: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No se proporcionaron campos válidos para actualizar']);
    }
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
