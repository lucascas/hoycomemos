<?php
// Conexión a la base de datos local

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meal_planner";
$conn = new mysqli($servername, $username, $password, $dbname);
/* Conexión a la base de datos servidor
$servername = "sql105.infinityfree.com";
$username = "if0_36943803";
$password = "9HiF8jHuRJqHZsj";
$dbname = "if0_36943803_comidassemanales";
$conn = new mysqli($servername, $username, $password, $dbname);
ESTA VA $conn = new mysqli("sql105.infinityfree.com", "if0_36943803", "9HiF8jHuRJqHZsj", "if0_36943803_comidassemanales");
*/
// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos enviados desde el frontend
$data = json_decode(file_get_contents('php://input'), true);
$comidaId = $data['comidaId'];
$categories = implode(", ", $data['categories']);

// Actualizar la categoría de la comida
$sql = "UPDATE comidas SET categoria = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $categories, $comidaId);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["message" => "Categoría actualizada exitosamente"]);
} else {
    echo json_encode(["message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
