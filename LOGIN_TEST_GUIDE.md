# Login Test Guide

The database has been initialized with test users for all three roles. Use these credentials to test the login and role-based redirects:

## Test Credentials

### Admin Dashboard
- **User Code:** ADMIN001
- **Password:** admin123
- **Expected Redirect:** `/admin`

### Student Dashboard
- **User Code:** DBU-2024-STU
- **Password:** admin123
- **Expected Redirect:** `/student`

### Technician Dashboard
- **User Code:** DBU-2024-TEC
- **Password:** admin123
- **Expected Redirect:** `/technician`

## How Login & Redirect Works

1. **User enters credentials** and clicks "Sign In"
2. **Frontend sends request** to `/backend/index.php?action=login`
3. **Backend validates credentials** against the database
4. **Backend returns user data** with role information
5. **Frontend stores user in AuthContext** via `setUser()`
6. **useEffect detects user role change** and redirects to the appropriate dashboard
7. **Protected routes verify** the user's role matches the dashboard they're accessing

## Troubleshooting

If you see "Login failed":
1. Open **Browser Developer Console** (F12 or Right-Click → Inspect → Console)
2. Look for **API Request/Response logs** which show:
   - The exact request being sent
   - The server's response
   - Any error messages
3. Check that:
   - User code matches exactly (case-insensitive but stored in uppercase)
   - Password is exactly "admin123"
   - Username exists in the database

## Database Reset

If you need to reset the database and reinitialize with test data:
1. Visit: `http://localhost/campus_maintenance/backend/setup.php`
2. The page will reinitialize the database with all tables and test users

## Session Persistence

- Sessions are handled via PHP sessions with cookies
- The `withCredentials: true` setting in axios enables cookie-based auth
- After login, subsequent API calls will include the session cookie automatically
