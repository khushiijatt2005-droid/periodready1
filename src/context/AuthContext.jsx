import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, dbUpsertCustomer } from '../lib/supabase';

const AuthContext = createContext();

const ADMIN_EMAIL = 'periodready1@gmail.com';
const LOCAL_AUTH_KEY = 'periodready_auth_session_v1';
const REGISTERED_USERS_KEY = 'periodready_registered_users_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup'); // 'signup' | 'login'
  const [pendingAddToCart, setPendingAddToCart] = useState(null);

  // Initialize session
  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const meta = session.user.user_metadata || {};
            const isAdmin = session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || meta.role === 'admin';
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: meta.name || session.user.email.split('@')[0],
              phone: meta.phone || '',
              role: isAdmin ? 'admin' : 'customer'
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Supabase session load error', e);
        }
      }

      // Check local session
      try {
        const saved = localStorage.getItem(LOCAL_AUTH_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Local auth parse error', e);
      }
      setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const isAdmin = session.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() || meta.role === 'admin';
          const authUser = {
            id: session.user.id,
            email: session.user.email,
            name: meta.name || session.user.email.split('@')[0],
            phone: meta.phone || '',
            role: isAdmin ? 'admin' : 'customer'
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(authUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      });
      return () => subscription?.unsubscribe();
    }
  }, []);

  // Sign up
  const signup = async ({ name, email, phone, password }) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // 1. Supabase Auth if available
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password || 'PeriodReady2026!',
          options: {
            data: {
              name: cleanName,
              phone: cleanPhone,
              role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer'
            }
          }
        });
        if (error) throw error;
        if (data?.user) {
          const newUser = {
            id: data.user.id,
            email: cleanEmail,
            name: cleanName,
            phone: cleanPhone,
            role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer'
          };
          setUser(newUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(newUser));
          await dbUpsertCustomer(newUser);
          return { success: true, user: newUser };
        }
      } catch (err) {
        console.warn('Supabase signup fallback to local sync', err);
      }
    }

    // 2. Local fallback registration
    const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    const exists = registered.find(u => u.email === cleanEmail);
    if (exists && exists.password && exists.password !== password) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: `USR-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      password: password || 'PeriodReady2026!',
      role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    };

    if (!exists) {
      registered.push(newUser);
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
    }

    setUser(newUser);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(newUser));
    await dbUpsertCustomer(newUser);

    return { success: true, user: newUser };
  };

  // Login
  const login = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (error) throw error;
        if (data?.user) {
          const meta = data.user.user_metadata || {};
          const isAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase() || meta.role === 'admin';
          const authUser = {
            id: data.user.id,
            email: cleanEmail,
            name: meta.name || cleanEmail.split('@')[0],
            phone: meta.phone || '',
            role: isAdmin ? 'admin' : 'customer'
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(authUser));
          return { success: true, user: authUser };
        }
      } catch (err) {
        console.warn('Supabase login fallback check', err);
      }
    }

    // Local authentication check
    const registered = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]');
    const found = registered.find(u => u.email === cleanEmail);

    // If it's admin email or registered user
    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      // Default admin password for owner if not yet configured in Supabase Auth
      const cleanPass = (password || '').trim();
      const isMatch = cleanPass === 'Admin@PeriodReady2026' || 
                      cleanPass.toLowerCase() === 'admin@periodready2026' || 
                      cleanPass === 'Admin2026' ||
                      cleanPass.toLowerCase() === 'admin' ||
                      (found && found.password === cleanPass);

      if (isMatch) {
        const adminUser = {
          id: 'ADMIN-01',
          email: cleanEmail,
          name: 'Khushi Jat (CEO)',
          phone: '+91 98765 43210',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
      throw new Error('Invalid admin credentials. Authorized password: Admin@PeriodReady2026');
    }

    if (found) {
      if (found.password && found.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      setUser(found);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(found));
      return { success: true, user: found };
    }

    throw new Error('No account found with this email. Please create an account.');
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase sign out error', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      login,
      signup,
      logout,
      authModalOpen,
      setAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      pendingAddToCart,
      setPendingAddToCart
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
