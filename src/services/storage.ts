import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Workout, Theme } from '../types';

const KEYS = {
  HAS_SEEN_WELCOME: '@hasSeenWelcome',
  THEME: '@theme',
  USER_DATA: '@userData',
  WORKOUTS: '@workouts',
};

export const StorageService = {
  async getHasSeenWelcome(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.HAS_SEEN_WELCOME);
      return value === 'true';
    } catch (error) {
      console.error('Error getting hasSeenWelcome:', error);
      return false;
    }
  },

  async setHasSeenWelcome(value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HAS_SEEN_WELCOME, value.toString());
    } catch (error) {
      console.error('Error setting hasSeenWelcome:', error);
    }
  },

  async getTheme(): Promise<Theme> {
    try {
      const value = await AsyncStorage.getItem(KEYS.THEME);
      return (value as Theme) || 'light';
    } catch (error) {
      console.error('Error getting theme:', error);
      return 'light';
    }
  },

  async setTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  },

  async getUserData(): Promise<User | null> {
    try {
      const value = await AsyncStorage.getItem(KEYS.USER_DATA);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  },

  async getWorkouts(): Promise<Workout[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.WORKOUTS);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  },

  async setWorkouts(workouts: Workout[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error setting workouts:', error);
    }
  },
};