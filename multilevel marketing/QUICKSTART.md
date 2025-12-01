# Quick Start Guide - MLM Application

## 🚀 5-Minute Setup

### Step 1: Start the Backend (Terminal 1)
```bash
cd "e:/BackEnd/multilevel marketing/backend"
npm install
npm start
```
✅ Backend running on: http://localhost:5002

### Step 2: Start the Frontend (Terminal 2)
```bash
cd "e:/BackEnd/multilevel marketing/frontend"
npm install
npm start
```
✅ Frontend running on: http://localhost:3000

### Step 3: Create Your Network

1. **Create Root Member** (http://localhost:3000/signup)
   - Member Code: `ADMIN001`
   - Name: `Admin User`
   - Email: `admin@mlm.com`
   - Password: `admin123`
   - Sponsor Code: [Leave empty]
   - Click "Sign Up"

2. **Login** (http://localhost:3000/login)
   - Member Code: `ADMIN001`
   - Password: `admin123`
   - Click "Login"

3. **View Profile**
   - See your member details
   - Check network statistics (0 members initially)

4. **Add First Member** (Logout and signup again)
   - Member Code: `USER001`
   - Name: `John Doe`
   - Email: `john@mlm.com`
   - Password: `john123`
   - Sponsor Code: `ADMIN001` (click "Validate")
   - Choose Position: Left
   - Click "Sign Up"

5. **Add Second Member**
   - Member Code: `USER002`
   - Name: `Jane Smith`
   - Email: `jane@mlm.com`
   - Password: `jane123`
   - Sponsor Code: `ADMIN001` (click "Validate")
   - Choose Position: Right
   - Click "Sign Up"

6. **Test Auto-Spill** (Add third member under ADMIN001)
   - Member Code: `USER003`
   - Name: `Bob Wilson`
   - Email: `bob@mlm.com`
   - Password: `bob123`
   - Sponsor Code: `ADMIN001` (click "Validate")
   - Notice: "Both positions filled. Auto-spill will place you..."
   - Will be placed under USER001 or USER002 automatically

7. **View Downline Tree**
   - Login as `ADMIN001`
   - Click "View Complete Downline Tree"
   - See the entire network structure

## 🎯 Key Features to Test

### ✅ Sponsor Validation
- Enter sponsor code and click "Validate"
- Shows sponsor name and position availability
- Real-time feedback

### ✅ Position Selection
- Choose left or right if available
- Auto-spill notification when both filled
- Automatic placement in downline

### ✅ Statistics Display
- Total team members
- Left team count (with direct members)
- Right team count (with direct members)
- Animated stat cards

### ✅ Downline Tree
- Visual tree structure
- Color-coded positions (green = left, orange = right)
- Member counts at each node
- Hover effects for better visibility

## 📊 Example Network Structure

After adding 7 members:

```
              ADMIN001
             /        \
        USER001      USER002
        /    \       /     \
    USER003 USER004 USER005 USER006
                    /
                USER007
```

## 🔐 Test Accounts

### Root Member
- Code: `ADMIN001`
- Password: `admin123`

### Regular Members
- Code: `USER001` | Password: `john123`
- Code: `USER002` | Password: `jane123`
- Code: `USER003` | Password: `bob123`

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5002 is available
# Kill any process using port 5002
netstat -ano | findstr :5002
taskkill /PID <PID> /F
```

### Frontend shows connection error
- Ensure backend is running on port 5002
- Check CORS settings in backend/server.js
- Clear browser cache and cookies

### Session not persisting
- Clear browser cookies
- Check if credentials are included in axios requests
- Restart both servers

### Can't validate sponsor
- Ensure sponsor member exists in members.json
- Check backend console for errors
- Verify sponsor code is correct

## 📝 API Testing (Optional)

### Using curl:

**Check health:**
```bash
curl http://localhost:5002/
```

**Validate sponsor:**
```bash
curl -X POST http://localhost:5002/api/validate-sponsor ^
  -H "Content-Type: application/json" ^
  -d "{\"sponsor_code\":\"ADMIN001\"}"
```

**Check session:**
```bash
curl http://localhost:5002/api/check-session ^
  -b "mlm.sid=<your-session-cookie>"
```

## 🎨 Customization Tips

### Change Colors
Edit `frontend/src/index.css` - line 14:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Change to your preferred gradient */
```

### Change Port
Edit `backend/server.js` - line 10:
```javascript
const PORT = 5002; // Change to your preferred port
```
Also update `frontend/src/api/axios.js` - line 4

### Add More Fields
Edit member schema in `backend/server.js` (signup route)
Add corresponding fields in `frontend/src/pages/Signup.js`

## 🚦 Development Tips

### Watch for changes:
```bash
# Backend with auto-restart
cd backend
npm run dev  # Uses nodemon

# Frontend (already has hot reload)
cd frontend
npm start
```

### View data:
```bash
# Check members.json
cat "backend/members.json"

# Or open in VS Code
code "backend/members.json"
```

### Clear all data:
```bash
# Delete members.json and restart
del "backend\members.json"
# Backend will create empty [] automatically
```

## ✨ Next Steps

1. ✅ Complete the quick start
2. 🎯 Build a network with 10+ members
3. 🌳 Test the downline tree visualization
4. 🔍 Explore the spill logic with different scenarios
5. 🎨 Customize the UI colors and styles
6. 🚀 Add your own features

## 📚 Learn More

- Read `README.md` for detailed documentation
- Check `backend/server.js` for binary tree logic
- Explore React components in `frontend/src/pages/`
- Understand authentication in `frontend/src/context/AuthContext.js`

## 🎉 You're All Set!

Enjoy building your MLM network application! 🚀

---

**Pro Tip**: Open two browser windows side by side - one for signup and one logged in as admin to see real-time network updates!
