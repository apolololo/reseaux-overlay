
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Handle missing keys more gracefully
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase credentials. Using fallback for development.");
}

const supabase = createClient(
  supabaseUrl || 'https://fallback-url-for-dev.supabase.co', 
  supabaseAnonKey || 'fallback-key-for-dev'
);

interface UserData {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface AuthContextType {
  isSignedIn: boolean;
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null }>;
  supabase: SupabaseClient;
  userData: UserData | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Check for existing session and set up auth state
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error.message);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          setIsSignedIn(true);
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name')
            .eq('id', session.user.id)
            .single();
            
          if (!profileError && profileData) {
            setUserData(profileData);
          } else {
            // If no profile exists yet, create one with basic data
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                first_name: null,
                last_name: null,
                created_at: new Date().toISOString()
              });
              
            if (insertError) {
              console.error("Error creating user profile:", insertError.message);
            } else {
              setUserData({
                id: session.user.id,
                email: session.user.email,
                first_name: null,
                last_name: null
              });
            }
          }
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsSignedIn(true);
          
          // Get user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            setUserData(profileData);
          }
        } else if (event === 'SIGNED_OUT') {
          setIsSignedIn(false);
          setUserData(null);
        }
      }
    );
    
    checkSession();
    
    // Clean up subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { error };
    } catch (err: any) {
      console.error("Sign in error:", err.message);
      return { error: err };
    }
  };
  
  // Sign up with email, password and additional info
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (!error && data.user) {
        // Create user profile in profiles table
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          created_at: new Date().toISOString()
        });
      }
      
      return { error };
    } catch (err: any) {
      console.error("Sign up error:", err.message);
      return { error: err };
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const value: AuthContextType = {
    isSignedIn,
    userId: userData?.id || null,
    firstName: userData?.first_name || null,
    lastName: userData?.last_name || null,
    email: userData?.email || null,
    signOut,
    signIn,
    signUp,
    supabase,
    userData,
    isLoading
  };

  // If auth hasn't initialized, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080810]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cme-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
