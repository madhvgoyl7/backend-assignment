# Testing Guide - MLM Application

## 🧪 Complete Test Scenarios

### Test Scenario 1: Root Member Creation ✅

**Purpose**: Create the first member (root of the tree)

**Steps**:
1. Navigate to http://localhost:3000/signup
2. Fill the form:
   - Member Code: `ADMIN001`
   - Name: `Admin User`
   - Email: `admin@mlm.com`
   - Password: `admin123`
   - Confirm Password: `admin123`
   - Sponsor Code: [Leave empty]
3. Click "Sign Up"

**Expected Results**:
- ✓ Success message: "Root member created successfully"
- ✓ Member Code displayed: `ADMIN001`
- ✓ Redirected to login page

**Verify**:
```bash
# Check members.json
cat "backend/members.json"
# Should show 1 member with sponsor_code: null, position: null
```

---

### Test Scenario 2: Direct Placement (Left Position) ✅

**Purpose**: Add first member under root in left position

**Steps**:
1. Logout (if logged in)
2. Go to signup page
3. Fill the form:
   - Member Code: `USER001`
   - Name: `John Doe`
   - Email: `john@mlm.com`
   - Password: `john123`
   - Confirm Password: `john123`
   - Sponsor Code: `ADMIN001`
4. Click "Validate" button
5. Select "Left" position
6. Click "Sign Up"

**Expected Results**:
- ✓ Sponsor validated: "Sponsor: Admin User"
- ✓ Both positions shown as available
- ✓ Success message with placement info: "Placed under: ADMIN001 (left)"

**Verify**:
```bash
# Check tree structure
cat "backend/members.json"
# ADMIN001 should have:
#   left_member: "USER001"
#   left_count: 1
# USER001 should have:
#   sponsor_code: "ADMIN001"
#   parent_code: "ADMIN001"
#   position: "left"
```

---

### Test Scenario 3: Direct Placement (Right Position) ✅

**Purpose**: Add second member under root in right position

**Steps**:
1. Signup with:
   - Member Code: `USER002`
   - Name: `Jane Smith`
   - Email: `jane@mlm.com`
   - Password: `jane123`
   - Sponsor Code: `ADMIN001`
   - Position: Right

**Expected Results**:
- ✓ Right position available
- ✓ Placed successfully under ADMIN001 (right)

**Verify**:
```bash
# ADMIN001 should now have:
#   left_member: "USER001"
#   right_member: "USER002"
#   left_count: 1
#   right_count: 1
```

---

### Test Scenario 4: Auto-Spill Logic ✅

**Purpose**: Test automatic spill when direct positions are filled

**Steps**:
1. Signup with:
   - Member Code: `USER003`
   - Sponsor Code: `ADMIN001`
2. Click "Validate"
3. Observe the message: "Both positions filled. Auto-spill will be applied"
4. Submit signup

**Expected Results**:
- ✓ Warning about auto-spill shown
- ✓ Member placed under USER001 or USER002 (first available)
- ✓ Success message shows: "Auto-spilled"

**Verify**:
```bash
# USER003 should be placed under USER001 (left position)
# USER001 should have:
#   left_member: "USER003"
#   left_count: 1
# ADMIN001 should have:
#   left_count: 2 (includes USER003 in USER001's leg)
#   right_count: 1
```

---

### Test Scenario 5: Deep Spill (Multiple Levels) ✅

**Purpose**: Test spill logic across multiple tree levels

**Steps**:
1. Add more members under ADMIN001:
   - `USER004` → Will go to USER001 right
   - `USER005` → Will go to USER002 left
   - `USER006` → Will go to USER002 right
   - `USER007` → Will spill to USER003 left (3rd level!)

**Expected Tree Structure**:
```
           ADMIN001
          /        \
      USER001      USER002
      /    \       /     \
  USER003 USER004 USER005 USER006
   /
USER007
```

**Verify Counts**:
```
ADMIN001:
  left_count: 4 (USER001, USER003, USER004, USER007)
  right_count: 3 (USER002, USER005, USER006)

USER001:
  left_count: 2 (USER003, USER007)
  right_count: 1 (USER004)

USER003:
  left_count: 1 (USER007)
  right_count: 0
```

---

### Test Scenario 6: Login & Session ✅

**Purpose**: Test authentication and session management

**Steps**:
1. Go to login page
2. Enter credentials:
   - Member Code: `ADMIN001`
   - Password: `admin123`
3. Click "Login"

**Expected Results**:
- ✓ Successful login
- ✓ Redirected to profile page
- ✓ Profile shows all details
- ✓ Session cookie set (check browser DevTools)

**Verify Session**:
```bash
# In browser console
console.log(document.cookie);
# Should show: mlm.sid=<session-id>
```

---

### Test Scenario 7: Profile Page Display ✅

**Purpose**: Verify profile information and statistics

**Steps**:
1. Login as `ADMIN001`
2. View profile page

**Expected Display**:
- ✓ Member Code: ADMIN001 (highlighted)
- ✓ Full Name: Admin User
- ✓ Email: admin@mlm.com
- ✓ Sponsor Code: Root Member
- ✓ Position: (empty for root)
- ✓ Joined Date: (formatted date)

**Statistics Section**:
- ✓ Total Members: 6 (if 7 members total including root)
- ✓ Left Team: 4 members (Direct: 1)
- ✓ Right Team: 3 members (Direct: 1)
- ✓ Animated stat cards with hover effects

---

### Test Scenario 8: Downline Tree Visualization ✅

**Purpose**: Test complete tree display

**Steps**:
1. Login as `ADMIN001`
2. Click "View Complete Downline Tree"

**Expected Display**:
- ✓ Tree structure showing all 7 members
- ✓ Each node shows:
  - Member code
  - Member name
  - Position badge (left/right)
  - Team counts (L: X, R: Y)
- ✓ Visual connections between nodes
- ✓ Color coding: Green for left, Orange for right
- ✓ Hover effects on nodes
- ✓ Legend at bottom

**Verify Tree Rendering**:
- ✓ Root at center
- ✓ Left branch on left side
- ✓ Right branch on right side
- ✓ Proper spacing between nodes
- ✓ Lines connecting parent to children

---

### Test Scenario 9: Sponsor Validation ✅

**Purpose**: Test sponsor code validation feature

**Test Cases**:

#### 9.1: Valid Sponsor with Available Positions
```
Sponsor Code: USER001
Expected: ✓ Sponsor: John Doe
         ✓ Left Position: Available
         ✓ Right Position: Available (or Filled)
```

#### 9.2: Valid Sponsor with Both Positions Filled
```
Sponsor Code: ADMIN001
Expected: ✓ Sponsor: Admin User
         ⚠ Auto-spill message displayed
```

#### 9.3: Invalid Sponsor Code
```
Sponsor Code: INVALID999
Expected: ✗ Error: "Sponsor code not found"
```

#### 9.4: Empty Sponsor Code
```
Sponsor Code: [empty]
Expected: ✗ Error: "Sponsor code is required"
```

---

### Test Scenario 10: Authentication & Security ✅

**Purpose**: Test security features

#### 10.1: Duplicate Member Code
```
Steps: Try to signup with existing member code (USER001)
Expected: ✗ Error: "Member code already exists"
```

#### 10.2: Duplicate Email
```
Steps: Try to signup with existing email
Expected: ✗ Error: "Email already exists"
```

#### 10.3: Password Mismatch
```
Steps: Enter different passwords in password and confirm fields
Expected: ✗ Error: "Passwords do not match"
```

#### 10.4: Short Password
```
Steps: Enter password with less than 6 characters
Expected: ✗ Error: "Password must be at least 6 characters"
```

#### 10.5: Wrong Login Credentials
```
Steps: Login with wrong password
Expected: ✗ Error: "Invalid member code or password"
```

#### 10.6: Access Protected Route Without Login
```
Steps: Navigate to /profile without logging in
Expected: ✓ Redirected to /login page
```

---

### Test Scenario 11: Multi-Session Testing ✅

**Purpose**: Test multiple users logged in simultaneously

**Steps**:
1. Open Browser 1: Login as `ADMIN001`
2. Open Browser 2 (Incognito): Login as `USER001`
3. In Browser 1: View downline
4. In Browser 2: View downline (should only see USER001's downline)

**Expected Results**:
- ✓ Both sessions independent
- ✓ Each user sees their own profile
- ✓ Each user sees their own downline
- ✓ No session conflicts

---

### Test Scenario 12: Logout Functionality ✅

**Purpose**: Test logout and session destruction

**Steps**:
1. Login as any user
2. Click "Logout" button
3. Try to access /profile

**Expected Results**:
- ✓ Success message: "Logout successful"
- ✓ Redirected to login page
- ✓ Session cookie cleared
- ✓ Cannot access protected routes
- ✓ Redirected to login if try to access /profile

---

## 🔍 Edge Cases & Stress Testing

### Edge Case 1: Very Deep Tree
**Test**: Create 15+ levels of tree
**Purpose**: Test recursion limits
**Expected**: May hit performance issues, but should work

### Edge Case 2: Unbalanced Tree
**Test**: Add all members to one side (only left)
**Purpose**: Test count updates
**Expected**: Counts should be accurate

### Edge Case 3: Rapid Signups
**Test**: Multiple signups within seconds
**Purpose**: Test concurrent operations
**Expected**: All members placed correctly without conflicts

### Edge Case 4: Large Names/Emails
**Test**: Very long names (100+ characters)
**Purpose**: Test UI rendering
**Expected**: Text should wrap or truncate properly

### Edge Case 5: Special Characters
**Test**: Member codes with special chars (!@#$)
**Purpose**: Test input validation
**Expected**: Should be allowed or properly validated

---

## 🐛 Known Issues & Limitations

### Current Limitations:
1. **Storage**: JSON file - not suitable for >1000 members
2. **Sessions**: In-memory - lost on server restart
3. **No Pagination**: Large downlines may be slow to load
4. **No Search**: Can't search for specific member in tree
5. **No Edit**: Can't edit member details after signup
6. **No Delete**: Can't remove members (tree integrity)

### Bug Reports Template:
```
Bug Title: [Brief description]
Steps to Reproduce:
1. [First step]
2. [Second step]
3. [...]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happened]

Environment:
- Browser: [Chrome/Firefox/etc]
- OS: [Windows/Mac/Linux]
- Node Version: [x.x.x]

Screenshots:
[If applicable]
```

---

## 📊 Performance Testing

### Backend Performance:
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5002/api/check-session

# Load test (requires Apache Bench)
ab -n 1000 -c 10 http://localhost:5002/api/check-session
```

### Frontend Performance:
```bash
# Build production version
cd frontend
npm run build

# Check bundle size
ls -lh build/static/js/*.js
```

### Expected Metrics:
- API Response: < 100ms
- Page Load: < 2s
- Tree Render (10 nodes): < 500ms
- Tree Render (100 nodes): < 3s

---

## ✅ Test Checklist

Copy this checklist and mark each item as you test:

### Signup & Registration
- [ ] Root member creation (no sponsor)
- [ ] Member with valid sponsor
- [ ] Direct left placement
- [ ] Direct right placement
- [ ] Auto-spill placement
- [ ] Sponsor validation
- [ ] Duplicate member code rejection
- [ ] Duplicate email rejection
- [ ] Password validation
- [ ] Password mismatch error

### Login & Authentication
- [ ] Successful login
- [ ] Failed login (wrong password)
- [ ] Failed login (wrong member code)
- [ ] Session creation
- [ ] Session persistence
- [ ] Logout functionality
- [ ] Session destruction on logout

### Profile Page
- [ ] Profile information display
- [ ] Statistics display (total, left, right)
- [ ] Direct member counts
- [ ] "View Downline" button works

### Downline Tree
- [ ] Tree structure renders correctly
- [ ] All members visible
- [ ] Position badges (left/right)
- [ ] Team counts displayed
- [ ] Visual connections between nodes
- [ ] Hover effects work
- [ ] Back button works
- [ ] Legend displays correctly

### Binary Tree Logic
- [ ] Direct placement when positions available
- [ ] Auto-spill when both positions filled
- [ ] BFS traversal (level-by-level)
- [ ] Count updates propagate up tree
- [ ] Correct parent-child relationships
- [ ] Position tracking (left/right)

### UI/UX
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Smooth animations
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages
- [ ] Form validation
- [ ] Button hover effects
- [ ] Gradient backgrounds

### Security
- [ ] Password hashing (bcrypt)
- [ ] HTTP-only cookies
- [ ] Protected routes
- [ ] CORS configuration
- [ ] Session expiration (24 hours)
- [ ] Input sanitization

---

## 🔬 Automated Testing (Future)

### Unit Tests (Jest + React Testing Library)
```javascript
// Example test cases
describe('Binary Tree Logic', () => {
  test('findAvailablePosition returns left when available', () => {
    // Test code
  });
  
  test('placeMemberInTree updates counts correctly', () => {
    // Test code
  });
  
  test('getDownline returns complete tree structure', () => {
    // Test code
  });
});

describe('Authentication', () => {
  test('login with valid credentials succeeds', async () => {
    // Test code
  });
  
  test('login with invalid credentials fails', async () => {
    // Test code
  });
});
```

### Integration Tests (Supertest)
```javascript
// Example API tests
describe('POST /api/signup', () => {
  test('creates root member successfully', async () => {
    // Test code
  });
  
  test('places member with auto-spill', async () => {
    // Test code
  });
});
```

### E2E Tests (Cypress)
```javascript
// Example E2E test
describe('Complete Signup Flow', () => {
  it('should signup, login, and view profile', () => {
    cy.visit('/signup');
    cy.get('#member_code').type('TEST001');
    // ... more steps
  });
});
```

---

## 📝 Test Data Generator

Use this script to quickly generate test members:

```javascript
// generate-test-members.js
const axios = require('axios');

const testMembers = [
  { code: 'TEST001', name: 'Test User 1', sponsor: null },
  { code: 'TEST002', name: 'Test User 2', sponsor: 'TEST001', position: 'left' },
  { code: 'TEST003', name: 'Test User 3', sponsor: 'TEST001', position: 'right' },
  { code: 'TEST004', name: 'Test User 4', sponsor: 'TEST001' }, // Will auto-spill
  // Add more...
];

async function generateMembers() {
  for (const member of testMembers) {
    try {
      const response = await axios.post('http://localhost:5002/api/signup', {
        member_code: member.code,
        name: member.name,
        email: `${member.code.toLowerCase()}@test.com`,
        password: 'test123',
        sponsor_code: member.sponsor,
        position: member.position
      });
      console.log(`✓ Created ${member.code}`);
    } catch (error) {
      console.error(`✗ Failed ${member.code}:`, error.response?.data?.message);
    }
  }
}

generateMembers();
```

Run with: `node generate-test-members.js`

---

## 🎯 Final Testing Tips

1. **Test in Order**: Start with root member, then build tree gradually
2. **Use Different Browsers**: Test in Chrome, Firefox, Safari
3. **Clear Data Between Tests**: Delete members.json for fresh start
4. **Check Console Logs**: Backend logs show all operations
5. **Use DevTools**: Check Network tab for API calls
6. **Test Mobile**: Use browser DevTools device emulation
7. **Document Issues**: Keep track of bugs found
8. **Performance Monitor**: Check React DevTools for rerenders

---

**Happy Testing! 🚀**

If you find any bugs, please document them and consider contributing a fix!
