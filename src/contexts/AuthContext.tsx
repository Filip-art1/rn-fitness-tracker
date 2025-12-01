// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { StorageService } from "../services/storage";
import { AuthContextType, User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "@supabase_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        await loadUserData(session.user.id);
      } else {
        await AsyncStorage.removeItem(SESSION_KEY);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
  const userData = await StorageService.getUserData();
  if (userData && userData.id === userId) {
    setUser(userData);
  } 
};

  const checkUser = async () => {
    try {
      const savedSession = await AsyncStorage.getItem(SESSION_KEY);

      if (savedSession) {
        const session = JSON.parse(savedSession);

        const { data, error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (error) throw error;

        if (data.session?.user) {
          await loadUserData(data.session.user.id);
        }
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
          await loadUserData(session.user.id);
        }
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    await StorageService.setUserData(updatedUser);
    setUser(updatedUser);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));

      if (data.user) {
        const userData = await StorageService.getUserData();
        if (userData && userData.id === data.user.id) {
          setUser(userData);
        } else {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
          };
          await StorageService.setUserData(newUser);
          setUser(newUser);
        }
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    if (data.user) {
      const newUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      };
      await StorageService.setUserData(newUser);
      setUser(newUser);
    }
  };

const signOut = async () => {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem(SESSION_KEY);
  // NE BRIŠEMO user podatke - StorageService.clearUserData()
  setUser(null);
};


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
