<?php
session_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

// ---------------- CONFIG (Supabase) ----------------
$CONFIG = require __DIR__ . '/config.php';
$SUPABASE_URL = rtrim($CONFIG['rest_url'] ?? '', '/');
$SUPABASE_KEY = $CONFIG['supabase_key'] ?? '';

if (!$SUPABASE_URL || !$SUPABASE_KEY) {
	die('Supabase configuration missing.');
}

// ---------------- Supabase helper ----------------
function supabase_request($method, $path, $queryParams = [], $body = null, $preferHeaders = []) {
	global $SUPABASE_URL, $SUPABASE_KEY;
	$url = $SUPABASE_URL . '/' . ltrim($path, '/');
	if (!empty($queryParams)) {
		$url .= '?' . http_build_query($queryParams);
	}
	
	// Debug: Log the request
	error_log("Supabase Request: $method $url");
	if ($body !== null) {
		error_log("Body: " . json_encode($body));
	}
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	
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
		// Fix: Send body as single object, not wrapped in array
		$jsonBody = is_array($body) && count($body) === 1 ? $body[0] : $body;
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($jsonBody));
	}
	
	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	
	// Debug: Log response
	error_log("Response Code: $httpCode");
	error_log("Response: " . $response);
	
	if ($response === false) {
		$error = curl_error($ch);
		curl_close($ch);
		error_log("Curl Error: " . $error);
		return [null, 0, $error];
	}
	
	curl_close($ch);
	$decoded = json_decode($response, true);
	return [$decoded, $httpCode, null];
}

// ---------------- Helpers ----------------
function safe($s) {
	return htmlspecialchars(trim($s), ENT_QUOTES, 'UTF-8');
}

function validatePhone($phone) {
	// Remove all non-digit characters
	$phone = preg_replace('/[^0-9]/', '', $phone);
	
	// Check if it's a valid Indian mobile number (10 digits starting with 6,7,8,9)
	if (strlen($phone) === 10 && preg_match('/^[6-9][0-9]{9}$/', $phone)) {
		return true;
	}
	
	// Also accept numbers with country code (91)
	if (strlen($phone) === 12 && substr($phone, 0, 2) === '91') {
		$phone = substr($phone, 2);
		if (preg_match('/^[6-9][0-9]{9}$/', $phone)) {
			return true;
		}
	}
	
	return false;
}

function validateEmail($email) {
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		return false;
	}
	
	// Check for common email providers
	$domain = strtolower(explode('@', $email)[1] ?? '');
	$validDomains = [
		'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
		'protonmail.com', 'aol.com', 'live.com', 'msn.com', 'me.com',
		'mac.com', 'yandex.com', 'mail.ru', 'qq.com', '163.com',
		'126.com', 'sina.com', 'sohu.com', 'naver.com', 'daum.net'
	];
	
	// Allow educational domains
	$isEducationalDomain = preg_match('/\.(edu|ac\.in|edu\.in|ac\.uk|edu\.uk|ac\.za|edu\.za)$/', $domain);
	
	return $isEducationalDomain || in_array($domain, $validDomains);
}

// ---------------- CSRF token ----------------
if (empty($_SESSION['csrf_token'])) {
	$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$errors = [];
$messages = [];

// ---------- POST: Handle Registration ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	echo "\n=== REGISTRATION PROCESS STARTED ===\n";
	echo "Timestamp: " . date('Y-m-d H:i:s') . "\n";
	
	if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
		$errors[] = "Invalid CSRF token.";
		echo "CSRF token validation failed\n";
	} else {
		echo "CSRF token validation passed\n";
	}

	// Team Leader Information
	$leaderName = safe($_POST['leader_name'] ?? '');
	$leaderEmail = safe($_POST['leader_email'] ?? '');
	$leaderPhone = safe($_POST['leader_phone'] ?? '');
	$leaderTshirtSize = safe($_POST['leader_tshirt_size'] ?? '');
	$collegeName = safe($_POST['college_name'] ?? '');
	$teamName = safe($_POST['team_name'] ?? '');
	
	// Team Members Information
	$member2Name = safe($_POST['member2_name'] ?? '');
	$member2Email = safe($_POST['member2_email'] ?? '');
	$member2Phone = safe($_POST['member2_phone'] ?? '');
	$member2TshirtSize = safe($_POST['member2_tshirt_size'] ?? '');
	
	$member3Name = safe($_POST['member3_name'] ?? '');
	$member3Email = safe($_POST['member3_email'] ?? '');
	$member3Phone = safe($_POST['member3_phone'] ?? '');
	$member3TshirtSize = safe($_POST['member3_tshirt_size'] ?? '');
	
	// Payment Information
	$utrNumber = safe($_POST['utr_number'] ?? '');
	$accountHolderName = safe($_POST['account_holder_name'] ?? '');
	$projectIdea = safe($_POST['project_idea'] ?? '');

	// Validation for Team Leader
	if (!$leaderName || !$leaderEmail || !$leaderPhone || !$leaderTshirtSize || !$collegeName || !$teamName) {
		$errors[] = "All team leader fields are required.";
	} elseif (!validateEmail($leaderEmail)) {
		$errors[] = "Please enter a valid email address for team leader.";
	} elseif (!validatePhone($leaderPhone)) {
		$errors[] = "Please enter a valid 10-digit phone number for team leader.";
	} elseif (!in_array($leaderTshirtSize, ['S', 'M', 'L', 'XL', 'XXL'])) {
		$errors[] = "Please select a valid t-shirt size for team leader.";
	}

	// Validation for Team Members
	if (!$member2Name || !$member2Email || !$member2Phone || !$member2TshirtSize) {
		$errors[] = "All fields for Member 2 are required.";
	} elseif (!validateEmail($member2Email)) {
		$errors[] = "Please enter a valid email address for Member 2.";
	} elseif (!validatePhone($member2Phone)) {
		$errors[] = "Please enter a valid 10-digit phone number for Member 2.";
	} elseif (!in_array($member2TshirtSize, ['S', 'M', 'L', 'XL', 'XXL'])) {
		$errors[] = "Please select a valid t-shirt size for Member 2.";
	}

	if (!$member3Name || !$member3Email || !$member3Phone || !$member3TshirtSize) {
		$errors[] = "All fields for Member 3 are required.";
	} elseif (!validateEmail($member3Email)) {
		$errors[] = "Please enter a valid email address for Member 3.";
	} elseif (!validatePhone($member3Phone)) {
		$errors[] = "Please enter a valid 10-digit phone number for Member 3.";
	} elseif (!in_array($member3TshirtSize, ['S', 'M', 'L', 'XL', 'XXL'])) {
		$errors[] = "Please select a valid t-shirt size for Member 3.";
	}

	// Validate UTR number (12 digits)
	if ($utrNumber && !preg_match('/^[0-9]{12}$/', $utrNumber)) {
		$errors[] = "UTR number must be exactly 12 digits.";
	}

	// Check for duplicate emails
	$emails = [$leaderEmail, $member2Email, $member3Email];
	if (count(array_unique($emails)) !== count($emails)) {
		$errors[] = "All team members must have unique email addresses.";
	}

	// Check for duplicate phone numbers
	$phones = [$leaderPhone, $member2Phone, $member3Phone];
	if (count(array_unique($phones)) !== count($phones)) {
		$errors[] = "All team members must have unique phone numbers.";
	}

	// Check if team name already exists (Supabase)
	if (empty($errors)) {
		echo "Checking if team name '$teamName' already exists...\n";
		list($data, $code,) = supabase_request('GET', 'registrations', [
			'select' => 'id',
			'team_name' => 'eq.' . urlencode($teamName),
			'limit' => 1
		]);
		if ($code === 401 || $code === 403) {
			$errors[] = "Permission error while validating team name. Configure Supabase RLS to allow SELECT.";
			echo "Team name check failed: Permission error (Code: $code)\n";
		} elseif ($code >= 400) {
			$errors[] = "Failed to validate team name.";
			echo "Team name check failed: HTTP error (Code: $code)\n";
		} elseif (!empty($data)) {
			$errors[] = "Team name already exists. Please choose a different name.";
			echo "Team name check: Duplicate found\n";
		} else {
			echo "Team name check: Available\n";
		}
	}

	// Check if leader email already exists (Supabase)
	if (empty($errors)) {
		echo "Checking if leader email '$leaderEmail' already exists...\n";
		list($data, $code,) = supabase_request('GET', 'registrations', [
			'select' => 'id',
			'leader_email' => 'eq.' . urlencode($leaderEmail),
			'limit' => 1
		]);
		if ($code === 401 || $code === 403) {
			$errors[] = "Permission error while validating leader email. Configure Supabase RLS to allow SELECT.";
			echo "Email check failed: Permission error (Code: $code)\n";
		} elseif ($code >= 400) {
			$errors[] = "Failed to validate leader email.";
			echo "Email check failed: HTTP error (Code: $code)\n";
		} elseif (!empty($data)) {
			$errors[] = "Team leader email already registered.";
			echo "Email check: Duplicate found\n";
		} else {
			echo "Email check: Available\n";
		}
	}

	// Check if UTR number already exists (Supabase)
	if (empty($errors)) {
		echo "Checking if UTR number '$utrNumber' already exists...\n";
		list($data, $code,) = supabase_request('GET', 'registrations', [
			'select' => 'id',
			'utr_number' => 'eq.' . urlencode($utrNumber),
			'limit' => 1
		]);
		if ($code === 401 || $code === 403) {
			$errors[] = "Permission error while validating UTR number. Configure Supabase RLS to allow SELECT.";
			echo "UTR check failed: Permission error (Code: $code)\n";
		} elseif ($code >= 400) {
			$errors[] = "Failed to validate UTR number.";
			echo "UTR check failed: HTTP error (Code: $code)\n";
		} elseif (!empty($data)) {
			$errors[] = "UTR number already exists.";
			echo "UTR check: Duplicate found\n";
		} else {
			echo "UTR check: Available\n";
		}
	}

	if (empty($errors)) {
		// Insert registration into Supabase
		$ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
		$payload = [
			'leader_name' => $leaderName,
			'leader_email' => $leaderEmail,
			'leader_phone' => $leaderPhone,
			'leader_tshirt_size' => $leaderTshirtSize,
			'college_name' => $collegeName,
			'team_name' => $teamName,
			'member2_name' => $member2Name,
			'member2_email' => $member2Email,
			'member2_phone' => $member2Phone,
			'member2_tshirt_size' => $member2TshirtSize,
			'member3_name' => $member3Name,
			'member3_email' => $member3Email,
			'member3_phone' => $member3Phone,
			'member3_tshirt_size' => $member3TshirtSize,
			'utr_number' => $utrNumber,
			'account_holder_name' => $accountHolderName,
			'project_idea' => $projectIdea,
			'ip_address' => $ip_address
		];

		// Debug: Display in terminal
		echo "Sending payload to Supabase: " . json_encode($payload) . "\n";

		list($inserted, $code, $err) = supabase_request('POST', 'registrations', ['select' => '*'], $payload, ['return=representation']);

		// Debug: Display in terminal
		echo "Supabase response code: $code\n";
		echo "Supabase response: " . json_encode($inserted) . "\n";
		echo "Supabase error: " . ($err ?? 'none') . "\n";

		// Enhanced validation: Only show success if data is actually saved
		$registrationSuccessful = false;
		$insertedId = null;

		if ($code === 201 || $code === 200) {
			// Check if we got valid response data
			if (is_array($inserted) && !empty($inserted)) {
				// Verify the inserted data matches what we sent
				$insertedRecord = is_array($inserted[0] ?? null) ? $inserted[0] : $inserted;
				if ($insertedRecord && 
					isset($insertedRecord['id']) && 
					$insertedRecord['leader_email'] === $leaderEmail &&
					$insertedRecord['team_name'] === $teamName) {
					
					$registrationSuccessful = true;
					$insertedId = $insertedRecord['id'];
					echo "Registration confirmed successful with ID: $insertedId\n";
				} else {
					echo "Insert response validation failed - data mismatch\n";
				}
			} else {
				echo "Insert response is empty or invalid\n";
			}
		}

		if ($registrationSuccessful) {
			$messages[] = "Registration successful! Thank you for registering for HackVibe 2025. (ID: $insertedId)";
			
			// Send confirmation email (optional if PHPMailer present)
			$phpMailerPath = __DIR__ . '/PHPMailer/src/PHPMailer.php';
			$smtpPath = __DIR__ . '/PHPMailer/src/SMTP.php';
			$exceptionPath = __DIR__ . '/PHPMailer/src/Exception.php';
			if (file_exists($phpMailerPath) && file_exists($smtpPath) && file_exists($exceptionPath)) {
				require_once $phpMailerPath;
				require_once $smtpPath;
				require_once $exceptionPath;
				$mail = new PHPMailer\PHPMailer\PHPMailer(true);
				try {
					$mail->isSMTP();
					$mail->Host = 'smtp.titan.email';
					$mail->SMTPAuth = true;
					$mail->Username = 'vgnt@hackvibe.in';
					$mail->Password = '8^fkRb!;FrU';
					$mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
					$mail->Port = 587;
					$mail->setFrom('vgnt@hackvibe.in', 'HackVibe 2025');
					$mail->addAddress($leaderEmail, $leaderName);
					$mail->Subject = 'HackVibe 2025 Registration Confirmation';
					$mail->isHTML(true);
					$mail->Body = '<h2>Thank you for registering for HackVibe 2025!</h2>' .
						'<p>Dear ' . htmlspecialchars($leaderName) . ',</p>' .
						'<p>Your team <b>' . htmlspecialchars($teamName) . '</b> has been successfully registered.</p>' .
						'<h3>Team Details:</h3>' .
						'<ul>' .
						'<li><b>Team Name:</b> ' . htmlspecialchars($teamName) . '</li>' .
						'<li><b>College:</b> ' . htmlspecialchars($collegeName) . '</li>' .
						'<li><b>Leader:</b> ' . htmlspecialchars($leaderName) . ' (' . htmlspecialchars($leaderEmail) . ')</li>' .
						'<li><b>Member 2:</b> ' . htmlspecialchars($member2Name) . ' (' . htmlspecialchars($member2Email) . ')</li>' .
						'<li><b>Member 3:</b> ' . htmlspecialchars($member3Name) . ' (' . htmlspecialchars($member3Email) . ')</li>' .
						'<li><b>UTR Number:</b> ' . htmlspecialchars($utrNumber) . '</li>' .
						'<li><b>Account Holder:</b> ' . htmlspecialchars($accountHolderName) . '</li>' .
						'</ul>' .
						'<p>We will contact you soon with further details. If you have any questions, reply to this email.</p>' .
						'<p>Best regards,<br>HackVibe 2025 Team</p>';
					$mail->AltBody = 'Thank you for registering for HackVibe 2025! Your team ' . $teamName . ' has been registered.';
					$mail->send();
					echo "Confirmation email sent successfully to: $leaderEmail\n";
				} catch (Exception $e) {
					echo "Email sending failed: " . $e->getMessage() . "\n";
					// Don't fail registration if email fails
				}
			}
			// Clear form data only on successful registration
			$_POST = array();
		} else {
			// Database insert failed - show specific error
			$apiMessage = '';
			if (is_array($inserted) && isset($inserted['message'])) {
				$apiMessage = ' (' . $inserted['message'] . ')';
			} elseif ($err) {
				$apiMessage = ' (' . $err . ')';
			} else {
				$apiMessage = ' (HTTP Code: ' . $code . ')';
			}
			$errors[] = "Failed to save registration to database. Please try again." . $apiMessage;
			echo "Registration failed - keeping form data for retry\n";
		}
	}
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>HackVibe 2025 Registration</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<style>
body { 
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #333; 
	padding: 20px; 
	margin: 0;
	min-height: 100vh;
}
.no-zoom * { -webkit-tap-highlight-color: transparent; }
html, body { overscroll-behavior-x: none; touch-action: manipulation; }
a, button { touch-action: manipulation; }
img, video, iframe { max-width: 100%; height: auto; }
.container { 
	max-width: 900px; 
	margin: 24px auto; 
}
.card { 
	background: #fff; 
	padding: 30px; 
	border-radius: 15px; 
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	backdrop-filter: blur(10px);
}
.header {
	text-align: center;
	margin-bottom: 30px;
}
.header h1 {
	color: #4f46e5;
	margin-bottom: 10px;
	font-size: 2.5rem;
}
.header p {
	color: #666;
	font-size: 1.1rem;
}
.form-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}
.form-group {
	margin-bottom: 20px;
}
.form-group.full-width {
	grid-column: 1 / -1;
}
.label { 
	font-weight: 600; 
	margin-bottom: 8px; 
	display: block;
	color: #374151;
}
input, textarea, select { 
	font-size: 1rem; 
	padding: 12px; 
	width: 100%; 
	box-sizing: border-box;
	border: 2px solid #e5e7eb;
	border-radius: 8px;
	transition: border-color 0.3s ease;
}
input:focus, textarea:focus, select:focus {
	outline: none;
	border-color: #4f46e5;
	box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
textarea {
	resize: vertical;
	min-height: 100px;
}
select {
	background-color: white;
}
button { 
	background: linear-gradient(135deg, #4f46e5, #7c3aed);
	color: #fff; 
	border: none; 
	border-radius: 8px; 
	cursor: pointer; 
	padding: 15px 30px;
	font-size: 1.1rem;
	font-weight: 600;
	width: 100%;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}
button:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}
button:disabled { 
	background: #9ca3af;
	cursor: not-allowed;
	transform: none;
}
.error { 
	color: #dc2626; 
	margin: 8px 0; 
	padding: 10px;
	background: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: 6px;
}
.success { 
	color: #059669; 
	margin: 8px 0; 
	padding: 10px;
	background: #f0fdf4;
	border: 1px solid #bbf7d0;
	border-radius: 6px;
}
.fee-info {
	background: linear-gradient(135deg, #fef3c7, #fde68a);
	border: 1px solid #f59e0b;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 20px;
	text-align: center;
}
.fee-info h3 {
	color: #92400e;
	margin: 0 0 10px 0;
}
.fee-info p {
	color: #78350f;
	margin: 0;
	font-weight: 500;
}
.section-title {
	color: #4f46e5;
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 20px;
	padding-bottom: 10px;
	border-bottom: 2px solid #e5e7eb;
}
@media (max-width: 768px) {
	.form-grid {
		grid-template-columns: 1fr;
	}
	.container {
		margin: 10px auto;
	}
	.card {
		padding: 20px;
	}
	.header h1 {
		font-size: 2rem;
	}
}
</style>
</head>
<body>
<div class="container">
	<div class="card">
		<div class="header">
			<h1>HackVibe 2025 Registration</h1>
			<p>Join the ultimate hackathon experience!</p>
		</div>

		<div class="fee-info">
			<h3>Registration Fee: ₹600 per team</h3>
		</div>

		<?php foreach ($errors as $e): ?>
			<div class="error"><?= $e ?></div>
		<?php endforeach; ?>
		<?php foreach ($messages as $m): ?>
			<div class="success"><?= $m ?></div>
		<?php endforeach; ?>

			<form method="post" autocomplete="off">
				<input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
			
			<!-- Team Leader Section -->
			<div class="section-title">Team Leader Information</div>
			<div class="form-grid">
				<div class="form-group">
					<label class="label" for="leader_name">Full Name *</label>
					<input type="text" name="leader_name" id="leader_name" value="<?= htmlspecialchars($_POST['leader_name'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="leader_email">Email Address *</label>
					<input type="email" name="leader_email" id="leader_email" value="<?= htmlspecialchars($_POST['leader_email'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="leader_phone">Phone Number *</label>
					<input type="tel" name="leader_phone" id="leader_phone" value="<?= htmlspecialchars($_POST['leader_phone'] ?? '') ?>" placeholder="10-digit number" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="leader_tshirt_size">T-Shirt Size *</label>
					<select name="leader_tshirt_size" id="leader_tshirt_size" required>
						<option value="">Select Size</option>
						<option value="S" <?= ($_POST['leader_tshirt_size'] ?? '') === 'S' ? 'selected' : '' ?>>S</option>
						<option value="M" <?= ($_POST['leader_tshirt_size'] ?? '') === 'M' ? 'selected' : '' ?>>M</option>
						<option value="L" <?= ($_POST['leader_tshirt_size'] ?? '') === 'L' ? 'selected' : '' ?>>L</option>
						<option value="XL" <?= ($_POST['leader_tshirt_size'] ?? '') === 'XL' ? 'selected' : '' ?>>XL</option>
						<option value="XXL" <?= ($_POST['leader_tshirt_size'] ?? '') === 'XXL' ? 'selected' : '' ?>>XXL</option>
					</select>
				</div>
				
				<div class="form-group">
					<label class="label" for="college_name">College/Organization Name *</label>
					<input type="text" name="college_name" id="college_name" value="<?= htmlspecialchars($_POST['college_name'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="team_name">Team Name *</label>
					<input type="text" name="team_name" id="team_name" value="<?= htmlspecialchars($_POST['team_name'] ?? '') ?>" required>
				</div>
			</div>
			
			<!-- Team Members Section -->
			<div class="section-title">Team Members Information</div>
			
			<!-- Member 2 -->
			<div class="form-grid">
				<div class="form-group">
					<label class="label" for="member2_name">Member 2 - Full Name *</label>
					<input type="text" name="member2_name" id="member2_name" value="<?= htmlspecialchars($_POST['member2_name'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member2_email">Member 2 - Email Address *</label>
					<input type="email" name="member2_email" id="member2_email" value="<?= htmlspecialchars($_POST['member2_email'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member2_phone">Member 2 - Phone Number *</label>
					<input type="tel" name="member2_phone" id="member2_phone" value="<?= htmlspecialchars($_POST['member2_phone'] ?? '') ?>" placeholder="10-digit number" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member2_tshirt_size">Member 2 - T-Shirt Size *</label>
					<select name="member2_tshirt_size" id="member2_tshirt_size" required>
						<option value="">Select Size</option>
						<option value="S" <?= ($_POST['member2_tshirt_size'] ?? '') === 'S' ? 'selected' : '' ?>>S</option>
						<option value="M" <?= ($_POST['member2_tshirt_size'] ?? '') === 'M' ? 'selected' : '' ?>>M</option>
						<option value="L" <?= ($_POST['member2_tshirt_size'] ?? '') === 'L' ? 'selected' : '' ?>>L</option>
						<option value="XL" <?= ($_POST['member2_tshirt_size'] ?? '') === 'XL' ? 'selected' : '' ?>>XL</option>
						<option value="XXL" <?= ($_POST['member2_tshirt_size'] ?? '') === 'XXL' ? 'selected' : '' ?>>XXL</option>
					</select>
				</div>
			</div>
			
			<!-- Member 3 -->
			<div class="form-grid">
				<div class="form-group">
					<label class="label" for="member3_name">Member 3 - Full Name *</label>
					<input type="text" name="member3_name" id="member3_name" value="<?= htmlspecialchars($_POST['member3_name'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member3_email">Member 3 - Email Address *</label>
					<input type="email" name="member3_email" id="member3_email" value="<?= htmlspecialchars($_POST['member3_email'] ?? '') ?>" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member3_phone">Member 3 - Phone Number *</label>
					<input type="tel" name="member3_phone" id="member3_phone" value="<?= htmlspecialchars($_POST['member3_phone'] ?? '') ?>" placeholder="10-digit number" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="member3_tshirt_size">Member 3 - T-Shirt Size *</label>
					<select name="member3_tshirt_size" id="member3_tshirt_size" required>
						<option value="">Select Size</option>
						<option value="S" <?= ($_POST['member3_tshirt_size'] ?? '') === 'S' ? 'selected' : '' ?>>S</option>
						<option value="M" <?= ($_POST['member3_tshirt_size'] ?? '') === 'M' ? 'selected' : '' ?>>M</option>
						<option value="L" <?= ($_POST['member3_tshirt_size'] ?? '') === 'L' ? 'selected' : '' ?>>L</option>
						<option value="XL" <?= ($_POST['member3_tshirt_size'] ?? '') === 'XL' ? 'selected' : '' ?>>XL</option>
						<option value="XXL" <?= ($_POST['member3_tshirt_size'] ?? '') === 'XXL' ? 'selected' : '' ?>>XXL</option>
					</select>
				</div>
			</div>
			
			<!-- Payment Section -->
			<div class="section-title">Payment Information</div>
			<div class="form-grid">
				<div class="form-group">
					<label class="label" for="utr_number">UTR Number *</label>
					<input type="text" name="utr_number" id="utr_number" value="<?= htmlspecialchars($_POST['utr_number'] ?? '') ?>" placeholder="12-digit UTR number" maxlength="12" pattern="[0-9]{12}" required>
				</div>
				
				<div class="form-group">
					<label class="label" for="account_holder_name">Account Holder Name *</label>
					<input type="text" name="account_holder_name" id="account_holder_name" value="<?= htmlspecialchars($_POST['account_holder_name'] ?? '') ?>" required>
				</div>
			</div>
			
			<div class="form-group full-width">
				<label class="label" for="project_idea">Project Idea (Optional)</label>
				<textarea name="project_idea" id="project_idea" placeholder="Briefly describe your project idea..."><?= htmlspecialchars($_POST['project_idea'] ?? '') ?></textarea>
			</div>
			
			<button type="submit" id="submitBtn">Complete Registration</button>
			</form>
	</div>
</div>

<script>
// Prevent double submission and show loading state
document.getElementById('submitBtn').addEventListener('click', function(e) {
    // Check if form is valid
    const form = this.closest('form');
    if (!form.checkValidity()) {
        return; // Let browser show validation errors
    }
    
    // Disable button and show loading
    this.disabled = true;
    this.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Processing...';
    
    // Submit form
    form.submit();
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
</script>

</body>
</html>