import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StorageService } from './src/services/storage';

const AppContent = () => {
  const { isDark } = useTheme();
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkWelcomeStatus();
  }, []);

  const checkWelcomeStatus = async () => {
    const seen = await StorageService.getHasSeenWelcome();
    setHasSeenWelcome(seen);
    setIsLoading(false);
  };

  const handleWelcomeComplete = () => {
    setHasSeenWelcome(true);
  };

  if (isLoading) {
    return null;
  }

  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator
        hasSeenWelcome={hasSeenWelcome}
        onWelcomeComplete={handleWelcomeComplete}
      />
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}