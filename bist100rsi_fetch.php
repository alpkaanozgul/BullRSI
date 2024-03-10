<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "bist100rsi";


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$id = isset($_GET['id']) ? $_GET['id'] : 1;


$sql = "SELECT rsi14, dibe_uzaklik, net_kar, stock_symbol FROM bist100rsi WHERE id = $id";


$result = $conn->query($sql);


if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo "0 results";
}
$conn->close();
?>
