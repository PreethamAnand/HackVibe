<?php
// Proxy to root verify-otp endpoint implemented in register.php?action=verify_otp
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit();
}

// Forward request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, '../register.php?action=verify_otp');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
  'email' => $_POST['email'] ?? '',
  'otp'   => $_POST['otp'] ?? ''
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if ($response === false) {
  echo json_encode(['success' => false, 'message' => 'Failed to route request']);
  exit();
}
echo $response;
?>


