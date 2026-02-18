# Admin Security Setup Guide

## Two-Factor Authentication (2FA)

Supabase provides built-in 2FA support for enhanced security. Here's how to enable it:

### Enable 2FA in Supabase (Project-Level)

1. **Go to Authentication Settings**
   - Navigate to: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy/auth/providers
   - Or: Your Supabase Dashboard → Authentication → Providers

2. **Enable Multi-Factor Authentication**
   - Scroll down to find **"Multi-Factor Authentication"** section
   - Toggle **"Enable Phone (SMS)"** or **"Enable Authenticator App (TOTP)"**
   - **Recommended**: Use Authenticator App (TOTP) for better security

3. **Save Changes**
   - Click **"Save"** to apply the settings

### How Users Enable 2FA on Their Accounts

Once 2FA is enabled at the project level, each admin user can set it up:

1. **First Login**
   - Log in to http://localhost:3000/admin with your email and password
   
2. **Set Up 2FA** (if using Authenticator App):
   - Download an authenticator app (Google Authenticator, Authy, 1Password, etc.)
   - In your admin account settings, click "Set up 2FA"
   - Scan the QR code with your authenticator app
   - Enter the 6-digit code to verify
   - Save your backup codes in a secure location

3. **Future Logins**
   - Enter email and password
   - Enter the 6-digit code from your authenticator app
   - Click "Verify"

### Custom 2FA Flow (Optional Enhancement)

If you want to add a custom 2FA enrollment flow in your admin panel, you can use Supabase's MFA API. Here's how:

```typescript
// Enroll in MFA
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
});

if (data) {
  // Show QR code: data.totp.qr_code
  // Display secret: data.totp.secret
  // Save factor ID: data.id
}

// Verify enrolled factor
const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
  factorId: factorId,
  challengeId: challengeId,
  code: '123456' // User's 6-digit code
});

// Check MFA status
const { data: { factors } } = await supabase.auth.mfa.listFactors();
```

---

## Multiple Admin Users

Supabase authentication naturally supports multiple users. Here's how to manage multiple admins:

### Adding New Admin Users

1. **Go to Supabase Dashboard**
   - Navigate to: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy/auth/users
   - Click **"Add user"** → **"Create new user"**

2. **Enter User Details**
   - **Email**: Admin's email address
   - **Password**: Secure password (or auto-generate)
   - **Auto Confirm User**: ✅ Check this box
   - Click **"Create user"**

3. **Share Credentials**
   - Send the email and password securely to the new admin
   - Recommend they change their password after first login
   - Have them enable 2FA for their account

### User Management Best Practices

**Email Verification:**
- If you want to send email verification links, configure email templates in Supabase
- Go to: Authentication → Email Templates
- Customize the confirmation and password reset emails

**Password Policies:**
- Supabase enforces minimum password length (6 characters by default)
- Encourage admins to use strong, unique passwords
- Consider using a password manager

**Role-Based Access (Advanced):**
If you need different permission levels (e.g., Super Admin, Editor, Viewer):

1. **Add a custom column to profiles table:**
```sql
-- Add an admin_role column
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS raw_user_meta_data JSONB;

-- Or create a separate profiles table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);
```

2. **Check role in your admin components:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
const role = user?.user_metadata?.role || 'editor';

// Conditionally show/hide features
if (role === 'super_admin') {
  // Show delete buttons, user management, etc.
}
```

---

## Session Management

### Session Duration

By default, Supabase sessions last for **1 hour** before requiring re-authentication.

**To change session duration:**
1. Go to: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy/auth/policies
2. Adjust **"JWT expiry duration"**
3. Recommended: Keep it short (1-6 hours) for admin panels

### Auto-Refresh Tokens

Supabase automatically refreshes access tokens, so users won't be logged out as long as they're active.

### Manual Logout

Admins can log out by clicking the **"Logout"** button in the admin dashboard, which calls:
```typescript
await supabase.auth.signOut();
```

---

## Security Best Practices

### ✅ Recommended Security Measures

1. **Enable 2FA** for all admin accounts
2. **Use strong passwords** (minimum 12 characters, mix of letters, numbers, symbols)
3. **Regular security audits** - Review active users monthly
4. **Monitor login activity** - Check Supabase Auth logs for suspicious activity
5. **HTTPS only** - Never access admin panel over HTTP in production
6. **IP whitelisting** (optional) - Restrict admin access to specific IPs
7. **Audit logs** - Track who made what changes (implement custom logging)

### 🚨 Security Warnings

- **Never share admin credentials** via email or unsecured channels
- **Disable old admin accounts** when team members leave
- **Review Supabase RLS policies** to ensure data isolation
- **Keep Supabase client library updated** for security patches
- **Never commit API keys** to version control (they're in .gitignore)

---

## Monitoring & Logging

### View Login Attempts

1. Go to: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy/auth/users
2. Click on a user to see their login history
3. Check for failed login attempts (potential security breach indicators)

### Custom Audit Logging (Optional)

If you want to track who made changes to projects:

```sql
-- Create audit log table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'publish', 'unpublish'
  resource_type TEXT NOT NULL, -- 'project', 'image'
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view audit logs"
  ON admin_audit_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audit logs"
  ON admin_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

Then log actions in your admin components:
```typescript
// After creating a project
await supabase.from('admin_audit_logs').insert({
  user_id: user.id,
  user_email: user.email,
  action: 'create',
  resource_type: 'project',
  resource_id: newProject.id,
  details: { title: newProject.title }
});
```

---

## Troubleshooting

### Can't enable 2FA?
- Make sure your Supabase plan supports MFA (available on Pro plan and above)
- Check if email/phone provider is configured

### User locked out after enabling 2FA?
- Use Supabase dashboard to disable 2FA for that user
- Go to: Auth → Users → Click user → Factors → Delete factor

### Multiple failed login attempts?
- Check Supabase Auth logs for the error message
- Reset the user's password via Supabase dashboard
- Consider implementing rate limiting

---

## Quick Setup Checklist

- [ ] Enable 2FA (TOTP) in Supabase settings
- [ ] Create your first admin user
- [ ] Log in and set up 2FA on your account
- [ ] Create additional admin users as needed
- [ ] Share login credentials securely
- [ ] Ensure all admins enable 2FA
- [ ] Set up email templates for password resets
- [ ] Document your security policies
- [ ] Review RLS policies monthly
- [ ] Monitor login activity regularly
