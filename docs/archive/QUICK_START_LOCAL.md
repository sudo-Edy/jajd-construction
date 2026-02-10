# 🚀 QUICK START - LOCAL DEVELOPMENT

## Start Both Servers (2 terminals)

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5001
```

### Terminal 2: Frontend
```bash
npm run dev
# Runs on http://localhost:3000
```

---

## Test the API

### Health Check
```bash
curl http://localhost:5001/health
# {"ok":true}
```

### Submit a Lead
```bash
curl -X POST http://localhost:5001/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test User",
    "email":"test@example.com",
    "phone":"555-1234",
    "zip":"10001",
    "property":"Residential",
    "project":"Remodeling",
    "size":"Large"
  }'
# {"success":true}
```

---

## Browser Testing

1. Open http://localhost:3000
2. Fill out quote form
3. Submit
4. Open DevTools (F12) → Network
5. Look for:
   - OPTIONS request → 200
   - POST /api/lead → 200
   - Response: `{"success":true}`

---

## Environment Variables

### Development (.env.development)
```
VITE_API_URL=http://localhost:5001
```

### Backend (.env)
```
PORT=5001
NODE_ENV=development
```

### Production (.env.production)
```
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

---

## File Structure

```
jajd-construction/
├── backend/
│   ├── server.ts          ✅ Bare Express server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env               (ignored by git)
├── utils/
│   └── api.ts            ✅ Fetch to /api/lead
├── components/           (UI components)
├── vite.config.ts        ✅ No proxy
├── .env.development      ✅ VITE_API_URL=localhost:5001
├── .env.production       ✅ VITE_API_URL=railway.app
└── package.json
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5001 in use | Change backend/.env PORT to 5002 |
| Port 3000 in use | Vite will auto-try 3001, 3002, etc. |
| CORS errors | Backend has wildcard CORS enabled |
| POST returns error | Check backend console logs |
| No response | Ensure both servers are running |

---

## What Was Changed

✅ **Backend** - Stripped to essential 30 lines  
✅ **Frontend API** - Corrected endpoint to `/api/lead`  
✅ **CORS** - Wildcard origin enabled  
✅ **Email** - Removed (re-add when ready)  
✅ **Error Handling** - Simplified (no try/catch hiding)  
✅ **Environment** - Proper .env files set up

---

**Status**: ✅ READY TO TEST
