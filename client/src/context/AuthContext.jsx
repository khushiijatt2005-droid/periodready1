import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Customer State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pr_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pr_token') || null);

  // Admin State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('pr_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('pr_admin_token') || null);

  const [loading, setLoading] = useState(true);

  // Sync Customer State
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('pr_user', JSON.stringify(user));
      localStorage.setItem('pr_token', token);
    } else {
      localStorage.removeItem('pr_user');
      localStorage.removeItem('pr_token');
    }
  }, [user, token]);

  // Sync Admin State
  useEffect(() => {
    if (adminUser && adminToken) {
      localStorage.setItem('pr_admin_user', JSON.stringify(adminUser));
      localStorage.setItem('pr_admin_token', adminToken);
    } else {
      localStorage.removeItem('pr_admin_user');
      localStorage.removeItem('pr_admin_token');
    }
  }, [adminUser, adminToken]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Customer Login
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    setUser(data.user);
    setToken(data.token);
    return data;
  };

  // Customer Signup
  const signup = async (name, email, phone, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');

    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pr_user');
    localStorage.removeItem('pr_token');
  };

  const updateProfile = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Admin login failed');

    setAdminUser(data.user);
    setAdminToken(data.token);
    return data;
  };

  const adminLogout = () => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem('pr_admin_user');
    localStorage.removeItem('pr_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        updateProfile,
        adminUser,
        adminToken,
        isAdminAuthenticated: !!adminToken,
        adminLogin,
        adminLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
