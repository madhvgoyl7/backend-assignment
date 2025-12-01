# MLM Application - Binary Tree Network

A complete Multilevel Marketing (MLM) application with binary tree structure, featuring automatic spill logic, member management, and beautiful visualizations.

## 🌟 Features

### Core Functionality
- **Binary Tree Structure**: Each member can have maximum 2 direct members (left & right)
- **Automatic Spill Logic**: When direct positions are filled, new members automatically spill to first available position in downline
- **Recursive Count Updates**: Left and right team counts update automatically up the tree
- **Session-Based Authentication**: Secure login system with bcrypt password hashing
- **Member Profile**: View personal details and network statistics
- **Downline Visualization**: Interactive tree view of complete downline structure

### Technical Features
- **Backend**: Express.js with session management
- **Frontend**: React with modern animations and transitions
- **Storage**: JSON file-based data storage
- **Security**: Bcrypt password hashing, session cookies
- **API**: RESTful endpoints with proper error handling

## 📁 Project Structure

```
multilevel marketing/
├── backend/
│   ├── package.json
│   ├── server.js (Binary tree logic + API endpoints)
│   └── members.json (Member data storage)
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── axios.js (Centralized HTTP client)
        ├── components/
        │   └── ProtectedRoute.js
        ├── context/
        │   └── AuthContext.js (Authentication state)
        ├── pages/
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── Profile.js
        │   ├── Downline.js
        │   ├── Auth.css
        │   ├── Profile.css
        │   └── Downline.css
        ├── App.js
        ├── App.css
        ├── index.js
        └── index.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd "multilevel marketing/backend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

Backend will run on: `http://localhost:5002`

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):
```bash
cd "multilevel marketing/frontend"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on: `http://localhost:3000`

## 🔐 API Endpoints

### Authentication
- `POST /api/signup` - Register new member
- `POST /api/login` - Member login
- `POST /api/logout` - Member logout
- `GET /api/check-session` - Check session status

### Member Management
- `POST /api/validate-sponsor` - Validate sponsor code
- `GET /api/profile` - Get member profile (Protected)
- `GET /api/downline` - Get complete downline tree (Protected)
- `GET /api/stats` - Get network statistics (Protected)

## 💡 How It Works

### Binary Tree Structure

Each member has:
- `member_code`: Unique identifier
- `sponsor_code`: Who referred them
- `left_member`: Member code of left child
- `right_member`: Member code of right child
- `left_count`: Total members in left team
- `right_count`: Total members in right team
- `position`: Their position under parent (left/right)

### Spill Logic Algorithm

1. **Direct Placement**: If sponsor has an empty position (left or right), place member there
2. **Auto-Spill**: If both positions are filled, use BFS (Breadth-First Search) to find first available position in downline
3. **Count Updates**: Recursively update counts from placement position up to root

### Example Tree
```
        ROOT (M001)
       /           \
  M002 (Left)    M003 (Right)
   /      \        /       \
M004    M005    M006     [Empty]
```

When M007 joins under M001 (both positions filled), they spill to M003's right position.

## 🎨 Features in Detail

### Signup Process
1. Enter member details (code, name, email, password)
2. Enter sponsor code (optional for root member)
3. Validate sponsor code to check availability
4. Select position (left/right) if available
5. Auto-spill notification if both positions filled
6. Registration with automatic tree placement

### Member Dashboard
- Personal information display
- Network statistics:
  - Total team members
  - Left team count (with direct count)
  - Right team count (with direct count)
- Quick access to downline view

### Downline Tree View
- Interactive tree visualization
- Each node shows:
  - Member code
  - Member name
  - Position (left/right)
  - Team counts
- Visual connections between members
- Hover effects for better UX
- Color-coded positions

## 🎯 Key Concepts

### Root Member
- First member in the system
- No sponsor code required
- Foundation of the network

### Sponsor vs Parent
- **Sponsor**: Who invited you to join
- **Parent**: Who you're directly placed under (may differ due to spill)

### Team Counts
- Counts include ALL members in that leg (not just direct)
- Updated recursively up the tree
- Used for commission calculations in real MLM systems

## 🛡️ Security Features

- Bcrypt password hashing (10 salt rounds)
- Session-based authentication
- HTTP-only cookies
- Protected routes on both frontend and backend
- CORS configuration
- Input validation

## 🎨 UI Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Floating background elements
- Responsive design
- Color-coded statistics
- Interactive hover effects
- Real-time validation feedback

## 📝 Usage Example

### Creating First Member (Root)
```
Member Code: ADMIN001
Name: John Doe
Email: john@example.com
Password: password123
Sponsor Code: [Leave empty]
```

### Adding Second Member
```
Member Code: USER001
Name: Jane Smith
Email: jane@example.com
Password: password123
Sponsor Code: ADMIN001
Position: Left
```

### Auto-Spill Scenario
When ADMIN001's both positions are filled (USER001 on left, USER002 on right), and USER003 tries to join under ADMIN001, they will automatically spill to the first available position (e.g., USER001's left or right).

## 🔧 Configuration

Backend configuration (in `server.js`):
- Port: `5002`
- Session Secret: `mlm-app-secret-key-2025`
- Cookie Name: `mlm.sid`
- Cookie Max Age: `24 hours`

Frontend configuration (in `axios.js`):
- Base URL: `http://localhost:5002/api`
- Credentials: `true` (for session cookies)

## 🚀 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Member commission calculations
- E-wallet system
- Product management
- Email notifications
- Admin dashboard
- Genealogy report export
- Mobile app version

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created with ❤️ for learning MLM binary tree structures and full-stack development.

---

**Note**: This is a demo application. For production use, implement proper security measures, database storage, and compliance with local MLM regulations.
