'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../redux/features/authSlice';
import { getAuthFromDB } from '../services/authDB';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Try IndexedDB first
        const { token, user } = await getAuthFromDB();
        if (user && token) {
          dispatch(loginSuccess(user));
        } else {
          // Fallback to localStorage
          const storedUser = typeof window !== 'undefined' ? localStorage.getItem('geniezy_user') : null;
          const storedToken = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
          if (storedUser && storedToken) {
            const user = JSON.parse(storedUser);
            dispatch(loginSuccess(user));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('geniezy_user');
          localStorage.removeItem('geniezy_token');
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