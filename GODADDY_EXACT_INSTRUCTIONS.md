# EXACT GoDaddy DNS Configuration Instructions

## ⚠️ READ EVERYTHING EXACTLY AS WRITTEN

Follow these instructions word-for-word. Do not skip any steps.

---

## STEP 1: Get Vercel Nameservers

**Before you touch GoDaddy, you MUST have your Vercel nameservers.**

1. **Open browser** → Go to: `https://vercel.com/dashboard`
2. **Sign in** with your GitHub account (sudo-Edy)
3. **Look for your project** named `jajd-construction`
4. **Click on** `jajd-construction` project
5. **Click on** "Settings" button (top right of project)
6. **In left sidebar**, click on "Domains"
7. **Click** "Add Domain"
8. **In the text box**, type: `jajdconstruction.com` (exactly as shown, no spaces)
9. **Click** "Add" button
10. **A dialog appears** with "Configure a third-party domain"
11. **Look for the section** that says "Nameservers"
12. **You will see 4 nameservers listed.** They look like:
    - `ns1.vercel-dns.com`
    - `ns2.vercel-dns.com`
    - `ns3.vercel-dns.com`
    - `ns4.vercel-dns.com`
13. **Copy these exactly** (you'll paste them in GoDaddy)

**Keep Vercel open in this browser tab. You'll come back here.**

---

## STEP 2: Open GoDaddy Website

1. **Open a NEW browser tab** (don't close Vercel tab)
2. **Type in address bar:** `https://godaddy.com`
3. **Press Enter**
4. **You see GoDaddy homepage**
5. **Look for** "Sign In" button (top right corner)
6. **Click** "Sign In"
7. **Enter your email** (the one you used to buy domain)
8. **Enter your password**
9. **Click** "Sign In" button
10. **Wait for page to load** (you're now logged in)

---

## STEP 3: Find Your Domain in GoDaddy

1. **Look at the top of page**, you should see "My Account" or your profile
2. **Click on** "My Products" or "Products" (if you see it)
3. **You see a list of products**
4. **Look for** "Domains" section
5. **Under Domains, find** `jajdconstruction.com`
6. **Click on** `jajdconstruction.com` to open it

---

## STEP 4: Access DNS Settings

1. **You're now on your domain page**
2. **Look for buttons/tabs at the top**, you should see:
   - "DNS"
   - "Nameservers"
   - "Records"
   - Or "Manage DNS"
3. **Click on** "Nameservers" button (if you see it)
   - **OR** Click on "Manage DNS" 
   - **OR** Click on "DNS"
4. **You see options for managing your domain**

---

## STEP 5: Change Nameservers (EXACT METHOD)

**If you see a "Change Nameservers" option:**

1. **Click** "Change Nameservers" button
2. **A dialog box appears** asking about nameservers
3. **Look for options** like:
   - "GoDaddy Nameservers" (currently selected)
   - "Custom Nameservers"
4. **Click** "Custom Nameservers" option
5. **New text boxes appear** for entering nameservers
6. **You see 4 empty boxes** (or boxes with old nameservers)

**Now enter Vercel's nameservers EXACTLY:**

7. **In the FIRST box**, type: `ns1.vercel-dns.com`
8. **In the SECOND box**, type: `ns2.vercel-dns.com`
9. **In the THIRD box**, type: `ns3.vercel-dns.com`
10. **In the FOURTH box**, type: `ns4.vercel-dns.com`

⚠️ **IMPORTANT: Do NOT leave any boxes empty. Fill all 4 boxes.**

11. **Look for a SAVE button** (usually blue, says "Save" or "Update")
12. **Click SAVE button** 
13. **Wait for confirmation message** (usually says "Nameservers updated successfully")
14. **You see a message** like "Your nameserver settings have been updated"

---

## STEP 6: Verify Update Completed

1. **You should see confirmation** on screen
2. **The page should reload**
3. **Your 4 Vercel nameservers should now show:**
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`

**If you see these, GoDaddy setup is DONE.**

---

## STEP 7: Go Back to Vercel to Verify

1. **Go back to your Vercel browser tab** (the one you left open)
2. **You should still see** the domain configuration screen
3. **Look for a "Verify" button** or "Check DNS"
4. **Click that button**
5. **Wait 30 seconds**
6. **Vercel will check** if nameservers are updated
7. **If successful**, you see green checkmark
8. **If not yet**, that's normal - DNS takes 24-48 hours

---

## STEP 8: Wait for DNS Propagation

**This is IMPORTANT: Do NOT skip this**

- **DNS changes take 24-48 hours** to fully propagate
- **Your domain might not work immediately**
- **After 24 hours**, try visiting `https://jajdconstruction.com`
- **It might still take up to 48 hours**

**To check status:**
1. **Go to:** `https://dnschecker.org`
2. **In search box**, type: `jajdconstruction.com`
3. **Click "Search"**
4. **You see nameserver status from different locations**
5. **Green = updated, Red = not yet updated**
6. **When mostly green**, your domain is ready

---

## STEP 9: Test Your Domain

**AFTER 24-48 hours:**

1. **Open browser**
2. **Type in address bar:** `https://jajdconstruction.com`
3. **Press Enter**
4. **You should see your website load**
5. **If it loads**, DNS is working! ✅
6. **If it shows error**, wait more or check dnschecker.org again

---

## TROUBLESHOOTING

### "I can't find Nameservers in GoDaddy"

**Alternative method:**

1. **Go back to GoDaddy domain page**
2. **Look for "DNS Records" or "Manage DNS"**
3. **Click on it**
4. **Look for section that says "Nameservers"**
5. **You should see option to edit nameservers there**
6. **Follow same steps as STEP 5**

### "I see a message saying 'Update in progress'"

**This is normal:**
- Wait 15 minutes
- Refresh page
- Try again

### "Domain still not working after 48 hours"

1. **Check dnschecker.org again**
2. **Make sure all 4 nameservers are showing correctly**
3. **In GoDaddy**, verify the 4 nameservers are still saved:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
   - `ns3.vercel-dns.com`
   - `ns4.vercel-dns.com`
4. **Check that you entered them with NO typos**

---

## SUMMARY

1. ✅ Get nameservers from Vercel
2. ✅ Log into GoDaddy
3. ✅ Go to your domain
4. ✅ Click "Nameservers" or "Manage DNS"
5. ✅ Choose "Custom Nameservers"
6. ✅ Enter all 4 Vercel nameservers (EXACTLY as shown)
7. ✅ Click SAVE
8. ✅ Wait 24-48 hours
9. ✅ Test domain

---

## WHEN YOU'RE DONE

Reply to me with:
- ✅ "Nameservers updated in GoDaddy"
- ✅ The 4 nameservers you entered
- ✅ The confirmation message you saw

Then I'll tell you the NEXT step. 🚀
