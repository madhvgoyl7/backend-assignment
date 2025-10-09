import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setMsg("⚠️ Please fill all fields");
      return;
    }

    setIsLoading(true);
    setMsg("");
    
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="form-content">
      <div className="input-group">
        <div className="input-wrapper">
          <span className="input-icon">👤</span>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="modern-input"
          />
        </div>
      </div>

      <div className="input-group">
        <div className="input-wrapper">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="modern-input"
          />
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`modern-button login-btn ${isLoading ? "loading" : ""}`}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Logging In...
          </>
        ) : (
          <>
            <span className="button-icon">🚀</span>
            Login Now
          </>
        )}
      </button>

      {msg && (
        <div className={`message ${msg.includes("Welcome") || msg.includes("🎉") ? "success" : "error"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}

export default Login;
