import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication that will be used throughout the app
const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL;

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
    const initializeAuth = () => {
      const savedUsername = localStorage.getItem("username");
      if (token && savedUsername) {
        setUser({ username: savedUsername });
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, [token]);
    
  // Handle user sign in
  // 1. Authenticate with credentials
  // 2. Fetch complete user profile including preferences
  // 3. Store auth data in localStorage and state
  const handleSignIn = async (username, password) => {
    try {
      // Step 1: Authenticate user
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Login in failed');
      }

      // Step 2: Store authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      
      // Update state
      setToken(data.token);
      setUser({ username });
      
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };


  useEffect(() => {
    if (!token) return;
  
    const checkUserStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/protected/`, {
          headers: {
            Authorization: token, // not Bearer
          },
        });
  
        if (response.status === 401) {
          console.warn("Token expired or unauthorized, signing out.");
          handleSignOut();
          return;
        }
  
        // You can optionally parse response here if needed:
        /*  
        const userData = await response.json();
        // If user status is deactivated
        if (userData.status === false) {
          console.warn("User is deactivated, signing out.");
          handleSignOut();
        }
       */
        
      } catch (err) {
        console.error("Error validating token:", err);
        handleSignOut(); // optional: auto sign out on error
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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
  
      // Auto-login after successful registration
      const loginResult = await handleSignIn(userData.username, userData.password);
  
      if (!loginResult.success) {
        throw new Error("Auto login after registration failed");
      }
  
      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.message };
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