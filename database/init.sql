
-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `${DB_DATABASE}`;

-- Usar la base de datos
USE `${DB_DATABASE}`;

-- Crear la tabla de Incidentes
CREATE TABLE `incidents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Abierto',
  `priority` VARCHAR(50) DEFAULT 'Media',
  `assignedTo` VARCHAR(255),
  `workstreamAssignment` JSON,
  `creationDate` DATETIME,
  `updateDate` DATETIME,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Crear la tabla de Detecciones
CREATE TABLE `detections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tipo_incidente` VARCHAR(255) NOT NULL,
  `prioridad` ENUM('Baja', 'Media', 'Alta', 'Crítica') DEFAULT 'Media',
  `fecha_incidente` DATETIME NOT NULL,
  `responsable` VARCHAR(255) NOT NULL,
  `equipo_afectado` VARCHAR(255) NOT NULL,
  `direccion_mac` VARCHAR(17) DEFAULT NULL,
  `dependencia` VARCHAR(255) NOT NULL,
  `estado_equipo` ENUM('Infectado', 'Mitigado', 'En Alerta') DEFAULT 'En Alerta',
  `acciones_tomadas` TEXT NOT NULL,
  `hash` VARCHAR(128) DEFAULT NULL,
  `detalles` TEXT NOT NULL,
  `estado` ENUM('Abierto', 'Pendiente', 'Cerrado') DEFAULT 'Abierto',
  `nivel_amenaza` ENUM('No Detectado', 'Bajo', 'Medio', 'Alto', 'Crítico', 'Desconocido') DEFAULT 'Desconocido'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

