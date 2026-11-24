<?php
// Simuler l'API get_settings.php sans les headers
require_once 'api/config.php';

$pdo = getDB();

$settings = [];
$stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
while ($row = $stmt->fetch()) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

$categories = $pdo->query("SELECT id, nom, slug, image_url FROM categories ORDER BY id")->fetchAll();

echo "=== Paramètres chargés ===\n";
echo "hero_image: " . ($settings['hero_image'] ?? 'NON DEFINI') . "\n";
echo "cat_sacs_image: " . ($settings['cat_sacs_image'] ?? 'NON DEFINI') . "\n";
echo "cat_portefeuille_image: " . ($settings['cat_portefeuille_image'] ?? 'NON DEFINI') . "\n";

echo "\n=== Test JavaScript API ===\n";
?>

<script>
console.log("Test API call...");

var xhr = new XMLHttpRequest();
xhr.open('GET', 'api/get_settings.php', true);
xhr.onreadystatechange = function() {
    console.log("ReadyState:", xhr.readyState, "Status:", xhr.status);
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Response:", xhr.responseText);
        try {
            var data = JSON.parse(xhr.responseText);
            console.log("Success:", data.success);
            console.log("Hero:", data.settings.hero_image);
            console.log("Cat Sacs:", data.settings.cat_sacs_image);
            console.log("Cat Clés:", data.settings.cat_portefeuille_image);
        } catch(e) {
            console.error("Parse error:", e);
        }
    }
};
xhr.onerror = function() {
    console.error("Network error");
};
xhr.send();
</script>

