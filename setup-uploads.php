<?php
/**
 * HackVibe 2025 - Uploads Directory Setup Script
 * Run this script once to set up the uploads directory structure
 * Designed for Hostinger hosting platform
 */

// Enable error reporting for setup
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Define upload directory structure
$directories = [
    'uploads/',
    'uploads/payment_screenshots/',
    'uploads/team_photos/',
    'uploads/temp/',
    'uploads/backups/'
];

// Create directories with proper permissions
function createDirectories($dirs) {
    $results = [];
    
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            if (mkdir($dir, 0755, true)) {
                $results[$dir] = 'Created successfully';
                
                // Create .htaccess file for security
                $htaccessContent = "# Protect uploads directory\n";
                $htaccessContent .= "Options -Indexes\n";
                $htaccessContent .= "# Allow only specific file types\n";
                $htaccessContent .= "<FilesMatch \"\\.(jpg|jpeg|png|gif|pdf)$\">\n";
                $htaccessContent .= "    Order allow,deny\n";
                $htaccessContent .= "    Allow from all\n";
                $htaccessContent .= "</FilesMatch>\n";
                $htaccessContent .= "# Deny access to PHP files\n";
                $htaccessContent .= "<FilesMatch \"\\.php$\">\n";
                $htaccessContent .= "    Order deny,allow\n";
                $htaccessContent .= "    Deny from all\n";
                $htaccessContent .= "</FilesMatch>\n";
                
                file_put_contents($dir . '.htaccess', $htaccessContent);
                
                // Create index.php to prevent directory listing
                $indexContent = "<?php\n// Directory access denied\nheader('HTTP/1.0 403 Forbidden');\nexit('Access denied');\n?>";
                file_put_contents($dir . 'index.php', $indexContent);
                
            } else {
                $results[$dir] = 'Failed to create';
            }
        } else {
            $results[$dir] = 'Already exists';
        }
    }
    
    return $results;
}

// Test file upload functionality
function testFileUpload() {
    $testDir = 'uploads/temp/';
    $testFile = $testDir . 'test_' . time() . '.txt';
    $testContent = "HackVibe 2025 - Upload test file\nCreated: " . date('Y-m-d H:i:s');
    
    if (file_put_contents($testFile, $testContent)) {
        $readable = is_readable($testFile);
        $writable = is_writable($testDir);
        unlink($testFile); // Clean up test file
        
        return [
            'status' => 'success',
            'readable' => $readable,
            'writable' => $writable
        ];
    } else {
        return [
            'status' => 'failed',
            'readable' => false,
            'writable' => false
        ];
    }
}

// Check PHP configuration for file uploads
function checkPhpConfig() {
    return [
        'file_uploads' => ini_get('file_uploads') ? 'Enabled' : 'Disabled',
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'post_max_size' => ini_get('post_max_size'),
        'max_file_uploads' => ini_get('max_file_uploads'),
        'upload_tmp_dir' => ini_get('upload_tmp_dir') ?: 'Default system temp dir'
    ];
}

// Supabase connection test
function testDatabaseConnection() {
    $CONFIG = require __DIR__ . '/config.php';
    $restUrl = rtrim($CONFIG['rest_url'] ?? '', '/');
    $key = $CONFIG['supabase_key'] ?? '';

    if (!$restUrl || !$key) {
        return [
            'status' => 'failed',
            'message' => 'Supabase configuration missing',
            'table_exists' => false
        ];
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $restUrl . '/registrations?select=id&limit=1');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
    ]);
    $resp = curl_exec($ch);
    if ($resp === false) {
        $err = curl_error($ch);
        curl_close($ch);
        return [
            'status' => 'failed',
            'message' => 'Supabase request failed: ' . $err,
            'table_exists' => false
        ];
    }
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code >= 200 && $code < 300) {
        return [
            'status' => 'success',
            'message' => 'Supabase connection successful',
            'table_exists' => true
        ];
    }
    return [
        'status' => 'failed',
        'message' => 'Supabase responded with HTTP ' . $code,
        'table_exists' => false
    ];
}

// Run setup
$directoryResults = createDirectories($directories);
$uploadTest = testFileUpload();
$phpConfig = checkPhpConfig();
$dbTest = testDatabaseConnection();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HackVibe 2025 - Uploads Setup</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(45deg, #8b5cf6, #06b6d4);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 8px;
            background: #f8f9fa;
            border-left: 4px solid #8b5cf6;
        }
        
        .section h3 {
            margin-top: 0;
            color: #8b5cf6;
        }
        
        .status-success {
            color: #28a745;
            font-weight: bold;
        }
        
        .status-error {
            color: #dc3545;
            font-weight: bold;
        }
        
        .status-warning {
            color: #ffc107;
            font-weight: bold;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #8b5cf6;
            color: white;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
            overflow-x: auto;
        }
        
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        
        .alert-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        
        .alert-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HackVibe 2025</h1>
            <p>Uploads Directory Setup & System Check</p>
        </div>
        
        <div class="content">
            <!-- Directory Creation Results -->
            <div class="section">
                <h3>📁 Directory Setup Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Directory</th>
                            <th>Status</th>
                            <th>Permissions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($directoryResults as $dir => $status): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($dir); ?></td>
                            <td>
                                <?php if ($status === 'Created successfully'): ?>
                                    <span class="status-success">✅ <?php echo $status; ?></span>
                                <?php elseif ($status === 'Already exists'): ?>
                                    <span class="status-warning">⚠️ <?php echo $status; ?></span>
                                <?php else: ?>
                                    <span class="status-error">❌ <?php echo $status; ?></span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <?php 
                                if (is_dir($dir)) {
                                    $perms = substr(sprintf('%o', fileperms($dir)), -4);
                                    echo "0{$perms}";
                                } else {
                                    echo "N/A";
                                }
                                ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Upload Test Results -->
            <div class="section">
                <h3>📤 File Upload Test</h3>
                <?php if ($uploadTest['status'] === 'success'): ?>
                    <p class="status-success">✅ File upload test successful!</p>
                    <ul>
                        <li>Readable: <?php echo $uploadTest['readable'] ? '✅ Yes' : '❌ No'; ?></li>
                        <li>Writable: <?php echo $uploadTest['writable'] ? '✅ Yes' : '❌ No'; ?></li>
                    </ul>
                <?php else: ?>
                    <p class="status-error">❌ File upload test failed!</p>
                    <div class="alert alert-warning">
                        Check directory permissions and PHP configuration.
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- PHP Configuration -->
            <div class="section">
                <h3>🐘 PHP Upload Configuration</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Setting</th>
                            <th>Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($phpConfig as $setting => $value): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($setting); ?></td>
                            <td><?php echo htmlspecialchars($value); ?></td>
                            <td>
                                <?php if ($setting === 'file_uploads' && $value === 'Enabled'): ?>
                                    <span class="status-success">✅ Good</span>
                                <?php elseif ($setting === 'file_uploads' && $value === 'Disabled'): ?>
                                    <span class="status-error">❌ Disabled</span>
                                <?php elseif (in_array($setting, ['upload_max_filesize', 'post_max_size'])): ?>
                                    <?php 
                                    $size = (int)$value;
                                    if ($size >= 5): ?>
                                        <span class="status-success">✅ Good (≥5MB)</span>
                                    <?php else: ?>
                                        <span class="status-warning">⚠️ Small (&lt;5MB)</span>
                                    <?php endif; ?>
                                <?php else: ?>
                                    <span class="status-success">ℹ️ OK</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                
                <?php if ($phpConfig['file_uploads'] === 'Disabled'): ?>
                <div class="alert alert-warning">
                    <strong>Warning:</strong> File uploads are disabled in PHP configuration. Contact your hosting provider.
                </div>
                <?php endif; ?>
            </div>
            
            <!-- Database Connection Test -->
            <div class="section">
                <h3>🗄️ Database Connection Test</h3>
                <?php if ($dbTest['status'] === 'success'): ?>
                    <p class="status-success">✅ <?php echo $dbTest['message']; ?></p>
                    <p>Registrations table: <?php echo $dbTest['table_exists'] ? '✅ Exists' : '❌ Missing'; ?></p>
                    
                    <?php if (!$dbTest['table_exists']): ?>
                    <div class="alert alert-warning">
                        <strong>Action Required:</strong> Ensure the `registrations` table exists in Supabase and RLS policies allow reads and inserts.
                    </div>
                    <?php endif; ?>
                <?php else: ?>
                    <p class="status-error">❌ <?php echo $dbTest['message']; ?></p>
                    <div class="alert alert-warning">
                        Check database credentials and ensure the database exists.
                    </div>
                <?php endif; ?>
            </div>
            
            <!-- Instructions -->
            <div class="section">
                <h3>📋 Next Steps</h3>
                <ol>
                    <li><strong>Database Setup:</strong> Import the <code>database-setup.sql</code> file in phpMyAdmin</li>
                    <li><strong>File Permissions:</strong> Ensure uploads directory has proper write permissions (755 or 775)</li>
                    <li><strong>Security:</strong> .htaccess files have been created to protect uploads directory</li>
                    <li><strong>Testing:</strong> Test the registration form with actual file uploads</li>
                    <li><strong>Cleanup:</strong> Delete this setup file after successful setup</li>
                </ol>
                
                <div class="alert alert-info">
                    <strong>Hostinger Note:</strong> File uploads will be stored in the <code>/uploads/</code> directory. 
                    Make sure this directory is accessible by your web server but protected from direct PHP execution.
                </div>
            </div>
            
            <!-- File Structure -->
            <div class="section">
                <h3>📂 Created File Structure</h3>
                <div class="code-block">
uploads/<br>
├── .htaccess (security rules)<br>
├── index.php (access protection)<br>
├── payment_screenshots/<br>
│   ├── .htaccess<br>
│   └── index.php<br>
├── team_photos/<br>
│   ├── .htaccess<br>
│   └── index.php<br>
├── temp/<br>
│   ├── .htaccess<br>
│   └── index.php<br>
└── backups/<br>
    ├── .htaccess<br>
    └── index.php
                </div>
            </div>
        </div>
    </div>
</body>
</html>
