# HackVibe 2025 - Image Management Guide

## Overview
This guide explains the organized image management system for partner logos, judge photos, and mentor photos in the HackVibe 2025 project.

## 📁 Directory Structure

```
public/images/
├── logos/
│   ├── logo1.png (TechCorp Solutions)
│   ├── logo2.png (InnovateLab)
│   ├── logo3.png (StartupHub)
│   ├── logo4.png (CloudTech Inc)
│   ├── logo5.png (AI Dynamics)
│   ├── logo6.png (DevTools Pro)
│   └── README.md
├── judges/
│   ├── judge1.jpg (Dr. Emily Watson)
│   ├── judge2.jpg (Michael Brown)
│   ├── judge3.jpg (Priya Patel)
│   ├── judge4.jpg (James Wilson)
│   └── README.md
└── mentors/
    ├── mentor1.jpg (Rachel Green)
    ├── mentor2.jpg (Kevin Park)
    ├── mentor3.jpg (Amanda Lee)
    ├── mentor4.jpg (Carlos Rodriguez)
    ├── mentor5.jpg (Sophie Chen)
    ├── mentor6.jpg (Thomas Anderson)
    └── README.md
```

## 🎯 Features Implemented

### 1. Enhanced ImageWithFallback Component
- **Smart Fallback System**: Shows appropriate "Coming Soon" messages for missing images
- **Fallback Types**: 
  - `logo` - For partner company logos
  - `person` - For judge/mentor profile photos
  - `default` - Generic fallback
- **Visual Design**: Beautiful gradient backgrounds with icons matching the site theme

### 2. Organized File Naming
- **Logos**: `logo1.png`, `logo2.png`, etc.
- **Judges**: `judge1.jpg`, `judge2.jpg`, etc.
- **Mentors**: `mentor1.jpg`, `mentor2.jpg`, etc.

### 3. Automatic Fallback Display
When an image is missing, the system automatically shows:
- **For Logos**:
  - Building icon
  - "Coming Soon" text
  - "Partner Logo" subtitle
- **For Person Photos**:
  - User circle icon
  - "Coming Soon" text
  - "Profile Photo" subtitle

## 🖼️ Image Requirements

### Partner Logos
- **Size**: 200x100px minimum, 800x400px maximum
- **Format**: PNG (preferred), JPG, SVG
- **Background**: Transparent PNG recommended
- **File Size**: < 2MB

### Judge/Mentor Photos
- **Size**: 150x150px minimum, 500x500px maximum
- **Format**: JPG (preferred), PNG, WebP
- **Aspect Ratio**: Square (1:1)
- **File Size**: < 1MB
- **Style**: Professional headshots

## 🔧 Implementation Details

### Component Usage
```tsx
// For partner logos (will show "Coming Soon" if missing)
<ImageWithFallback
  src="/images/logos/logo1.png"
  alt="TechCorp Solutions"
  fallbackType="logo"
/>

// For person photos (judges/mentors)
<ImageWithFallback
  src="/images/judges/judge1.jpg"
  alt="Dr. Emily Watson"
  fallbackType="person"
/>
```

### Adding New Images

1. **Add Partner Logo**:
   - Save logo as `/public/images/logos/logoX.png` (where X is the number)
   - Update sponsor data in `GuestsSection.tsx` if adding new sponsors

2. **Add Judge Photo**:
   - Save photo as `/public/images/judges/judgeX.jpg`
   - Update judges array in `GuestsSection.tsx` if adding new judges

3. **Add Mentor Photo**:
   - Save photo as `/public/images/mentors/mentorX.jpg`
   - Update mentors array in `GuestsSection.tsx` if adding new mentors

## 🎨 Fallback Design

The fallback system uses the site's design language:
- **Colors**: Primary/secondary gradient backgrounds
- **Icons**: Lucide React icons (Building2, UserCircle)
- **Typography**: Consistent with site theme
- **Borders**: Dashed borders with primary color
- **Spacing**: Proper padding and margins

## 🚀 Benefits

1. **Professional Appearance**: "Coming Soon" placeholders look intentional and polished
2. **Easy Management**: Simple file naming convention
3. **Automatic Handling**: No broken image icons or empty spaces
4. **Responsive**: Works on all screen sizes
5. **Accessible**: Proper alt text and semantic markup
6. **Performance**: Optimized loading with proper error handling

## 📝 Adding New Sponsors/Judges/Mentors

### Step 1: Add Image File
```bash
# For partner logo
cp new_logo.png public/images/logos/logo7.png

# For judge photo
cp new_judge.jpg public/images/judges/judge5.jpg

# For mentor photo
cp new_mentor.jpg public/images/mentors/mentor7.jpg
```

### Step 2: Update Data Array
Add new entry to the appropriate array in `components/GuestsSection.tsx`:

```tsx
// For sponsors
{
  id: 'partner7',
  companyName: 'New Company',
  companyLogo: '/images/logos/logo7.png',
  person: {
    name: 'John Doe',
    role: 'CEO',
    image: '/images/judges/judge5.jpg',
    bio: 'Brief bio...',
    connection: 'How they help...'
  }
}
```

## 🔍 Testing

1. **With Images**: Place actual image files and verify they load correctly
2. **Without Images**: Remove image files and verify fallback displays properly
3. **Mixed State**: Test with some images present and others missing
4. **Responsive**: Test on different screen sizes
5. **Accessibility**: Test with screen readers

## 🎯 Future Enhancements

1. **Lazy Loading**: Implement intersection observer for performance
2. **WebP Support**: Add WebP format support with fallbacks
3. **Image Optimization**: Automatic resizing and compression
4. **CDN Integration**: Use cloud storage for better performance
5. **Admin Panel**: Interface for managing images without code changes

---

**✅ Image Management System Complete!**

The HackVibe 2025 project now has a professional, organized image management system with smart fallbacks and easy maintenance.
