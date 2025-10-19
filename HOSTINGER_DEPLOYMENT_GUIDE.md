# HackVibe 2025 - Hostinger Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the HackVibe 2025 registration system on Hostinger hosting platform with full image upload functionality.

## Pre-requisites
- Hostinger hosting account
- Access to phpMyAdmin
- FTP/File Manager access
- Domain configured

## 🚀 Deployment Steps

### Step 1: Upload Files to Hostinger

1. **Via File Manager or FTP:**
   - Upload all project files to your `public_html` directory
   - Ensure the following files are uploaded:
     - `register.php` (main registration file)
     - `database-setup.sql` (database schema)
     - `setup-uploads.php` (upload setup script)
     - All React build files (if applicable)

### Step 2: Database Setup

1. **Access phpMyAdmin:**
   - Log into your Hostinger control panel
   - Navigate to phpMyAdmin
   - Select your database (`Registration_D`)

2. **Import Database Schema:**
   - Click on "Import" tab
   - Choose file: `database-setup.sql`
   - Click "Go" to execute
   - Verify tables are created successfully

3. **Expected Tables Created:**
   - `registrations` - Main registration data
   - `uploads` - File upload tracking
   - `audit_log` - Audit trail
   - Various views and stored procedures

### Step 3: Configure Uploads Directory

1. **Run Setup Script:**
   - Visit: `https://yourdomain.com/setup-uploads.php`
   - This will create necessary directories and security files
   - Check all status indicators are green ✅

2. **Directory Structure Created:**
   ```
   uploads/
   ├── .htaccess (security)
   ├── index.php (protection)
   ├── payment_screenshots/
   ├── team_photos/
   ├── temp/
   └── backups/
   ```

3. **Security Features:**
   - `.htaccess` files prevent direct access
   - Only image/PDF files allowed
   - PHP execution disabled in uploads directory

### Step 4: Update Database Credentials

Edit `register.php` and update the database configuration:

```php
// Database configuration for Hostinger
$host = 'localhost';  // Usually localhost for Hostinger
$username = 'your_db_username';  // Your actual database username
$password = 'your_db_password';  // Your actual database password
$dbname = 'your_db_name';       // Your actual database name
```

### Step 5: Configure PHP Settings (if needed)

Ensure these PHP settings are enabled for file uploads:

```ini
file_uploads = On
upload_max_filesize = 10M
post_max_size = 10M
max_file_uploads = 20
memory_limit = 128M
```

Create `.htaccess` in root directory if adjustments needed:
```apache
php_value upload_max_filesize 10M
php_value post_max_size 10M
php_value max_file_uploads 20
```

## 🔧 Configuration Details

### Database Schema Updates

The new registration system includes:

**Enhanced Registration Fields:**
- Team leader information
- 3 team members (leader + 2 additional)
- Payment transaction details
- File uploads (payment screenshot, team photo)
- Project ideas
- College/organization details

**Security Features:**
- CSRF token protection
- Rate limiting (3 attempts/hour per IP)
- File type validation
- File size limits (5MB max)
- SQL injection protection

### File Upload Specifications

**Supported File Types:**
- Images: JPG, JPEG, PNG, GIF
- Documents: PDF
- Maximum size: 5MB per file

**Upload Fields:**
- `payment_screenshot` (required)
- `team_photo` (optional)

## 🛡️ Security Features

### 1. File Upload Security
- File type validation
- Size limitations
- Unique filename generation
- Protected upload directory
- No PHP execution in uploads

### 2. Database Security
- Prepared statements
- Input validation
- Rate limiting
- Audit logging
- CSRF protection

### 3. Directory Protection
```apache
# .htaccess in uploads directory
Options -Indexes
<FilesMatch "\.(jpg|jpeg|png|gif|pdf)$">
    Order allow,deny
    Allow from all
</FilesMatch>
<FilesMatch "\.php$">
    Order deny,allow
    Deny from all
</FilesMatch>
```

## 📊 Database Views & Procedures

### Useful Views Created:
- `recent_registrations` - Last 24 hours
- `registration_stats` - Daily statistics
- `team_details` - Complete team information
- `export_registrations` - Data export format

### Stored Procedures:
- `GetTeamSummary()` - Overall statistics

## 🔍 Testing Checklist

### 1. Basic Functionality
- [ ] Registration form loads correctly
- [ ] Countdown timer works
- [ ] Form validation functions
- [ ] Database connection successful

### 2. File Upload Testing
- [ ] Payment screenshot upload works
- [ ] Team photo upload works
- [ ] File size validation (>5MB rejected)
- [ ] Invalid file types rejected
- [ ] Files saved to correct directories

### 3. Security Testing
- [ ] CSRF protection active
- [ ] Rate limiting works
- [ ] SQL injection protected
- [ ] Directory browsing disabled
- [ ] PHP files not executable in uploads

### 4. Database Testing
- [ ] Registrations saved correctly
- [ ] Duplicate email detection
- [ ] Duplicate team name detection
- [ ] Audit logging works

## 🚨 Troubleshooting

### Common Issues:

**1. File Upload Fails:**
- Check directory permissions (755 or 775)
- Verify PHP upload settings
- Check available disk space

**2. Database Connection Fails:**
- Verify credentials in `register.php`
- Check database name spelling
- Ensure database exists

**3. Permission Denied:**
- Set uploads directory to 755 or 775
- Check .htaccess file conflicts
- Verify file ownership

**4. Files Not Uploading:**
```bash
# Check directory permissions
chmod 755 uploads/
chmod 755 uploads/payment_screenshots/
chmod 755 uploads/team_photos/
```

## 📈 Monitoring & Maintenance

### 1. Regular Checks
- Monitor disk space usage
- Check error logs regularly
- Verify backup procedures
- Review audit logs

### 2. Database Maintenance
```sql
-- Check registration stats
SELECT * FROM registration_stats;

-- View recent registrations
SELECT * FROM recent_registrations;

-- Get team summary
CALL GetTeamSummary();
```

### 3. File Cleanup
```php
// Optional: Clean up temp files older than 24 hours
$tempDir = 'uploads/temp/';
$files = glob($tempDir . '*');
foreach($files as $file) {
    if(is_file($file) && time() - filemtime($file) > 24*3600) {
        unlink($file);
    }
}
```

## 🎯 Key Features Implemented

### 1. Enhanced Registration Form
- ✅ HackVibe 2025 branding
- ✅ Countdown timer to September 11th
- ✅ Team-based registration (3 members)
- ✅ Payment verification
- ✅ File upload capability

### 2. Robust Backend
- ✅ Secure file handling
- ✅ Database optimization
- ✅ Error logging
- ✅ Audit trail
- ✅ Rate limiting

### 3. Hostinger Compatibility
- ✅ Standard PHP features
- ✅ MySQL/MariaDB support
- ✅ .htaccess configuration
- ✅ File permission handling

## 📞 Support

If you encounter issues:

1. Check the setup script output
2. Review error logs in Hostinger control panel
3. Verify database connections
4. Test file upload permissions
5. Ensure all files are uploaded correctly

## 🔄 Updates & Maintenance

Regular maintenance tasks:
- Monitor registration statistics
- Clean up old temp files
- Review security logs
- Update database backups
- Check for PHP/MySQL updates

---

**✅ Deployment Complete!**

Your HackVibe 2025 registration system is now ready for production use on Hostinger with full image upload functionality and enhanced security features.
