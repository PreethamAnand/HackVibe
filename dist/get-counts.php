<?php
// get-counts.php - Fetch counts from Supabase
$CONFIG = require __DIR__ . '/../config.php';
$SUPABASE_URL = rtrim($CONFIG['rest_url'] ?? '', '/');
$SUPABASE_KEY = $CONFIG['supabase_key'] ?? '';

header('Content-Type: application/json');
if (!$SUPABASE_URL || !$SUPABASE_KEY) {
    echo json_encode(['success' => false, 'error' => 'Supabase configuration missing']);
    exit;
}

function sb_get($path, $query = []) {
    global $SUPABASE_URL, $SUPABASE_KEY;
    $url = $SUPABASE_URL . '/' . ltrim($path, '/');
    if (!empty($query)) {
        $url .= '?' . http_build_query($query);
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $SUPABASE_KEY,
        'Authorization: Bearer ' . $SUPABASE_KEY,
    ]);
    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        return [null, 0, $err];
    }
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [json_decode($resp, true), $code, null];
}

// Define "successful" registration criteria:
// 1) Prefer rows with status = 'confirmed'
// 2) Fallback to rows that have a non-null payment screenshot path/column

// Try status = confirmed first
list($confirmedRows, $confirmedCode,) = sb_get('registrations', [
    'select' => 'id',
    'status' => 'eq.confirmed'
]);

$teamCount = 0;
if (is_array($confirmedRows) && $confirmedCode >= 200 && $confirmedCode < 300) {
    $teamCount = count($confirmedRows);
}

// If none confirmed (or schema lacks status), fallback to presence of payment screenshot/path
if ($teamCount === 0) {
    // Try common column names in Supabase schema
    $candidates = [
        'payment_screenshot_path', // used in React payload
        'payment_screenshot'       // used in MySQL schema
    ];
    foreach ($candidates as $col) {
        // PostgREST filter: column=is.not.null
        $query = [
            'select' => 'id',
            $col => 'is.not.null'
        ];
        list($rows, $code,) = sb_get('registrations', $query);
        if (is_array($rows) && $code >= 200 && $code < 300 && count($rows) > 0) {
            $teamCount = count($rows);
            break;
        }
    }
}

// Final fallback: count all registrations if neither filter works
if ($teamCount === 0) {
    list($all, $code2,) = sb_get('registrations', [ 'select' => 'id' ]);
$teamCount = is_array($all) ? count($all) : 0;
}

$participantCount = $teamCount * 3;

echo json_encode([
    'success' => true,
    'teams' => $teamCount,
    'participants' => $participantCount
]);
?>