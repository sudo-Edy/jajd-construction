# 🚀 DEPLOYMENT REFERENCE

## Local Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
npm run dev
```

**URLs**:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Health Check: http://localhost:5001/health

---

## Production Deployment

### Vercel (Frontend)
- **Repository**: sudo-edy/jajd-construction
- **Branch**: main
- **Environment Variables**:
  ```
  VITE_API_URL=https://jajd-construction-production.up.railway.app
  ```

### Railway (Backend)
- **Build Command**: `cd backend && npm ci && npm run build`
- **Start Command**: `cd backend && npm start` (which runs `node dist/server.js`)
- **Environment Variables**:
  ```
  PORT=5001 (auto-assigned, can override)
  NODE_ENV=production
  ```

---

## Quick Test Script

```bash
#!/bin/bash

# Test health
echo "Testing /health..."
curl -s http://localhost:5001/health | jq .

# Test POST
echo -e "\nTesting POST /api/lead..."
curl -s -X POST http://localhost:5001/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "555-1234",
    "zip": "12345",
    "property": "residential",
    "project": "renovation",
    "size": "medium"
  }' | jq .

# Test CORS
echo -e "\nTesting OPTIONS (CORS)..."
curl -s -X OPTIONS http://localhost:5001/api/lead \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep "Access-Control"
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill the process
kill -9 <PID>

# Rebuild and try again
npm run build
npm run dev
```

### Frontend can't reach backend
- Verify `.env.development` has `VITE_API_URL=http://localhost:5001`
- Check DevTools Network tab - look for OPTIONS + POST requests
- Verify CORS headers in response

### Form doesn't submit
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form
4. Check for OPTIONS request - should be 204
5. Check for POST request - should be 200
6. Check Console for errors

---

## File Structure

```
jajd-construction/
├── backend/
│   ├── server.ts           # Main Express app
│   ├── .env                # Local env vars
│   ├── package.json
│   └── tsconfig.json
├── components/             # React components
├── utils/
│   └── api.ts             # Frontend API client
├── .env.development        # Dev env vars
├── .env.production         # Production env vars
├── vite.config.ts         # Vite configuration
└── package.json
```

---

## Environment Variables Reference

### Frontend (.env.development)
```bash
VITE_API_URL=http://localhost:5001
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://jajd-construction-production.up.railway.app
```

### Backend (.env)
```bash
PORT=5001
NODE_ENV=development
```

---

## API Endpoints

### GET /health
- **Purpose**: Health check
- **Response**: `{ "ok": true }`
- **Status**: 200

### POST /api/lead
- **Purpose**: Submit lead form
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "zip": "string",
    "property": "string",
    "project": "string",
    "size": "string"
  }
  ```
- **Response**: `{ "success": true }`
- **Status**: 200

---

## Git Workflow

```bash
# View changes
git status
git diff

# Commit
git add .
git commit -m "description"

# Push to main
git push origin main
```

---

## When Adding Email Back

1. Install Resend: `npm install resend`
2. Add to backend/.env: `RESEND_API_KEY=your-key`
3. Add to Railway environment variables
4. Update backend/server.ts with email logic
5. Re-test all endpoints

---

**Last Updated**: January 21, 2026  
**Status**: ✅ All systems operational
