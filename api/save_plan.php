<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión a la base de datos local
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meal_planner";
$conn = new mysqli($servername, $username, $password, $dbname);

// Conexión a la base de datos servidor
/* $servername = "sql105.infinityfree.com";
$username = "if0_36943803";
$password = "9HiF8jHuRJqHZsj";
$dbname = "if0_36943803_comidassemanales";
$conn = new mysqli("sql105.infinityfree.com", "if0_36943803", "9HiF8jHuRJqHZsj", "if0_36943803_comidassemanales");
*/
// Crear conexión

// Verificar conexión
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que los datos se hayan recibido correctamente
if ($data === null) {
    error_log("No se recibieron datos o el JSON está malformado.");
    echo json_encode(["error" => "No se recibieron datos o el JSON está malformado."]);
    $conn->close();
    exit();
}

error_log("Datos recibidos (JSON decodificado): " . print_r($data, true));

$lunes_almuerzo = $conn->real_escape_string($data['lunes_almuerzo']);
$lunes_cena = $conn->real_escape_string($data['lunes_cena']);
$martes_almuerzo = $conn->real_escape_string($data['martes_almuerzo']);
$martes_cena = $conn->real_escape_string($data['martes_cena']);
$miercoles_almuerzo = $conn->real_escape_string($data['miercoles_almuerzo']);
$miercoles_cena = $conn->real_escape_string($data['miercoles_cena']);
$jueves_almuerzo = $conn->real_escape_string($data['jueves_almuerzo']);
$jueves_cena = $conn->real_escape_string($data['jueves_cena']);
$viernes_almuerzo = $conn->real_escape_string($data['viernes_almuerzo']);
$viernes_cena = $conn->real_escape_string($data['viernes_cena']);
$comprar_super = $conn->real_escape_string($data['comprar_super']);

// Verificar los valores recibidos
error_log("Datos procesados para SQL: " . print_r([
    'lunes_almuerzo' => $lunes_almuerzo,
    'lunes_cena' => $lunes_cena,
    'martes_almuerzo' => $martes_almuerzo,
    'martes_cena' => $martes_cena,
    'miercoles_almuerzo' => $miercoles_almuerzo,
    'miercoles_cena' => $miercoles_cena,
    'jueves_almuerzo' => $jueves_almuerzo,
    'jueves_cena' => $jueves_cena,
    'viernes_almuerzo' => $viernes_almuerzo,
    'viernes_cena' => $viernes_cena,
    'comprar_super' => $comprar_super
], true));

// Insertar en la tabla weekly_plans
$sql = "INSERT INTO weekly_plans (lunes_almuerzo, lunes_cena, martes_almuerzo, martes_cena, miercoles_almuerzo, miercoles_cena, jueves_almuerzo, jueves_cena, viernes_almuerzo, viernes_cena, comprar_super, created_at) 
VALUES ('$lunes_almuerzo', '$lunes_cena', '$martes_almuerzo', '$martes_cena', '$miercoles_almuerzo', '$miercoles_cena', '$jueves_almuerzo', '$jueves_cena', '$viernes_almuerzo', '$viernes_cena', '$comprar_super', NOW())";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "New record created successfully"]);
} else {
    error_log("Error en la consulta SQL: " . $conn->error);
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();

fetch('test.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(plan),
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        console.error('Error:', data.error);
    } else {
        console.log('Success:', data);
    }
})
.catch(error => {
    console.error('Error:', error);
});


?>
