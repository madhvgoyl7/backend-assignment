import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = process.env.USERS_FILE || "users.json";
const PORT = process.env.PORT || 5000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 8;


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


app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  let users = readUsers();


  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

 
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

  users.push({ username, password: hashedPassword });
  saveUsers(users);

  res.json({ message: "Signup successful ✅" });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  let users = readUsers();

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({ message: `Welcome ${username}! 🎉` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Gatekeeper App running on http://localhost:${PORT}`);
});
