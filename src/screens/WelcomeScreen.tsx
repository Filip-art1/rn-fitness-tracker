import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { StorageService } from '../services/storage';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const theme = useTheme();

  const handleGetStarted = async () => {
    await StorageService.setHasSeenWelcome(true);
    onComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          💪 Fitness Tracker
        </Text>
        
        <Text variant="titleLarge" style={styles.subtitle}>
          Tvoj lični trener u džepu
        </Text>

        <View style={styles.features}>
          <Text variant="bodyLarge" style={styles.feature}>
            ✅ Prati svoje treninge
          </Text>
          <Text variant="bodyLarge" style={styles.feature}>
            ✅ Kreira personalizovane planove
          </Text>
          <Text variant="bodyLarge" style={styles.feature}>
            ✅ Prati svoj napredak
          </Text>
          <Text variant="bodyLarge" style={styles.feature}>
            ✅ Postižи svoje fitness ciljeve
          </Text>
        </View>

        <Text variant="bodyMedium" style={styles.description}>
          Počni svoju fitness transformaciju danas! Aplikacija ti pomaže da ostaneš 
          motivisan i dostigneš svoje ciljeve kroz strukturirane treninge i praćenje napretka.
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleGetStarted}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Počni
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
  features: {
    marginBottom: 30,
    width: '100%',
  },
  feature: {
    marginBottom: 15,
    paddingLeft: 20,
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  button: {
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});