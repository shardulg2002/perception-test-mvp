# Admin Dashboard Access

## Security Notice
⚠️ **CONFIDENTIAL - Admin Only**

The admin dashboard is a secure backend interface for viewing and managing all test session data. It should NOT be accessible to regular users.

## Access Details

**Admin Login URL:** `/admin/login`

**Credentials:**
- Username: `admin`
- Password: `AdminPass2025!`

## Features

### 🔐 Authentication
- Secure login required
- Session-based authentication
- Auto-logout on session end

### 📊 Aggregate Statistics
- Total sessions and candidates
- Overall success rates across all experiments
- Average reaction times
- Experiment-wise breakdowns

### 📋 Session Management
- View all test sessions
- Search by name, application number, or session ID
- Detailed view of individual sessions
- Delete individual sessions
- Clear all data (with double confirmation)

### 📥 Data Export
- **Export CSV:** Tabular format with all key metrics
- **Export JSON:** Complete raw data for detailed analysis
- Individual session export available

### 📈 Experiment Data Displayed

**Experiment 1: Perception Test**
- Trial-by-trial results
- Success/failure outcomes
- Reaction times
- Distance to obstacle

**Experiment 2: Fuel Pump Risk Task**
- Points earned per session
- Number of pumps per trial
- Explosion tracking
- Risk-taking behavior analysis

**Experiment 3: Illusion of Control**
- Manual vs Assist mode choices
- Action taken in each scenario
- Outcome results (crash/near-miss/safe-pass)
- Attribution answers

## Production Security Recommendations

For production deployment, implement the following:

1. **Environment Variables:** Move credentials to `.env` file
   ```
   VITE_ADMIN_USERNAME=your_username
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

2. **Server-Side Authentication:** Implement proper JWT/OAuth authentication

3. **Database Backend:** Store session data in secure database (Supabase, PostgreSQL, etc.)

4. **Role-Based Access Control (RBAC):** Implement multiple admin permission levels

5. **Audit Logging:** Track all admin actions (logins, exports, deletions)

6. **HTTPS Only:** Ensure all admin traffic uses HTTPS

7. **Session Timeout:** Implement automatic logout after inactivity

8. **IP Whitelisting:** Restrict admin access to specific IP addresses

9. **Two-Factor Authentication (2FA):** Add extra security layer

10. **Regular Password Rotation:** Change admin credentials periodically

## Current Implementation

The current implementation uses:
- Client-side localStorage for data persistence
- SessionStorage for authentication state
- Simple username/password validation
- No server-side validation

**⚠️ This is suitable for MVP/demo purposes only. Do NOT use in production without implementing proper security measures.**

## Usage Instructions

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access comprehensive dashboard with all session data
4. Export data as needed (CSV for spreadsheets, JSON for analysis)
5. Manage sessions (view details, delete individual, or clear all)
6. Logout when finished

## Notes

- Regular users have NO access to this dashboard
- Users only see their own session via the `/dashboard` route
- Admin sees ALL sessions from ALL users
- Data persists in browser localStorage
- Clearing browser data will erase all sessions
