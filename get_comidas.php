<?php


   // PHP version 7.4 used here
   try {
    // connect to OVHcloud Public Cloud Databases for MongoDB (cluster in version 4.4, MongoDB PHP Extension in 1.8.1)
    $m = new MongoDB\Driver\Manager('mongodb+srv://lucascastillo:pvX2t2BGvw9oJeNJ@appcomidas.2naw1.mongodb.net/comidas');
    echo "Connection to database successfully";
    // display the content of the driver, for diagnosis purpose
    echo var_dump($m);
}
catch (Throwable $e) {
    // catch throwables when the connection is not a success
    echo "Captured Throwable for connection : " . $e->getMessage() . PHP_EOL;
}


















/*$servername = "localhost";
$username = "root";
$password = "";
$dbname = "meal_planner";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
*/
$sql = "SELECT * FROM comidas";
$result = $conn->query($sql);

$comidas = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $comidas[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($comidas);
?>