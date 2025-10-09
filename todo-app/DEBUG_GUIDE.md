# 🐛 Debugging "Unauthorized" Error - Complete Guide

## 🔍 Problem Analysis

The "Unauthorized. Please login first." error occurs when:
1. Session cookies are not being sent with requests
2. Session is not persisting between requests
3. CORS is blocking credentials

## ✅ Fixes Applied (Latest)

### Backend Changes:
1. **Enhanced CORS Configuration**
   - Added explicit methods and headers
   - Added `exposedHeaders: ['set-cookie']`
   - Added OPTIONS handler for preflight

2. **Improved Session Configuration**
   - Custom session name: `todo.sid`
   - Added `rolling: true` - resets expiration on each request
   - Added `path: '/'` to cookie config
   - Increased verbosity in session creation

3. **Enhanced Logging**
   - All requests logged with session info
   - Authentication checks show detailed session state
   - Error responses include session debug info

### Frontend Changes:
1. **Enhanced Axios Instance**
   - Added timeout (10 seconds)
   - Detailed request/response logging
   - Cookie information in logs
   - Better error handling

## 🚀 Steps to Fix Completely

### Step 1: Stop Everything
```cmd
# Stop backend (Ctrl+C in backend terminal)
# Stop frontend (Ctrl+C in frontend terminal)
```

### Step 2: Clear Browser Data
**VERY IMPORTANT!**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage:
   - Cookies
   - Local Storage
   - Session Storage
4. OR use Incognito/Private mode

### Step 3: Restart Backend
```cmd
cd e:\BackEnd\todo-app\backend
node server.js
```

**Expected output:**
```
🚀 Todo App Backend running on http://localhost:5001
```

### Step 4: Restart Frontend
```cmd
cd e:\BackEnd\todo-app\frontend
npm start
```

**Expected output:**
```
webpack compiled successfully
```

### Step 5: Test with Console Open

1. **Open Browser DevTools (F12)**
2. **Go to Console tab** - Keep it open!
3. **Login** and watch the logs

**You should see:**
```
🚀 Request: POST /api/login
📦 Data: {username: "...", password: "..."}
🍪 withCredentials: true
✅ Response: 200 /api/login
```

**In Backend Terminal:**
```
[timestamp] POST /api/login
Session ID: xxxxxx
User ID in session: undefined
Cookies: undefined

Session created: {
  sessionID: 'xxxxxx',
  userId: 'user-uuid',
  username: 'madhavkalra'
}
```

4. **Add a Task** and watch the logs

**You should see:**
```
🚀 Request: POST /api/tasks
📦 Data: {title: "..."}
🍪 withCredentials: true
✅ Response: 201 /api/tasks
```

**In Backend Terminal:**
```
[timestamp] POST /api/tasks
Session ID: xxxxxx
User ID in session: user-uuid
Cookies: todo.sid=s%3Axxxxxx

=== Authentication Check ===
Session ID: xxxxxx
User ID: user-uuid
✅ Authenticated
```

### Step 6: If Still Failing

**Check Backend Terminal for:**
```
❌ Authentication failed - No valid session
```

**If you see this, check:**
1. Is the sessionID the same in both requests?
2. Are cookies being sent? (Check "Cookies: " line)
3. Is userId present in session?

## 🔧 Manual Testing

### Test 1: Check Session Endpoint
```javascript
// In browser console after login:
fetch('http://localhost:5001/api/check-session', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
```

**Expected:**
```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "username": "madhavkalra"
  }
}
```

### Test 2: Check Cookies
```javascript
// In browser console:
document.cookie
```

**Expected to see:**
```
"todo.sid=s%3Axxxxxx..."
```

### Test 3: Manual Task Creation
```javascript
// In browser console after login:
fetch('http://localhost:5001/api/tasks', {
  method: 'POST',
  credentials: 'include',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({title: 'Test Task'})
})
.then(r => r.json())
.then(console.log)
```

## 🐛 Common Issues & Solutions

### Issue 1: Session ID Changes Between Requests
**Cause:** Session not being saved
**Solution:** Already fixed with `resave: true` and `req.session.save()`

### Issue 2: No Cookies Being Sent
**Cause:** Browser not storing cookies
**Solution:** 
- Check CORS allows credentials ✅
- Check `withCredentials: true` in axios ✅
- Clear browser cache/cookies
- Try incognito mode

### Issue 3: Session Lost After First Request
**Cause:** Session expiring too quickly
**Solution:** Already fixed with `rolling: true`

### Issue 4: CORS Errors
**Cause:** Preflight requests failing
**Solution:** Already fixed with OPTIONS handler

## 📊 What to Look For

### ✅ Good Signs:
- Same sessionID in login and task creation
- Cookies present in request headers
- userId present in session
- No CORS errors in console

### ❌ Bad Signs:
- Different sessionID between requests
- No cookies in request headers
- "userId: undefined" in session
- CORS errors in console

## 🎯 Final Checklist

- [ ] Backend restarted
- [ ] Frontend restarted  
- [ ] Browser cache cleared
- [ ] DevTools console open
- [ ] Login successful
- [ ] Session cookie visible in Application tab
- [ ] First task added successfully
- [ ] Second task added successfully
- [ ] No "Unauthorized" errors

## 💡 Pro Tips

1. **Use Incognito Mode** - Avoids cached sessions
2. **Watch Backend Terminal** - Shows exact session state
3. **Check Network Tab** - See if cookies are sent
4. **Keep Console Open** - See detailed axios logs

---

If you follow all these steps and still get the error, please:
1. Take a screenshot of backend logs
2. Take a screenshot of browser console
3. Share both for deeper analysis
