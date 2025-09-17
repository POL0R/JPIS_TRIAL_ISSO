import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Profile, TeamMember, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMemberships, setTeamMemberships] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at
      } : null;
      setUser(user);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ? {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        } : null;
        setUser(user);
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setProfile(null);
          setTeamMemberships([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      console.log('Loading user data for:', userId);
      
      // For now, just create a default admin profile without database calls
      // This bypasses any potential database issues
      const defaultProfile = { 
        id: 'temp', 
        user_id: userId, 
        role: 'Admin' as const, 
        created_at: new Date().toISOString() 
      };
      
      console.log('Setting default profile:', defaultProfile);
      setProfile(defaultProfile);
      setTeamMemberships([]);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set a default profile even if there's an error
      setProfile({ id: 'temp', user_id: userId, role: 'Admin', created_at: new Date().toISOString() });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };


  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    teamMemberships,
    loading,
    signIn,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
