import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent JWT on startup
    const storedUser = localStorage.getItem('wc_user');
    const storedToken = localStorage.getItem('wc_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('wc_user', JSON.stringify(userData));
    localStorage.setItem('wc_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wc_user');
    localStorage.removeItem('wc_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
