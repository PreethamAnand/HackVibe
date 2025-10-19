# Unique Code Feature for HackVibe 2025 Registration

## Overview
This feature automatically generates a unique 6-digit code for each team upon successful registration and provides a downloadable text file with all registration details.

## Features Implemented

### 1. Unique Code Generation
- **Automatic Generation**: Each team gets a unique 6-digit code (100000-999999)
- **Uniqueness Guarantee**: The system ensures no duplicate codes exist
- **Database Storage**: Codes are saved to the database with the registration data

### 2. Success Page (Step 5)
- **Visual Display**: Large, prominent display of the unique code
- **Registration Summary**: Complete team and payment information
- **Download Button**: Allows users to download registration details as a .txt file
- **Important Notes**: Clear instructions for event day

### 3. File Download
- **Format**: Plain text (.txt) file
- **Content**: Complete registration details including:
  - Team information
  - Member details
  - Payment confirmation
  - Unique code
  - Event details
  - Important instructions

## Database Changes

### New Column Added
```sql
ALTER TABLE public.registrations 
ADD COLUMN unique_code text;

CREATE UNIQUE INDEX uq_registrations_unique_code 
ON public.registrations(unique_code);
```

### Schema Update
The `supabase_schema.sql` file has been updated to include:
- `unique_code` column in the registrations table
- Unique constraint on the `unique_code` field

## Files Modified

### 1. `src/lib/supabase.ts`
- Added `unique_code` field to `RegistrationData` interface
- Added `generateUniqueCode()` function
- Added `checkUniqueCodeExists()` function
- Added `generateUniqueCodeForRegistration()` function
- Added `downloadRegistrationDetails()` function
- Updated `submitRegistration()` function to generate codes automatically

### 2. `components/RegistrationPage.tsx`
- Added new state variables for unique code and registration data
- Added Step 5 (Success) with unique code display
- Added download functionality
- Updated navigation logic for 5 steps
- Added success animations and styling

### 3. `src/styles/globals.css`
- Added `.glow-green` class for success page styling

## User Experience Flow

1. **Registration**: User completes all 4 steps of registration
2. **Submission**: Form is submitted and unique code is generated
3. **Success Page**: User sees Step 5 with:
   - Success confirmation
   - Large unique code display
   - Registration summary
   - Download button
   - Important notes
4. **Download**: User can download a .txt file with all details
5. **Event Day**: User brings the unique code and ID proof

## Technical Implementation

### Code Generation Algorithm
```typescript
function generateUniqueCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
```

### Uniqueness Check
- Generates codes until a unique one is found
- Maximum 100 attempts to prevent infinite loops
- Database-level unique constraint as backup

### File Download
- Uses HTML5 Blob API
- Creates downloadable text file
- Automatic file naming: `HackVibe_Registration_{TeamName}_{Code}.txt`

## Security Features

- **Unique Constraint**: Database-level uniqueness enforcement
- **No Code Reuse**: Each registration gets a fresh, unique code
- **Validation**: Multiple layers of uniqueness checking

## Styling and Theme

The success page maintains the website's cyberpunk aesthetic:
- Glassmorphism effects
- Gradient text and backgrounds
- Glow effects (purple, cyan, green)
- Consistent with existing design patterns
- Responsive design for all screen sizes

## Future Enhancements

Potential improvements could include:
- QR code generation for the unique code
- Email confirmation with the unique code
- SMS notification with the code
- Admin panel to view all codes
- Code validation system for event check-in

## Database Migration

For existing databases, run the provided SQL script:
```sql
-- Run add_unique_code_column.sql
-- This adds the unique_code column to existing tables
```

## Testing

Test the feature by:
1. Completing a full registration
2. Verifying the unique code is generated
3. Checking the code is saved to the database
4. Testing the download functionality
5. Ensuring no duplicate codes are generated 