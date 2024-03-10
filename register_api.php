<?php
if(isset($_POST['name']) && isset($_POST['phone_number']) && isset($_POST['email']) && isset($_POST['password'])) {
    $servername = "127.0.0.1"; 
    $username = "root"; 
    $db_password = "";
    $dbname = "borsa"; 
    $name = $_POST['name'];
    $phone_number = $_POST['phone_number'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $conn = new mysqli($servername, $username, $db_password, $dbname);

    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error); 
    }

    $sql = "INSERT INTO users (name, phone_number, email, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $name, $phone_number, $email, $password);

    if ($stmt->execute()) {
        echo "Data Sent.";
    } else {
        echo "Error Sending Data " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Form data not received.";
}
?>