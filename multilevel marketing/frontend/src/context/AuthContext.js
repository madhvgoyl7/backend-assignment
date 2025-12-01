import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await axios.get('/check-session');
      if (response.data.loggedIn) {
        setMember(response.data.member);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (memberData) => {
    try {
      const response = await axios.post('/signup', memberData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const login = async (member_code, password) => {
    try {
      const response = await axios.post('/login', { member_code, password });
      setMember(response.data.member);
      return { success: true, member: response.data.member };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      setMember(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setMember(response.data);
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const value = {
    member,
    loading,
    signup,
    login,
    logout,
    refreshProfile,
    isAuthenticated: !!member
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
