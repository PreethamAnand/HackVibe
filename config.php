<?php
// Configuration file for HackVibe 2025 Registration System
// Switched from Hostinger MySQL to Supabase (PostgREST)

// Supabase configuration
$CONFIG = [
    'supabase_url' => 'https://mrcwryrygoopvaksvenv.supabase.co',
    'supabase_key' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY3dyeXJ5Z29vcHZha3N2ZW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzE5MzgsImV4cCI6MjA3MDg0NzkzOH0.j4Apd0CeL8o_AQsY4U3gzIcZqBv9RzbVJYEIG8gHSaQ',
    'rest_url'     => 'https://mrcwryrygoopvaksvenv.supabase.co/rest/v1',
];

// Email configuration (kept for reference/other scripts)
$EMAIL_CONFIG = [
    'smtp_host' => 'smtp.titan.email',
    'smtp_username' => 'vgnt@hackvibe.in',
    'smtp_password' => '8^fkRb!;FrU',
    'from_email' => 'vgnt@hackvibe.in',
    'from_name' => 'HackVibe 2025'
];

// Return configuration
return $CONFIG;
?>
