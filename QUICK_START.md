# 🚀 Quick Start Guide - JAJD Construction

## 1️⃣ FASTEST WAY TO VIEW THE APP

**Double-click this file in Windows Explorer:**
```
START_DEV.bat
```

This will:
- Install dependencies
- Start the dev server
- Open on localhost:3000

---

## 2️⃣ MANUAL START (If batch file doesn't work)

**Open Command Prompt and type:**

```bash
cd c:\Users\Creator\Documents\code projects\jajd-construction
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## 3️⃣ WHAT YOU'LL SEE

✅ Full JAJD Construction website  
✅ Live preview on localhost:3000  
✅ Admin panel at localhost:3000/admin  
✅ Hot reload enabled (changes auto-update)  

---

## 4️⃣ PROJECT STATUS

**✅ NO ERRORS FOUND**
- All TypeScript files valid
- All dependencies installed
- Configuration correct
- Ready to run immediately

---

## 5️⃣ AVAILABLE COMMANDS

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # View production build
```

---

## 6️⃣ COMMON ISSUES & SOLUTIONS

### "Port 3000 already in use"
- Stop other services using port 3000
- Or change vite.config.ts port setting

### "Missing environment variables"
- Check .env.development file exists
- Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### "npm not found"
- Install Node.js from nodejs.org
- Restart your terminal after installation

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main React component |
| `index.tsx` | App entry point |
| `vite.config.ts` | Vite configuration |
| `tsconfig.json` | TypeScript settings |
| `package.json` | Dependencies |
| `config.ts` | Company settings |

---

## 🔗 PROJECT LINKS

- **Dev Server:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Full Report:** CODE_SCAN_REPORT.md
- **Supabase Dashboard:** https://supabase.com

---

**See CODE_SCAN_REPORT.md for detailed analysis and findings.**
