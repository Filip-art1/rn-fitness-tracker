// src/screens/WorkoutDetailScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, useTheme, Button } from 'react-native-paper';
import { Workout } from '../types';

interface WorkoutDetailScreenProps {
  route: any;
  navigation: any;
}

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { workout } = route.params as { workout: Workout };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Strength':
        return '#FF6B6B';
      case 'Cardio':
        return '#4ECDC4';
      case 'Flexibility':
        return '#95E1D3';
      case 'HIIT':
        return '#F38181';
      default:
        return theme.colors.primary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#A8E6CF';
      case 'Intermediate':
        return '#FFD93D';
      case 'Advanced':
        return '#FF6B6B';
      default:
        return theme.colors.secondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          {workout.name}
        </Text>

        <View style={styles.chipsContainer}>
          <Chip
            icon="dumbbell"
            style={[styles.chip, { backgroundColor: getCategoryColor(workout.category) }]}
            textStyle={styles.chipText}
          >
            {workout.category}
          </Chip>
          <Chip
            icon="gauge"
            style={[styles.chip, { backgroundColor: getDifficultyColor(workout.difficulty) }]}
            textStyle={styles.chipText}
          >
            {workout.difficulty}
          </Chip>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📝 Opis
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {workout.description}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📊 Detalji treninga
            </Text>
            
            <View style={styles.detailRow}>
              <Text variant="bodyLarge" style={styles.detailLabel}>
                ⏱️ Trajanje:
              </Text>
              <Text variant="bodyLarge" style={styles.detailValue}>
                {workout.duration} minuta
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyLarge" style={styles.detailLabel}>
                🔥 Kalorije:
              </Text>
              <Text variant="bodyLarge" style={styles.detailValue}>
                ~{workout.calories} kcal
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyLarge" style={styles.detailLabel}>
                💪 Kategorija:
              </Text>
              <Text variant="bodyLarge" style={styles.detailValue}>
                {workout.category}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="bodyLarge" style={styles.detailLabel}>
                📈 Nivo:
              </Text>
              <Text variant="bodyLarge" style={styles.detailValue}>
                {workout.difficulty}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              💡 Saveti
            </Text>
            <Text variant="bodyMedium" style={styles.tip}>
              • Zagrij se 5-10 minuta pre početka
            </Text>
            <Text variant="bodyMedium" style={styles.tip}>
              • Pij dovoljno vode tokom vežbanja
            </Text>
            <Text variant="bodyMedium" style={styles.tip}>
              • Slušaj svoje telo i pravi pauze kada je potrebno
            </Text>
            <Text variant="bodyMedium" style={styles.tip}>
              • Istegni se nakon treninga
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Nazad na listu
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    height: 32,
  },
  chipText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    lineHeight: 24,
    opacity: 0.8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 4,
  },
  detailLabel: {
    opacity: 0.7,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  tip: {
    marginBottom: 8,
    lineHeight: 20,
    opacity: 0.8,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});