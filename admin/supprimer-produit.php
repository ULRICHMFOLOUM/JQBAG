<?php
session_start();
if (!isset($_SESSION['admin_id'])) { header('Location: login.html'); exit; }
require_once '../api/config.php';

$id = intval($_GET['id'] ?? 0);
if (!$id) { header('Location: produits.php?msg=ID invalide&type=danger'); exit; }

$pdo  = getDB();
$stmt = $pdo->prepare("DELETE FROM produits WHERE id = :id");
$stmt->execute([':id' => $id]);

header('Location: produits.php?msg=Produit supprimé avec succès&type=success');
exit;
?>

