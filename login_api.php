<?php
if(isset($_POST['email1']) && isset($_POST['password1'])) {
    $servername = "127.0.0.1"; 
    $username = "root"; 
    $db_password = ""; 
    $dbname = "borsa"; 

    $email = $_POST['email1'];
    $password = $_POST['password1'];

    $conn = new mysqli($servername, $username, $db_password, $dbname);

    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error); 
    }

    $sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $password);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo "Login successful.";
    } else {
        echo "Invalid email or password.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Form data not received.";
}
?>
