<?php
require_once 'includes/db.php';
require_once 'includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$name = clean_input($_POST['name'] ?? '');
$email = clean_input($_POST['email'] ?? '');
$message = clean_input($_POST['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

try {
    $stmt = $db->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);
    
    // Send email notification (optional)
    send_notification_email($name, $email, $message);
    
    echo json_encode(['success' => true, 'message' => 'Thank you for your message!']);
} catch(PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred. Please try again later.']);
}
?>