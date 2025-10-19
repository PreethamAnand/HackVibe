<?php
// Debug script to test the exact duplicate checking logic from register.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Debug Registration Logic</h2>";

// Load config
$CONFIG = require __DIR__ . '/config.php';
$SUPABASE_URL = rtrim($CONFIG['rest_url'] ?? '', '/');
$SUPABASE_KEY = $CONFIG['supabase_key'] ?? '';

function supabase_request($method, $path, $queryParams = [], $body = null, $preferHeaders = []) {
    global $SUPABASE_URL, $SUPABASE_KEY;
    $url = $SUPABASE_URL . '/' . ltrim($path, '/');
    if (!empty($queryParams)) {
        $url .= '?' . http_build_query($queryParams);
    }
    
    echo "<h3>Making Request:</h3>";
    echo "<p><strong>Method:</strong> $method</p>";
    echo "<p><strong>URL:</strong> $url</p>";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    
    $headers = [
        'apikey: ' . $SUPABASE_KEY,
        'Authorization: Bearer ' . $SUPABASE_KEY,
        'Content-Type: application/json',
    ];
    foreach ($preferHeaders as $prefer) {
        $headers[] = 'Prefer: ' . $prefer;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($body !== null) {
        $jsonBody = is_array($body) && count($body) === 1 ? $body[0] : $body;
        $jsonData = json_encode($jsonBody);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
        echo "<p><strong>Body:</strong> <pre>" . htmlspecialchars($jsonData) . "</pre></p>";
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    echo "<p><strong>Response Code:</strong> $httpCode</p>";
    echo "<p><strong>Response:</strong> <pre>" . htmlspecialchars($response) . "</pre></p>";
    
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        echo "<p><strong>Curl Error:</strong> $error</p>";
        return [null, 0, $error];
    }
    
    curl_close($ch);
    $decoded = json_decode($response, true);
    return [$decoded, $httpCode, null];
}

// Test the exact duplicate checking logic from register.php
$testEmail = 'test@example.com';
$testTeamName = 'Test Team';
$testUtr = '123456789012';

echo "<h3>Test 1: Check if team name exists (using register.php logic)</h3>";
list($data, $code,) = supabase_request('GET', 'registrations', [
    'select' => 'id',
    'team_name' => 'eq.' . $testTeamName,
    'limit' => 1
]);

echo "<p><strong>Result:</strong> ";
if ($code === 200) {
    if (!empty($data)) {
        echo "✅ Team name found (duplicate detected)";
    } else {
        echo "✅ Team name not found (can proceed)";
    }
} else {
    echo "❌ Error: $code";
}
echo "</p>";

echo "<h3>Test 2: Check if email exists (using register.php logic)</h3>";
list($data, $code,) = supabase_request('GET', 'registrations', [
    'select' => 'id',
    'leader_email' => 'eq.' . $testEmail,
    'limit' => 1
]);

echo "<p><strong>Result:</strong> ";
if ($code === 200) {
    if (!empty($data)) {
        echo "✅ Email found (duplicate detected)";
    } else {
        echo "✅ Email not found (can proceed)";
    }
} else {
    echo "❌ Error: $code";
}
echo "</p>";

echo "<h3>Test 3: Check if UTR exists (using register.php logic)</h3>";
list($data, $code,) = supabase_request('GET', 'registrations', [
    'select' => 'id',
    'utr_number' => 'eq.' . $testUtr,
    'limit' => 1
]);

echo "<p><strong>Result:</strong> ";
if ($code === 200) {
    if (!empty($data)) {
        echo "✅ UTR found (duplicate detected)";
    } else {
        echo "✅ UTR not found (can proceed)";
    }
} else {
    echo "❌ Error: $code";
}
echo "</p>";

// Test with unique data
echo "<h3>Test 4: Try to insert with unique data</h3>";
$timestamp = time();
$uniquePayload = [
    'leader_name' => 'Debug Test ' . $timestamp,
    'leader_email' => 'debug' . $timestamp . '@example.com',
    'leader_phone' => '987654' . substr($timestamp, -4),
    'leader_tshirt_size' => 'M',
    'college_name' => 'Debug College ' . $timestamp,
    'team_name' => 'Debug Team ' . $timestamp,
    'member2_name' => 'Debug Member 2 ' . $timestamp,
    'member2_email' => 'debug2' . $timestamp . '@example.com',
    'member2_phone' => '987655' . substr($timestamp, -4),
    'member2_tshirt_size' => 'L',
    'member3_name' => 'Debug Member 3 ' . $timestamp,
    'member3_email' => 'debug3' . $timestamp . '@example.com',
    'member3_phone' => '987656' . substr($timestamp, -4),
    'member3_tshirt_size' => 'XL',
    'utr_number' => '123456' . substr($timestamp, -6),
    'account_holder_name' => 'Debug Account ' . $timestamp,
    'project_idea' => 'Debug project idea ' . $timestamp,
    'ip_address' => '127.0.0.1'
];

list($inserted, $code, $err) = supabase_request('POST', 'registrations', ['select' => '*'], $uniquePayload, ['return=representation']);

echo "<p><strong>Insert Result:</strong> ";
if ($code === 201 || $code === 200) {
    echo "✅ Insert successful!";
} else {
    echo "❌ Insert failed with code: $code";
    if ($err) {
        echo " Error: $err";
    }
}
echo "</p>";
?>
