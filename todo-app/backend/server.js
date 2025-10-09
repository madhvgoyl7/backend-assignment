import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import fs from "fs";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const app = express();

// CORS must be configured BEFORE other middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: "todo-app-secret-key-2025",
  resave: true,
  saveUninitialized: true,
  name: 'todo.sid', // Custom session cookie name
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
    path: '/'
  },
  rolling: true // Reset expiration on every response
}));

// Logging middleware - log all requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Session ID:', req.sessionID);
  console.log('User ID in session:', req.session?.userId);
  console.log('Cookies:', req.headers.cookie);
  next();
});

const PORT = 5001;
const USERS_FILE = "users.json";
const TASKS_FILE = "tasks.json";
const SALT_ROUNDS = 10;

// Helper Functions
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
  }
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, "[]");
  }
  const data = fs.readFileSync(TASKS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Authentication Middleware
function isAuthenticated(req, res, next) {
  console.log('\n=== Authentication Check ===');
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('User ID:', req.session?.userId);
  console.log('===========================\n');
  
  if (req.session && req.session.userId) {
    next();
  } else {
    console.error('❌ Authentication failed - No valid session');
    res.status(401).json({ 
      message: "Unauthorized. Please login first.",
      sessionID: req.sessionID,
      hasSession: !!req.session,
      hasUserId: !!req.session?.userId
    });
  }
}

// ============ AUTH ROUTES ============

// Signup Route
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  let users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  const newUser = {
    id: uuidv4(),
    username,
    password: hashedPassword
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ 
    message: "Signup successful! Please login.",
    userId: newUser.id 
  });
});

// Login Route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Create session
  req.session.userId = user.id;
  req.session.username = user.username;

  // Save session explicitly
  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).json({ message: "Could not create session" });
    }
    
    console.log('Session created:', {
      sessionID: req.sessionID,
      userId: req.session.userId,
      username: req.session.username
    });
    
    res.json({ 
      message: `Welcome back, ${username}!`,
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
});

// Logout Route
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Check Session Route
app.get("/api/check-session", (req, res) => {
  if (req.session.userId) {
    res.json({ 
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// ============ TODO ROUTES ============

// Get all tasks for logged-in user
app.get("/api/tasks", isAuthenticated, (req, res) => {
  const tasks = readTasks();
  const userTasks = tasks.filter(task => task.userId === req.session.userId);
  res.json(userTasks);
});

// Create new task
app.post("/api/tasks", isAuthenticated, (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  const tasks = readTasks();
  const newTask = {
    id: uuidv4(),
    userId: req.session.userId,
    title: title.trim(),
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json({ 
    message: "Task created successfully",
    task: newTask 
  });
});

// Update task status
app.put("/api/tasks/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { status, title } = req.body;

  let tasks = readTasks();
  const taskIndex = tasks.findIndex(
    task => task.id === id && task.userId === req.session.userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (status) {
    tasks[taskIndex].status = status;
  }
  if (title) {
    tasks[taskIndex].title = title;
  }
  tasks[taskIndex].updatedAt = new Date().toISOString();

  saveTasks(tasks);

  res.json({ 
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

// Delete task
app.delete("/api/tasks/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  let tasks = readTasks();
  const taskIndex = tasks.findIndex(
    task => task.id === id && task.userId === req.session.userId
  );

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  res.json({ message: "Task deleted successfully" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Todo App Backend running on http://localhost:${PORT}`);
});
