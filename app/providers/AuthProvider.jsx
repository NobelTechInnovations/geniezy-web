'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../redux/features/authSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if user is already logged in (e.g., from localStorage)
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(loginSuccess(user));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  const authContextValue = {
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
} 