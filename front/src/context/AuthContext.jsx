import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
//1. The api uses the base URL from the .env file, 
//2.  Adds the token to the request header
//3.  Handles the response and error

// Create a context for authentication that will be used throughout the app
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Core authentication state
  // user: Contains user data including preferences, null when not logged in
  // token: JWT token for API authentication
  // loading: Indicates if initial auth check is in progress
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage on app start
  // This ensures user stays logged in after page refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUsername = localStorage.getItem("username");
      if (token && savedUsername) {
        try {
          // This is an async operation - fetches user profile from server
          const { data } = await api.get('/protected/profile');
          setUser({ username: savedUsername, _id: data._id, is_admin: data.is_admin });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          handleSignOut(); // Sign out if profile fetch fails
        }
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, [token]);
    
  // Handle user sign in
  // 1. Authenticate with credentials
  // 2. The axios api will fetch complete user profile including preferences
  // 3. Store auth data in localStorage and state

  const handleSignIn = async (username, password) => {
    try {
      // Step 1: Authenticate user
      const { data } = await api.post('/auth/login', {
        username,
        password,
      });

      if (!data.token) {
        throw new Error('Login failed');
      }

      // Step 2: Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      
      // Step 3: Get user profile to get the ID and other details
      const profileResponse = await api.get('/protected/profile');
      const userData = profileResponse.data;
      
      // Store complete user data
      setToken(data.token);
      setUser({
        username: userData.username, 
        _id: userData._id,
        is_admin: userData.is_admin
      });
      
      localStorage.setItem("username", userData.username);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || error.message }; //returns detailed error if exist
    }
  };


  useEffect(() => {
    if (!token) return;
  
    const checkUserStatus = async () => {
      try {
        await api.get('/protected/');
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("Token expired or unauthorized, signing out.");
          handleSignOut();
        } else {
          console.error("Error validating token:", err);
          handleSignOut();
        }
      }
    };
  
    // Run once and every 60s
    checkUserStatus();
    const interval = setInterval(checkUserStatus, 60000);

    return () => clearInterval(interval);
  }, [token]);

  // Handle user sign out
  // Clears all auth data from localStorage and state
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUser(null);
  };

  // Handle new user registration
  // 1. Register user with provided data
  // 2. Automatically sign in the new user
  const handleSignUp = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      
      // Auto-login after successful registration
      const loginResult = await handleSignIn(userData.username, userData.password);
  
      if (!loginResult.success) {
        throw new Error("Auto login after registration failed");
      }
  
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.response?.data?.error || error.message  };
    }
  };
  
  // Provide authentication context to all child components
  // Includes user data, auth state, and auth functions
  const value = {
    user,          // Current user data
    token,         // JWT authentication token
    loading,       // Loading state for initial auth check
    signin: handleSignIn,    // Sign in function
    signup: handleSignUp,    // Sign up function
    signout: handleSignOut,  // Sign out function
  //isAdmin: user?.is_admin || false  // Admin status check
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
// Throws error if used outside of AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};