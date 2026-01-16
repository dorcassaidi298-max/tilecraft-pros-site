<?php
// Validate form data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $mobile = trim($_POST['mobile']);
    $email = trim($_POST['email']);
    $region = $_POST['region'];
    $service = $_POST['service'];
    $message = trim($_POST['message']);
    $newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';

    // Check for required fields
    if (empty($name) || empty($mobile) || empty($email)) {
        echo 'Please fill in all required fields.';
        exit;
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Invalid email address.';
        exit;
    }

    // Process form data (e.g., send email, store in database)
    // For now, just print the data
    echo 'Name: ' . $name . '<br>';
    echo 'Mobile: ' . $mobile . '<br>';
    echo 'Email: ' . $email . '<br>';
    echo 'Region: ' . $region . '<br>';
    echo 'Service: ' . $service . '<br>';
    echo 'Message: ' . $message . '<br>';
    echo 'Newsletter: ' . $newsletter . '<br>';
}
?>