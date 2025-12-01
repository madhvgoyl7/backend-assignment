# MLM System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            React Application (Port 3000)               │ │
│  │                                                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │ │
│  │  │  Login   │  │  Signup  │  │ Profile  │           │ │
│  │  └──────────┘  └──────────┘  └──────────┘           │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │     Downline Tree Visualization      │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │      AuthContext (State Manager)     │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  │                     ↓                                 │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │   Axios Instance (HTTP Client)       │            │ │
│  │  │   - withCredentials: true            │            │ │
│  │  │   - baseURL: /api                    │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP Requests (with cookies)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Express.js Server (Port 5002)                │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │       Middleware Pipeline            │            │ │
│  │  │  1. CORS                             │            │ │
│  │  │  2. Body Parser (JSON)               │            │ │
│  │  │  3. Express Session                  │            │ │
│  │  │  4. Logging                          │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  │                     ↓                                 │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │         Route Handlers               │            │ │
│  │  │  - Auth Routes                       │            │ │
│  │  │  - Member Routes                     │            │ │
│  │  │  - Protected Routes                  │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  │                     ↓                                 │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │    Binary Tree Logic Engine          │            │ │
│  │  │  - findAvailablePosition()           │            │ │
│  │  │  - placeMemberInTree()               │            │ │
│  │  │  - updateCounts()                    │            │ │
│  │  │  - getDownline()                     │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  │                     ↓                                 │ │
│  │  ┌──────────────────────────────────────┐            │ │
│  │  │      File System Storage             │            │ │
│  │  │      members.json                    │            │ │
│  │  └──────────────────────────────────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### 1. Member Signup Flow

```
User (Browser)
    │
    │ 1. Fill signup form
    ├─────────────────────►  Signup.js
    │                           │
    │                           │ 2. Validate sponsor
    │                           │    POST /api/validate-sponsor
    │                           ├──────────────►  Server
    │                           │                   │
    │                           │                   │ 3. Check sponsor exists
    │                           │                   ├───► members.json
    │                           │                   │
    │                           │ 4. Return availability
    │                           │◄──────────────────┤
    │                           │
    │ 5. Display position options
    │◄──────────────────────────┤
    │
    │ 6. Submit signup
    ├─────────────────────►  AuthContext
    │                           │
    │                           │ 7. POST /api/signup
    │                           ├──────────────►  Server
    │                           │                   │
    │                           │                   │ 8. Hash password
    │                           │                   │
    │                           │                   │ 9. Find position (BFS)
    │                           │                   │
    │                           │                   │ 10. Place in tree
    │                           │                   │
    │                           │                   │ 11. Update counts recursively
    │                           │                   │
    │                           │                   │ 12. Save to members.json
    │                           │                   ├───► members.json
    │                           │                   │
    │                           │ 13. Return success + placement info
    │                           │◄──────────────────┤
    │                           │
    │ 14. Show success message
    │◄──────────────────────────┤
    │
    │ 15. Navigate to login
    └─────────────────────►  Login.js
```

### 2. Member Login Flow

```
User (Browser)
    │
    │ 1. Enter credentials
    ├─────────────────────►  Login.js
    │                           │
    │                           │ 2. Submit login
    │                           ├──────────────►  AuthContext
    │                           │                   │
    │                           │                   │ 3. POST /api/login
    │                           │                   ├───────────►  Server
    │                           │                   │                 │
    │                           │                   │                 │ 4. Find member
    │                           │                   │                 ├───► members.json
    │                           │                   │                 │
    │                           │                   │                 │ 5. Compare password (bcrypt)
    │                           │                   │                 │
    │                           │                   │                 │ 6. Create session
    │                           │                   │                 │    req.session.memberId = ...
    │                           │                   │                 │
    │                           │                   │                 │ 7. Save session
    │                           │                   │                 │
    │                           │                   │ 8. Return member + Set-Cookie
    │                           │                   │◄────────────────┤
    │                           │                   │
    │                           │ 9. Store member in state
    │                           │◄──────────────────┤
    │                           │
    │ 10. Receive member data
    │◄──────────────────────────┤
    │
    │ 11. Navigate to profile
    └─────────────────────►  Profile.js
```

### 3. Binary Tree Placement Algorithm

```
placeMemberInTree(newMember, sponsorCode, preferredPosition)
    │
    ├─► 1. Find sponsor member
    │       sponsor = findMember(members, sponsorCode)
    │
    ├─► 2. Check preferred position
    │       if (preferredPosition && sponsor[preferredPosition] is empty)
    │           └─► Place at preferred position
    │                   actualParent = sponsor
    │                   actualPosition = preferredPosition
    │       else
    │           └─► 3. Use Auto-Spill (BFS)
    │                   │
    │                   ├─► Initialize queue = [sponsor]
    │                   │
    │                   ├─► While queue not empty:
    │                   │       current = queue.dequeue()
    │                   │       
    │                   │       if (current.left is empty)
    │                   │           └─► Found! Place at left
    │                   │                   actualParent = current
    │                   │                   actualPosition = 'left'
    │                   │                   break
    │                   │       
    │                   │       if (current.right is empty)
    │                   │           └─► Found! Place at right
    │                   │                   actualParent = current
    │                   │                   actualPosition = 'right'
    │                   │                   break
    │                   │       
    │                   │       queue.enqueue(current.leftChild)
    │                   │       queue.enqueue(current.rightChild)
    │                   │
    │
    ├─► 4. Set member properties
    │       newMember.position = actualPosition
    │       newMember.parent_code = actualParent.member_code
    │       actualParent[actualPosition + '_member'] = newMember.member_code
    │
    ├─► 5. Update counts recursively up the tree
    │       updateCounts(members, actualParent.member_code, actualPosition)
    │           │
    │           ├─► Increment parent's count (left_count or right_count)
    │           │
    │           └─► Recursively update grandparent, great-grandparent, etc.
    │
    └─► 6. Return placement details
            {
                actualParent: actualParent.member_code,
                actualPosition: actualPosition,
                wasSpilled: actualParent !== sponsor
            }
```

### 4. Downline Tree Retrieval

```
getDownline(memberCode)
    │
    ├─► 1. Find member
    │       member = findMember(members, memberCode)
    │
    ├─► 2. Create node object
    │       node = {
    │           member_code,
    │           name,
    │           email,
    │           position,
    │           left_count,
    │           right_count,
    │           left_member: null,
    │           right_member: null
    │       }
    │
    ├─► 3. Recursively get left child
    │       if (member.left_member exists)
    │           node.left_member = getDownline(member.left_member)
    │                                   │
    │                                   └─► Recursively builds left subtree
    │
    ├─► 4. Recursively get right child
    │       if (member.right_member exists)
    │           node.right_member = getDownline(member.right_member)
    │                                   │
    │                                   └─► Recursively builds right subtree
    │
    └─► 5. Return complete tree structure
```

## 🔐 Authentication Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Authentication System                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Session Management (express-session)                   │
│  ┌────────────────────────────────────────────────┐    │
│  │  Session Store: Memory (default)               │    │
│  │  Session ID: Generated by express-session      │    │
│  │  Cookie Name: mlm.sid                          │    │
│  │  Cookie Config:                                │    │
│  │    - httpOnly: true (prevent XSS)              │    │
│  │    - secure: false (dev), true (prod)          │    │
│  │    - maxAge: 24 hours                          │    │
│  │    - sameSite: 'lax'                           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Password Security (bcryptjs)                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  Salt Rounds: 10                               │    │
│  │  Hash Function: bcrypt.hash(password, 10)      │    │
│  │  Verify: bcrypt.compare(plain, hashed)         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Protected Routes Middleware                            │
│  ┌────────────────────────────────────────────────┐    │
│  │  isAuthenticated(req, res, next)               │    │
│  │  ├─► Check req.session.memberId                │    │
│  │  ├─► If exists: next()                         │    │
│  │  └─► If not: 401 Unauthorized                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Data Model

### Member Schema

```typescript
interface Member {
  id: string;                    // UUID v4
  member_code: string;           // Unique member identifier
  name: string;                  // Full name
  email: string;                 // Unique email
  password: string;              // Bcrypt hashed
  sponsor_code: string | null;   // Who referred them
  parent_code: string | null;    // Who they're placed under
  position: 'left' | 'right' | null;  // Position under parent
  left_member: string | null;    // Member code of left child
  right_member: string | null;   // Member code of right child
  left_count: number;            // Total members in left leg
  right_count: number;           // Total members in right leg
  joined_date: string;           // ISO date string
}
```

### Example Member Object

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "member_code": "ADMIN001",
  "name": "Admin User",
  "email": "admin@mlm.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "sponsor_code": null,
  "parent_code": null,
  "position": null,
  "left_member": "USER001",
  "right_member": "USER002",
  "left_count": 3,
  "right_count": 2,
  "joined_date": "2025-11-01T10:00:00.000Z"
}
```

## 🌐 API Architecture

### Endpoint Structure

```
/api
├── /signup                 POST    Public
├── /login                  POST    Public
├── /logout                 POST    Public
├── /check-session          GET     Public
├── /validate-sponsor       POST    Public
├── /profile                GET     Protected
├── /downline               GET     Protected
└── /stats                  GET     Protected
```

### Request/Response Examples

#### POST /api/signup
**Request:**
```json
{
  "member_code": "USER001",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "sponsor_code": "ADMIN001",
  "position": "left"
}
```

**Response:**
```json
{
  "message": "Member registered successfully",
  "member_code": "USER001",
  "placement": {
    "parent": "ADMIN001",
    "position": "left",
    "spilled": false
  }
}
```

#### GET /api/downline
**Response:**
```json
{
  "member_code": "ADMIN001",
  "name": "Admin User",
  "email": "admin@mlm.com",
  "position": null,
  "left_count": 3,
  "right_count": 2,
  "left_member": {
    "member_code": "USER001",
    "name": "John Doe",
    "position": "left",
    "left_count": 1,
    "right_count": 1,
    "left_member": { /* ... */ },
    "right_member": { /* ... */ }
  },
  "right_member": {
    "member_code": "USER002",
    "name": "Jane Smith",
    "position": "right",
    "left_count": 0,
    "right_count": 0,
    "left_member": null,
    "right_member": null
  }
}
```

## 🎯 Component Architecture

### React Component Hierarchy

```
App
├── AuthProvider (Context)
│   ├── Router
│   │   ├── Login (Public Route)
│   │   ├── Signup (Public Route)
│   │   ├── Profile (Protected Route)
│   │   │   ├── Profile Header
│   │   │   ├── Profile Card
│   │   │   ├── Stats Section
│   │   │   └── Action Buttons
│   │   └── Downline (Protected Route)
│   │       ├── Downline Header
│   │       ├── Tree Container
│   │       │   └── TreeNode (Recursive)
│   │       │       ├── Node Card
│   │       │       └── Child Branches
│   │       │           ├── Left Child (TreeNode)
│   │       │           └── Right Child (TreeNode)
│   │       └── Legend
│   └── ProtectedRoute (Wrapper)
└── Axios Instance (API Client)
```

## 🔄 State Management

### AuthContext State

```javascript
{
  member: Member | null,          // Current logged-in member
  loading: boolean,               // Initial session check
  isAuthenticated: boolean,       // Computed from member
  
  // Methods
  signup: (data) => Promise,
  login: (code, pass) => Promise,
  logout: () => Promise,
  refreshProfile: () => Promise
}
```

### Component Local State Examples

```javascript
// Signup.js
{
  formData: SignupForm,
  sponsorInfo: SponsorInfo | null,
  error: string,
  loading: boolean,
  validatingSponsor: boolean
}

// Profile.js
{
  stats: Statistics | null,
  loading: boolean
}

// Downline.js
{
  downline: TreeNode | null,
  loading: boolean
}
```

## 🚀 Performance Considerations

### Binary Tree Traversal Complexity

- **BFS (Spill Logic)**: O(n) where n = number of nodes
- **Count Updates**: O(log n) for balanced tree, O(n) worst case
- **Get Downline**: O(n) visits each node once

### Optimization Strategies

1. **Caching**: Store frequently accessed downline trees
2. **Lazy Loading**: Load tree levels on demand
3. **Indexing**: Use Map for O(1) member lookups
4. **Database**: Replace JSON with proper DB for scale

### Scalability Limits (Current Implementation)

- **Members**: ~10,000 (JSON file size limit)
- **Tree Depth**: ~10 levels (recursive stack limit)
- **Concurrent Users**: ~100 (session memory limit)

### Production Recommendations

1. Use PostgreSQL/MongoDB instead of JSON
2. Implement Redis for session storage
3. Add pagination for large downlines
4. Use WebSockets for real-time updates
5. Implement queue system for bulk operations

---

**Note**: This architecture is designed for learning and small-scale deployments. For production MLM systems with thousands of members, consider using a proper database, caching layer, and distributed architecture.
