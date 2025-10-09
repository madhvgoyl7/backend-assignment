import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <div className="app-container">
      <div className="animated-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
      
      <div className="main-card">
        <div className="header-section">
          <h1 className="main-title">
            <span className="icon-animate">🚪</span>
            Code Academy Gatekeeper
          </h1>
          <p className="subtitle">Secure Your Access with Style</p>
        </div>

        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            <span className="tab-icon">📝</span>
            Sign Up
          </button>
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            <span className="tab-icon">🔑</span>
            Login
          </button>
          <div
            className={`tab-indicator ${
              activeTab === "login" ? "login-active" : ""
            }`}
          ></div>
        </div>

        <div className="form-container">
          {activeTab === "signup" ? <Signup /> : <Login />}
        </div>
      </div>

      <div className="footer-text"><h2>
        Made with <span className="heart">❤️</span> by Madhav Kalra
      </h2></div>
    </div>
  );
}

export default App;
