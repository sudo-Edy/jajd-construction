# Admin Panel User Guide

> 🔐 **Security Note**: For setting up 2FA and managing multiple admin users, see [`ADMIN_SECURITY.md`](file:///c:/Users/Creator/Documents/code%20projects/jajd-construction/docs/ADMIN_SECURITY.md)

## Accessing the Admin Panel

Navigate to: **http://localhost:3000/admin**

## Logging In

1. You'll see the admin login page
2. Enter the email and password you created in Supabase
3. Click **"Sign In"**
4. If 2FA is enabled, enter your 6-digit code from your authenticator app

If you haven't created an admin user yet:
1. Go to: https://app.supabase.com/project/hrmcodfsajzpsgtjmfoy/auth/users
2. Click **"Add user"**
3. Click **"Create new user"**
4. Enter your email and password
5. Make sure **"Auto Confirm User"** is checked
6. Click **"Create user"**

---

## Managing Projects

### View All Projects

After logging in, you'll see the **Project Gallery Manager** dashboard with a list of all your projects (published and drafts).

Each project card shows:
- **Thumbnail image**
- **Title and location**
- **Description**
- **Photo count**
- **Completion date**
- **Publish status** (Published/Draft)

---

### Add a New Project

1. Click the **"Add New Project"** button (yellow button with "+" icon)
2. The project editor will open

**Fill in the project details:**

**Required fields (marked with *):**
- **Project Title**: e.g., "Kitchen Cabinet Refinish"
- **Location**: e.g., "Papillion, NE"
- **Short Description**: Brief text shown on the project card
- **Project Images**: Upload at least one photo

**Optional fields:**
- **Detailed Description**: Full details shown in the gallery modal
- **Completion Date**: e.g., "January 2024"
- **Display Order**: Number to control sorting (lower = appears first)
- **Published**: Check to make visible on the public gallery

**Adding Images:**
1. Drag and drop images onto the upload zone, or click to browse
2. You can upload multiple images at once
3. Supported formats: JPG, PNG, GIF
4. Maximum size: 5MB per image
5. Upload progress will be shown
6. After upload, click **"Set as Thumbnail"** to choose the main image

**Save the project:**
- Click **"Save Project"** to publish
- Click **"Cancel"** to discard changes

---

### Edit an Existing Project

1. Find the project in the dashboard
2. Click the **Edit icon** (pencil icon)
3. The project editor will open with existing data
4. Make your changes:
   - Update text fields
   - Upload new images
   - Delete existing images (trash icon on hover)
   - Change the thumbnail (click "Set as Thumbnail")
5. Click **"Save Project"** when done

---

### Delete Project Images

While editing a project:
1. Hover over an image
2. Click the **red trash icon**
3. Confirm the deletion
4. The image will be removed from storage and database

Note: If you delete the current thumbnail image, you'll need to set a new thumbnail from the remaining images.

---

### Publish/Unpublish a Project

From the dashboard:
1. Find the project
2. Click the **eye icon** (👁️ for published, 👁️‍🗨️ for draft)
3. The status will toggle immediately

**Published projects** appear on the public gallery  
**Draft projects** are hidden from the public but visible in the admin panel

---

### Delete a Project

From the dashboard:
1. Find the project
2. Click the **red trash icon**
3. Confirm the deletion (this cannot be undone!)
4. The project and all its images will be permanently deleted

---

## Tips for Best Results

### Image Guidelines
- **Thumbnail**: Choose your best photo as the thumbnail (first impression!)
- **Quantity**: 5-10 images per project works well
- **Quality**: Use high-resolution images (but under 5MB)
- **Variety**: Show different angles and stages of the project

### Writing Descriptions
- **Short Description**: One sentence, punchy (shown on cards)
- **Detailed Description**: 2-3 paragraphs explaining the work done
- **Location**: Use recognizable neighborhoods/cities
- **Completion Date**: Month + Year is sufficient

### Display Order
- Lower numbers appear first
- Use increments of 10 (e.g., 10, 20, 30) to allow easy reordering
- Feature your best projects with lower numbers

---

## Logging Out

Click the **"Logout"** button in the top-right corner of the dashboard.

---

## Troubleshooting

### Can't log in?
- Double-check your email and password
- Verify the admin user was created in Supabase
- Make sure "Auto Confirm User" was checked

### Images not uploading?
- Check file size (must be under 5MB)
- Verify storage bucket `project-images` exists and is PUBLIC
- Check browser console for errors

### Projects not saving?
- Make sure all required fields (*) are filled
- Upload at least one image
- Check browser console for errors

### Changes not appearing on public site?
- Make sure the project is **Published** (not Draft)
- Hard refresh the public site (Ctrl+F5)
- Check that `is_published` is true in the database

---

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify your Supabase credentials in `.env.development`
3. Ensure the database schema was run correctly
4. Check that the storage bucket has proper permissions
