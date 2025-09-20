<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Este endpoint gestiona los registros de la tabla 'detections' que usamos para el Threats Log.
switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'PUT':
        handlePut($pdo);
        break;
    case 'DELETE':
        handleDelete($pdo);
        break;
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo) {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $pdo->prepare("SELECT * FROM detections WHERE id = ?");
        $stmt->execute([$id]);
        $detection = $stmt->fetch();
        if ($detection) {
            echo json_encode($detection);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Threat log entry not found']);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM detections ORDER BY fecha_incidente DESC");
        $detections = $stmt->fetchAll();
        echo json_encode($detections);
    }
}

function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['tipo_incidente']) || empty($data['fecha_incidente'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Bad Request: Missing required fields']);
        return;
    }

    $sql = "INSERT INTO detections (tipo_incidente, prioridad, fecha_incidente, responsable, equipo_afectado, direccion_mac, dependencia, estado_equipo, acciones_tomadas, hash, nivel_amenaza, detalles, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    
    try {
        $stmt->execute([
            $data['tipo_incidente'] ?? null,
            $data['prioridad'] ?? 'Media',
            $data['fecha_incidente'] ?? null,
            $data['responsable'] ?? null,
            $data['equipo_afectado'] ?? null,
            $data['direccion_mac'] ?? null,
            $data['dependencia'] ?? null,
            $data['estado_equipo'] ?? 'En Alerta',
            $data['acciones_tomadas'] ?? null,
            $data['hash'] ?? null,
            $data['nivel_amenaza'] ?? 'Desconocido',
            $data['detalles'] ?? null,
            $data['estado'] ?? 'Abierto'
        ]);
        http_response_code(201); // Created
        echo json_encode(['message' => 'Threat log entry created successfully', 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function handlePut($pdo) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Bad Request: Missing ID']);
        return;
    }
    $id = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $sql = "UPDATE detections SET tipo_incidente=?, prioridad=?, fecha_incidente=?, responsable=?, equipo_afectado=?, direccion_mac=?, dependencia=?, estado_equipo=?, acciones_tomadas=?, hash=?, nivel_amenaza=?, detalles=?, estado=? WHERE id=?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            $data['tipo_incidente'] ?? null,
            $data['prioridad'] ?? 'Media',
            $data['fecha_incidente'] ?? null,
            $data['responsable'] ?? null,
            $data['equipo_afectado'] ?? null,
            $data['direccion_mac'] ?? null,
            $data['dependencia'] ?? null,
            $data['estado_equipo'] ?? 'En Alerta',
            $data['acciones_tomadas'] ?? null,
            $data['hash'] ?? null,
            $data['nivel_amenaza'] ?? 'Desconocido',
            $data['detalles'] ?? null,
            $data['estado'] ?? 'Abierto',
            $id
        ]);
        http_response_code(200);
        echo json_encode(['message' => "Threat log entry with ID $id updated successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function handleDelete($pdo) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Bad Request: Missing ID']);
        return;
    }
    $id = $_GET['id'];

    $stmt = $pdo->prepare("DELETE FROM detections WHERE id = ?");
    try {
        $stmt->execute([$id]);
        if ($stmt->rowCount()) {
            http_response_code(200);
            echo json_encode(['message' => "Threat log entry with ID $id deleted successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Threat log entry not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
