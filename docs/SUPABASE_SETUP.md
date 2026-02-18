# Supabase Setup Guide

## Step 1: Get Your API Keys

1. Go to your Supabase project: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy
2. Click on **Settings** (gear icon in the left sidebar)
3. Click on **API** in the settings menu
4. Copy the following values:
   - **Project URL** (already added: https://hrmcodfsajzpsgtjmfoy.supabase.co)
   - **anon/public key** (starts with "eyJ...")

## Step 2: Update Environment Variables

1. Open `.env.development` file
2. Replace `YOUR_ANON_KEY_HERE` with your actual **anon** key from Supabase

## Step 3: Run Database Schema

1. Go to your Supabase project: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `supabase-setup.sql` file
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned" - this is normal!

## Step 4: Create Storage Bucket for Images

1. In your Supabase project, click on **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name it: `project-images`
4. **Make it PUBLIC** (toggle the public switch ON)
5. Click **Create bucket**

## Step 5: Configure Storage Bucket Policies

1. Click on the `project-images` bucket you just created
2. Click on **Policies** tab
3. Click **New Policy**
4. Select **For full customization** template
5. Create two policies:

**Policy 1: Public Read Access**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `true`
- Click **Review** then **Save policy**

**Policy 2: Authenticated Upload/Update/Delete**
- Click **New Policy** again
- Policy name: `Authenticated users full access`
- Allowed operations: `INSERT`, `UPDATE`, `DELETE`
- Target roles: `authenticated`
- WITH CHECK expression: `true`
- Click **Review** then **Save policy**

## Step 6: Create Admin User

1. In your Supabase project, click on **Authentication** in the left sidebar
2. Click on **Users** tab
3. Click **Add user** button
4. Select **Create new user**
5. Enter your admin email and password
6. Make sure **Auto Confirm User** is checked
7. Click **Create user**

**Save your admin credentials somewhere safe!**

## Step 7: Verify Everything Works

Once you've completed all steps above, the application will automatically connect to Supabase and you can start using the admin panel!

## Troubleshooting

- **"Invalid API key" error**: Double-check your VITE_SUPABASE_ANON_KEY in `.env.development`
- **Can't see projects**: Make sure you ran the SQL schema and it completed successfully
- **Can't upload images**: Verify the storage bucket is PUBLIC and policies are set correctly
- **Can't login to admin**: Make sure you created an admin user in Authentication → Users
