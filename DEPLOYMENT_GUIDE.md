# Hostinger Deployment Guide

## Overview
This guide will help you deploy your AI Hackathon website on Hostinger with PHP backend and MySQL database for form handling.

## Files Structure for Hostinger

```
your-website/
├── index.html (or index.php)
├── register-mysql.php (PHP backend with MySQL)
├── admin-view-registrations.php (Admin panel)
├── database-setup.sql (Database setup script)
├── public/
│   ├── hero-video.mp4
│   └── video-poster.jpg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── styles/
│       └── globals.css
├── components/
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── RegisterSection.tsx
│   └── ... (other components)
├── package.json
└── vite.config.ts
```

## Step 1: Build the React Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **The build output will be in the `dist/` folder**

## Step 2: Set Up MySQL Database

1. **Create MySQL Database:**
   - Log into your Hostinger control panel
   - Go to "Databases" → "MySQL Databases"
   - Create a new database (e.g., `hackathon_db`)
   - Create a database user with full privileges
   - Note down: database name, username, password, and host

2. **Set Up Database Table:**
   - Go to "Databases" → "phpMyAdmin"
   - Select your database
   - Go to "SQL" tab
   - Copy and paste the contents of `database-setup.sql`
   - Click "Go" to execute the SQL

## Step 3: Prepare Files for Hostinger

1. **Copy build files:**
   - Copy all contents from `dist/` folder to your Hostinger public_html directory

2. **Add PHP backend:**
   - Copy `register-mysql.php` to your Hostinger public_html directory
   - Copy `admin-view-registrations.php` to your Hostinger public_html directory

3. **Configure Database Connection:**
   - Edit `register-mysql.php` and `admin-view-registrations.php`
   - Replace the database configuration with your actual details:
     ```php
     $host = 'localhost';
     $dbname = 'your_actual_database_name';
     $username = 'your_actual_username';
     $password = 'your_actual_password';
     ```

4. **Add video files:**
   - Copy `hero-video.mp4` and `video-poster.jpg` from `public/` to your Hostinger public_html directory

## Step 4: Configure Hostinger

1. **Upload files via File Manager:**
   - Log into your Hostinger control panel
   - Go to File Manager
   - Navigate to `public_html` directory
   - Upload all the files

2. **Set file permissions:**
   - Set `register-mysql.php` to 644
   - Set `admin-view-registrations.php` to 644

## Step 5: Test the Website

1. **Visit your domain** to ensure the website loads correctly
2. **Test the registration form:**
   - Click "Register Now" button on the main website
   - It will redirect to `yourdomain.com/register-mysql.php`
   - Fill out the form and submit
   - Check that data is saved to MySQL database
3. **Test the admin panel:**
   - Visit `yourdomain.com/admin-view-registrations.php`
   - Enter password: `admin123` (change this in the file)
   - View all registrations and export to CSV if needed

## Important Notes

### Database Security
- Change the admin password in `admin-view-registrations.php` (default: `admin123`)
- Use strong database passwords
- Keep database credentials secure

### Security Features
- The `register-mysql.php` file includes input validation and sanitization
- Email uniqueness is enforced to prevent duplicate registrations
- SQL injection protection with prepared statements
- XSS protection with htmlspecialchars()

### Data Storage
- **Primary storage:** MySQL database table `registrations`
- **Backup:** Export to CSV from admin panel
- Data is automatically saved with timestamps and IP addresses

### Troubleshooting

1. **Form not submitting:**
   - Check if `register-mysql.php` is in the correct location
   - Verify database connection settings
   - Check PHP error logs in Hostinger control panel

2. **Database connection errors:**
   - Verify database credentials in PHP files
   - Check if MySQL database exists and is accessible
   - Ensure database table is created using `database-setup.sql`

3. **Admin panel not working:**
   - Check if admin password is correct
   - Verify database connection in admin file
   - Check file permissions

## File Descriptions

- **`register-mysql.php`** - Complete registration form with PHP backend that saves data to MySQL database
- **`admin-view-registrations.php`** - Admin panel to view all registrations with export functionality
- **`database-setup.sql`** - SQL script to create the database table
- **`index.html`** - Main website file (built from React)

## Database Schema

The MySQL table `registrations` contains the following columns:
1. `id` - Auto-increment primary key
2. `name` - Full name of the registrant
3. `email` - Email address (unique)
4. `college` - College/Organization name
5. `team_name` - Team name
6. `mobile` - Mobile number
7. `project_idea` - Project idea (optional)
8. `registration_date` - Timestamp of registration
9. `ip_address` - IP address of registrant

You can view and export this data through the admin panel at `yourdomain.com/admin-view-registrations.php` 