# 🚀 QUICK START GUIDE

## In 30 Seconds

### Terminal 1 - Start Backend
```bash
cd /Users/zeroday/Documents/jajd-construction/backend
npm run dev
```
**Expected**: `🚀 Server running on 5001`

### Terminal 2 - Start Frontend
```bash
cd /Users/zeroday/Documents/jajd-construction
npm run dev
```
**Expected**: `Local: http://localhost:3000/`

### Browser
Open: **http://localhost:3000**

---

## ✅ Test It Works

### In Browser Console
```javascript
// Open DevTools (F12), go to Console tab, paste:
fetch('http://localhost:5001/health').then(r => r.json()).then(console.log)
// Should log: {ok: true}
```

### Or In Terminal (new window)
```bash
curl http://localhost:5001/health
# Output: {"ok":true}
```

---

## 📝 To Submit a Form

1. Open http://localhost:3000
2. Scroll to quote form
3. Fill in all fields
4. Click "Submit"
5. Check DevTools Network tab - should see:
   - OPTIONS /api/lead → 200
   - POST /api/lead → 200
   - Response: `{"success":true}`

---

## 🛑 To Stop

- **Backend**: Press Ctrl+C in backend terminal
- **Frontend**: Press Ctrl+C in frontend terminal

---

## 🔧 Troubleshooting

### "Port 5001 already in use"
```bash
# Find and kill the process
lsof -i :5001
kill -9 <PID>
# Then restart: npm run dev
```

### "Can't reach backend from browser"
1. Check backend is running on 5001
2. Open DevTools → Network tab
3. Submit form
4. Look for OPTIONS request - if you see a CORS error, backend isn't running
5. If OPTIONS is green, it's a backend issue

### "Form doesn't submit"
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify `.env.development` has `VITE_API_URL=http://localhost:5001`

---

## 📊 What's Running

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 3000 | http://localhost:3000 | ✅ Vite |
| Backend | 5001 | http://localhost:5001 | ✅ Express |
| API | 5001 | /api/lead | ✅ POST only |
| Health | 5001 | /health | ✅ GET only |

---

## 🎯 Files You Might Need to Edit

### Frontend API Configuration
- `.env.development` - Change API URL if backend port changes
- `utils/api.ts` - Change fetch URL if endpoint changes
- `components/QuoteModal.tsx` - Change form logic

### Backend Configuration  
- `backend/.env` - Change PORT if needed
- `backend/server.ts` - Add new endpoints here

---

## 📚 Full Documentation

- **LOCAL_SETUP_VERIFICATION.md** - Complete test results
- **DEPLOYMENT_REFERENCE.md** - Deploy to production  
- **HARD_RESET_COMPLETE.md** - What changed and why
- **FINAL_STATUS_REPORT.md** - Current status

---

**That's it! You're ready to go.** 🎉
