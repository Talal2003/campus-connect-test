'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

// Create the auth context
const AuthContext = createContext();

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  // Define state variables for auth
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing token on initial load
  useEffect(() => {
    const checkUserAuthentication = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found');
        }
        
        const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
        } else {
          // Clear invalid token
          localStorage.removeItem('token');
          throw new Error(data.error || 'Failed to verify authentication');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAuthentication();
  }, []);
  
  // Login function
  const login = async (login, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // The value provided to consumers of this context
  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
}; 