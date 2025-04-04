<?php
session_start();
require_once '../includes/db.php';
require_once '../includes/functions.php';

if (!is_logged_in()) {
    header('Location: login.php');
    exit;
}

// Get contact messages
try {
    $contacts = $db->query("SELECT * FROM contacts ORDER BY submitted_at DESC LIMIT 10")->fetchAll();
    $unreadCount = $db->query("SELECT COUNT(*) FROM contacts WHERE is_read = FALSE")->fetchColumn();
} catch(PDOException $e) {
    die("Database error: " . $e->getMessage());
}

// Get projects
try {
    $projects = $db->query("SELECT * FROM projects ORDER BY created_at DESC")->fetchAll();
} catch(PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Dashboard</title>
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>Portfolio Dashboard</h1>
            <nav>
                <a href="?page=dashboard">Dashboard</a>
                <a href="?page=contacts">Contacts (<?= $unreadCount ?> new)</a>
                <a href="?page=projects">Projects</a>
                <a href="logout.php">Logout</a>
            </nav>
        </header>
        
        <main class="admin-main">
            <div class="stats-container">
                <div class="stat-card">
                    <h3>Recent Messages</h3>
                    <div class="stat-value"><?= count($contacts) ?></div>
                </div>
                <div class="stat-card">
                    <h3>Total Projects</h3>
                    <div class="stat-value"><?= count($projects) ?></div>
                </div>
            </div>
            
            <section class="recent-contacts">
                <h2>Recent Messages</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($contacts as $contact): ?>
                        <tr class="<?= $contact['is_read'] ? '' : 'unread' ?>">
                            <td><?= htmlspecialchars($contact['name']) ?></td>
                            <td><?= htmlspecialchars($contact['email']) ?></td>
                            <td><?= truncate_text(htmlspecialchars($contact['message']), 50) ?></td>
                            <td><?= format_date($contact['submitted_at']) ?></td>
                            <td>
                                <a href="view_contact.php?id=<?= $contact['id'] ?>" class="btn-view">View</a>
                                <a href="delete_contact.php?id=<?= $contact['id'] ?>" class="btn-delete">Delete</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </section>
        </main>
    </div>
</body>
</html>