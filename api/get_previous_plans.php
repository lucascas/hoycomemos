<?php
// Conexión a la base de datos local

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meal_planner";
$conn = new mysqli($servername, $username, $password, $dbname);

// Conexión a la base de datos servidor
/*$servername = "sql105.infinityfree.com";
$username = "if0_36943803";
$password = "9HiF8jHuRJqHZsj";
$dbname = "if0_36943803_comidassemanales";

$conn = new mysqli($servername, $username, $password, $dbname);
$conn = new mysqli("sql105.infinityfree.com", "if0_36943803", "9HiF8jHuRJqHZsj", "if0_36943803_comidassemanales");*/

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener los planes anteriores
$sql = "SELECT lunes_almuerzo, lunes_cena, martes_almuerzo, martes_cena, miercoles_almuerzo, miercoles_cena, jueves_almuerzo, jueves_cena, viernes_almuerzo, viernes_cena, comprar_super, fecha_creacion, categoria FROM weekly_plans";
$result = $conn->query($sql);

$planes = array();

// Recorrer los resultados y agregarlos al array de planes
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $planes[] = $row;
    }
} else {
    echo json_encode([]);
    exit();
}

echo json_encode($planes);

$conn->close();
?>
