<?php
// Test script to debug Supabase connection
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Supabase Connection Test</h2>";

// Load config
$CONFIG = require __DIR__ . '/config.php';
$SUPABASE_URL = rtrim($CONFIG['rest_url'] ?? '', '/');
$SUPABASE_KEY = $CONFIG['supabase_key'] ?? '';

echo "<p><strong>Supabase URL:</strong> $SUPABASE_URL</p>";
echo "<p><strong>Supabase Key:</strong> " . substr($SUPABASE_KEY, 0, 20) . "...</p>";

if (!$SUPABASE_URL || !$SUPABASE_KEY) {
    die('Supabase configuration missing.');
}

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

// Test 1: Check if table exists
echo "<h3>Test 1: Check if registrations table exists</h3>";
list($data, $code,) = supabase_request('GET', 'registrations', ['select' => 'count', 'limit' => 1]);

if ($code === 200) {
    echo "<p style='color: green;'>✅ Table exists and is accessible</p>";
    echo "<p><strong>Current record count:</strong> " . ($data[0]['count'] ?? 0) . "</p>";
} elseif ($code === 401 || $code === 403) {
    echo "<p style='color: red;'>❌ Permission denied. Check RLS policies.</p>";
} elseif ($code === 404) {
    echo "<p style='color: red;'>❌ Table not found. Run the SQL schema first.</p>";
} else {
    echo "<p style='color: orange;'>⚠️ Unexpected response code: $code</p>";
}

// Test 2: Try to insert a test record with unique data
echo "<h3>Test 2: Try to insert a test record with unique data</h3>";
$timestamp = time();
$testPayload = [
    'leader_name' => 'Test Leader ' . $timestamp,
    'leader_email' => 'test' . $timestamp . '@example.com',
    'leader_phone' => '987654' . substr($timestamp, -4),
    'leader_tshirt_size' => 'M',
    'college_name' => 'Test College ' . $timestamp,
    'team_name' => 'Test Team ' . $timestamp,
    'member2_name' => 'Test Member 2 ' . $timestamp,
    'member2_email' => 'test2' . $timestamp . '@example.com',
    'member2_phone' => '987655' . substr($timestamp, -4),
    'member2_tshirt_size' => 'L',
    'member3_name' => 'Test Member 3 ' . $timestamp,
    'member3_email' => 'test3' . $timestamp . '@example.com',
    'member3_phone' => '987656' . substr($timestamp, -4),
    'member3_tshirt_size' => 'XL',
    'utr_number' => '123456' . substr($timestamp, -6),
    'account_holder_name' => 'Test Account ' . $timestamp,
    'project_idea' => 'Test project idea ' . $timestamp,
    'ip_address' => '127.0.0.1'
];

list($inserted, $code, $err) = supabase_request('POST', 'registrations', ['select' => '*'], $testPayload, ['return=representation']);

if ($code === 201 || $code === 200) {
    echo "<p style='color: green;'>✅ Insert successful!</p>";
    echo "<p><strong>Inserted data:</strong> <pre>" . htmlspecialchars(json_encode($inserted, JSON_PRETTY_PRINT)) . "</pre></p>";
} else {
    echo "<p style='color: red;'>❌ Insert failed with code: $code</p>";
    if ($err) {
        echo "<p><strong>Error:</strong> $err</p>";
    }
}

// Test 3: Check current records
echo "<h3>Test 3: Check current records in table</h3>";
list($data, $code,) = supabase_request('GET', 'registrations', ['select' => '*', 'limit' => 5, 'order' => 'created_at.desc']);

if ($code === 200) {
    echo "<p style='color: green;'>✅ Records retrieved successfully</p>";
    echo "<p><strong>Total records found:</strong> " . count($data) . "</p>";
    echo "<p><strong>Latest records:</strong> <pre>" . htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)) . "</pre></p>";
} else {
    echo "<p style='color: red;'>❌ Failed to retrieve records. Code: $code</p>";
}

// Test 4: Test duplicate check (should fail)
echo "<h3>Test 4: Test duplicate email check (should fail)</h3>";
$duplicatePayload = [
    'leader_name' => 'Duplicate Test',
    'leader_email' => 'test@example.com', // This email already exists
    'leader_phone' => '9876543219',
    'leader_tshirt_size' => 'M',
    'college_name' => 'Duplicate College',
    'team_name' => 'Duplicate Team ' . $timestamp,
    'member2_name' => 'Duplicate Member 2',
    'member2_email' => 'duplicate2@example.com',
    'member2_phone' => '9876543220',
    'member2_tshirt_size' => 'L',
    'member3_name' => 'Duplicate Member 3',
    'member3_email' => 'duplicate3@example.com',
    'member3_phone' => '9876543221',
    'member3_tshirt_size' => 'XL',
    'utr_number' => '123456789013',
    'account_holder_name' => 'Duplicate Account',
    'project_idea' => 'Duplicate project idea',
    'ip_address' => '127.0.0.1'
];

list($duplicateResult, $duplicateCode, $duplicateErr) = supabase_request('POST', 'registrations', ['select' => '*'], $duplicatePayload, ['return=representation']);

if ($duplicateCode === 409) {
    echo "<p style='color: orange;'>✅ Duplicate check working correctly (expected 409 error)</p>";
    echo "<p><strong>Error message:</strong> " . htmlspecialchars(json_encode($duplicateResult)) . "</p>";
} else {
    echo "<p style='color: red;'>❌ Duplicate check failed - got code: $duplicateCode</p>";
}
?>
