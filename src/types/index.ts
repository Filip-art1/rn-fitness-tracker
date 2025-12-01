export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: "Strength" | "Cardio" | "Flexibility" | "HIIT";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  calories: number;
  createdAt: string;
}

export type Theme = "light" | "dark";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}
