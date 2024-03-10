<?php
$servername = "localhost";
$username = "root";
$db_password = "";
$dbname = "getdata";

$connection = mysqli_connect($servername, $username, $db_password, $dbname);

if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "SELECT price FROM bitcoin_prices WHERE id = 1";
$result = mysqli_query($connection, $query);

if (!$result) {
    $response = array("message" => "Error fetching data from database.");
} else {
    $data = array();
    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $data["price"] = $row['price'];
    } else {
        $data["price"] = "No data found for ID 1";
    }
    $response = array("message" => "Data fetched successfully.", "data" => $data);
}

mysqli_close($connection);

header('Content-Type: application/json');

echo json_encode($response);
?>
