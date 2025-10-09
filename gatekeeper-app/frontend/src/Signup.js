import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !password) {
      setMsg("⚠️ Please fill all fields");
      return;
    }

    setIsLoading(true);
    setMsg("");
    
    try {
      const res = await axios.post("http://localhost:5000/signup", { username, password });
      setMsg(res.data.message);
      setTimeout(() => {
        setUsername("");
        setPassword("");
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Error signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
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
        onClick={handleSignup}
        disabled={isLoading}
        className={`modern-button ${isLoading ? "loading" : ""}`}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Creating Account...
          </>
        ) : (
          <>
            <span className="button-icon">✨</span>
            Create Account
          </>
        )}
      </button>

      {msg && (
        <div className={`message ${msg.includes("✅") || msg.includes("successful") ? "success" : "error"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}

export default Signup;
