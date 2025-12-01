const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5002;
const MEMBERS_FILE = path.join(__dirname, 'members.json');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'mlm-app-secret-key-2025',
  name: 'mlm.sid',
  resave: true,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.session && req.session.memberId) {
    console.log(`  Session ID: ${req.session.id}, Member ID: ${req.session.memberId}`);
  }
  next();
});

// Helper functions to read/write members
function readMembers() {
  try {
    if (!fs.existsSync(MEMBERS_FILE)) {
      fs.writeFileSync(MEMBERS_FILE, '[]');
      return [];
    }
    const data = fs.readFileSync(MEMBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading members:', error);
    return [];
  }
}

function saveMembers(members) {
  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2));
  } catch (error) {
    console.error('Error saving members:', error);
  }
}

// Authentication middleware
function isAuthenticated(req, res, next) {
  console.log('Auth middleware - Session:', {
    sessionID: req.sessionID,
    memberId: req.session.memberId,
    session: req.session
  });

  if (req.session && req.session.memberId) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
  }
}

// Binary Tree Helper Functions

/**
 * Find a member by member_code
 */
function findMember(members, memberCode) {
  return members.find(m => m.member_code === memberCode);
}

/**
 * Recursively find the first available position in the binary tree
 * using level-order traversal (BFS) for spill logic
 */
function findAvailablePosition(members, sponsorCode) {
  const sponsor = findMember(members, sponsorCode);
  if (!sponsor) return null;

  // Queue for BFS traversal
  const queue = [sponsor];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    // Check if left position is available
    if (!current.left_member) {
      return { member: current, position: 'left' };
    }
    
    // Check if right position is available
    if (!current.right_member) {
      return { member: current, position: 'right' };
    }
    
    // Add children to queue for further traversal
    const leftChild = findMember(members, current.left_member);
    const rightChild = findMember(members, current.right_member);
    
    if (leftChild) queue.push(leftChild);
    if (rightChild) queue.push(rightChild);
  }
  
  return null; // This should never happen in a properly managed tree
}

/**
 * Update counts recursively up the tree
 */
function updateCounts(members, memberCode, position) {
  const member = findMember(members, memberCode);
  if (!member) return;
  
  // Update the appropriate count
  if (position === 'left') {
    member.left_count += 1;
  } else {
    member.right_count += 1;
  }
  
  // Recursively update parent's counts
  if (member.sponsor_code) {
    const parent = findMember(members, member.sponsor_code);
    if (parent) {
      const memberPosition = parent.left_member === member.member_code ? 'left' : 'right';
      updateCounts(members, parent.member_code, memberPosition);
    }
  }
}

/**
 * Place a new member in the binary tree with automatic spill
 */
function placeMemberInTree(members, newMember, sponsorCode, preferredPosition = null) {
  const sponsor = findMember(members, sponsorCode);
  if (!sponsor) {
    throw new Error('Sponsor not found');
  }
  
  let actualPosition;
  let actualParent;
  
  // If preferred position is specified and available, use it
  if (preferredPosition && !sponsor[`${preferredPosition}_member`]) {
    actualPosition = preferredPosition;
    actualParent = sponsor;
  } else {
    // Use automatic spill logic to find available position
    const result = findAvailablePosition(members, sponsorCode);
    if (!result) {
      throw new Error('No available position found in tree');
    }
    actualPosition = result.position;
    actualParent = result.member;
  }
  
  // Place the member
  newMember.position = actualPosition;
  newMember.parent_code = actualParent.member_code;
  actualParent[`${actualPosition}_member`] = newMember.member_code;
  
  // Update counts up the tree
  updateCounts(members, actualParent.member_code, actualPosition);
  
  return {
    actualParent: actualParent.member_code,
    actualPosition: actualPosition,
    wasSpilled: actualParent.member_code !== sponsorCode
  };
}

/**
 * Get complete downline for a member
 */
function getDownline(members, memberCode) {
  const member = findMember(members, memberCode);
  if (!member) return null;
  
  const result = {
    member_code: member.member_code,
    name: member.name,
    email: member.email,
    position: member.position,
    left_count: member.left_count,
    right_count: member.right_count,
    left_member: null,
    right_member: null
  };
  
  // Recursively get left child
  if (member.left_member) {
    result.left_member = getDownline(members, member.left_member);
  }
  
  // Recursively get right child
  if (member.right_member) {
    result.right_member = getDownline(members, member.right_member);
  }
  
  return result;
}

// ==================== ROUTES ====================

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MLM Backend API is running!' });
});

// Check session status
app.get('/api/check-session', (req, res) => {
  console.log('Check session - Session ID:', req.sessionID);
  console.log('Check session - Member ID:', req.session.memberId);
  
  if (req.session && req.session.memberId) {
    const members = readMembers();
    const member = members.find(m => m.id === req.session.memberId);
    
    if (member) {
      const { password, ...memberWithoutPassword } = member;
      return res.json({ 
        loggedIn: true, 
        member: memberWithoutPassword 
      });
    }
  }
  
  res.json({ loggedIn: false });
});

// Validate sponsor code
app.post('/api/validate-sponsor', (req, res) => {
  const { sponsor_code } = req.body;
  
  if (!sponsor_code) {
    return res.status(400).json({ message: 'Sponsor code is required' });
  }
  
  const members = readMembers();
  const sponsor = findMember(members, sponsor_code);
  
  if (!sponsor) {
    return res.status(404).json({ 
      valid: false, 
      message: 'Sponsor code not found' 
    });
  }
  
  // Check available positions
  const leftAvailable = !sponsor.left_member;
  const rightAvailable = !sponsor.right_member;
  
  res.json({ 
    valid: true, 
    sponsor_name: sponsor.name,
    left_available: leftAvailable,
    right_available: rightAvailable,
    message: leftAvailable || rightAvailable 
      ? 'Sponsor code is valid' 
      : 'Direct positions are full, auto-spill will be applied'
  });
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { member_code, name, email, password, sponsor_code, position } = req.body;
    
    // Validation
    if (!member_code || !name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const members = readMembers();
    
    // Check if member_code already exists
    if (findMember(members, member_code)) {
      return res.status(400).json({ message: 'Member code already exists' });
    }
    
    // Check if email already exists
    if (members.find(m => m.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new member
    const newMember = {
      id: uuidv4(),
      member_code,
      name,
      email,
      password: hashedPassword,
      sponsor_code: sponsor_code || null,
      parent_code: null,
      position: null,
      left_member: null,
      right_member: null,
      left_count: 0,
      right_count: 0,
      joined_date: new Date().toISOString()
    };
    
    // If this is the first member (root), add directly
    if (members.length === 0) {
      members.push(newMember);
      saveMembers(members);
      
      return res.status(201).json({ 
        message: 'Root member created successfully',
        member_code: newMember.member_code
      });
    }
    
    // Validate sponsor code
    if (!sponsor_code) {
      return res.status(400).json({ message: 'Sponsor code is required' });
    }
    
    // Place member in tree with spill logic
    const placement = placeMemberInTree(members, newMember, sponsor_code, position);
    
    // Add new member to array
    members.push(newMember);
    saveMembers(members);
    
    res.status(201).json({ 
      message: 'Member registered successfully',
      member_code: newMember.member_code,
      placement: {
        parent: placement.actualParent,
        position: placement.actualPosition,
        spilled: placement.wasSpilled
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message || 'Error creating member' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { member_code, password } = req.body;
    
    if (!member_code || !password) {
      return res.status(400).json({ message: 'Member code and password are required' });
    }
    
    const members = readMembers();
    const member = findMember(members, member_code);
    
    if (!member) {
      return res.status(401).json({ message: 'Invalid member code or password' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, member.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid member code or password' });
    }
    
    // Create session
    req.session.memberId = member.id;
    req.session.memberCode = member.member_code;
    
    // Explicitly save session
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Error creating session' });
      }
      
      console.log('Login successful - Session ID:', req.sessionID);
      console.log('Login successful - Member ID:', req.session.memberId);
      
      const { password: _, ...memberWithoutPassword } = member;
      
      res.json({ 
        message: 'Login successful', 
        member: memberWithoutPassword 
      });
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('mlm.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Get profile (Protected route)
app.get('/api/profile', isAuthenticated, (req, res) => {
  try {
    const members = readMembers();
    const member = members.find(m => m.id === req.session.memberId);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    const { password, ...memberWithoutPassword } = member;
    res.json(memberWithoutPassword);
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get downline (Protected route)
app.get('/api/downline', isAuthenticated, (req, res) => {
  try {
    const members = readMembers();
    const member = members.find(m => m.id === req.session.memberId);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    const downline = getDownline(members, member.member_code);
    res.json(downline);
    
  } catch (error) {
    console.error('Downline error:', error);
    res.status(500).json({ message: 'Error fetching downline' });
  }
});

// Get statistics (Protected route)
app.get('/api/stats', isAuthenticated, (req, res) => {
  try {
    const members = readMembers();
    const member = members.find(m => m.id === req.session.memberId);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    const stats = {
      total_members: member.left_count + member.right_count,
      left_count: member.left_count,
      right_count: member.right_count,
      direct_left: member.left_member ? 1 : 0,
      direct_right: member.right_member ? 1 : 0
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Handle OPTIONS requests
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`MLM Backend server is running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/signup - Register new member');
  console.log('  POST /api/login - Member login');
  console.log('  POST /api/logout - Member logout');
  console.log('  GET /api/check-session - Check session status');
  console.log('  POST /api/validate-sponsor - Validate sponsor code');
  console.log('  GET /api/profile - Get member profile');
  console.log('  GET /api/downline - Get downline tree');
  console.log('  GET /api/stats - Get member statistics');
});
