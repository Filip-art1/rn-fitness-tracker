import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Searchbar, Card, Chip, useTheme } from 'react-native-paper';
import { StorageService } from '../services/storage';
import { Workout } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const INITIAL_WORKOUTS: Workout[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    description: 'Kompletna rutina za celo telo sa foksuom na snagu i izdržljivost',
    duration: 45,
    category: 'Strength',
    difficulty: 'Intermediate',
    calories: 350,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cardio Blast',
    description: 'Intenzivni kardio trening za sagorevanje kalorija',
    duration: 30,
    category: 'Cardio',
    difficulty: 'Advanced',
    calories: 400,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Yoga Flow',
    description: 'Opuštajuća yoga sesija za fleksibilnost i mentalnu ravnotežu',
    duration: 60,
    category: 'Flexibility',
    difficulty: 'Beginner',
    calories: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'HIIT Training',
    description: 'Visoko intenzivni intervalni trening za maksimalne rezultate',
    duration: 20,
    category: 'HIIT',
    difficulty: 'Advanced',
    calories: 300,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Morning Stretch',
    description: 'Lagano istezanje za dobar početak dana',
    duration: 15,
    category: 'Flexibility',
    difficulty: 'Beginner',
    calories: 80,
    createdAt: new Date().toISOString(),
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    let savedWorkouts = await StorageService.getWorkouts();
    
    
    if (savedWorkouts.length === 0) {
      savedWorkouts = INITIAL_WORKOUTS;
      await StorageService.setWorkouts(savedWorkouts);
    }
    
    setWorkouts(savedWorkouts);
    setFilteredWorkouts(savedWorkouts);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredWorkouts(workouts);
    } else {
      const filtered = workouts.filter((workout) =>
        workout.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredWorkouts(filtered);
    }
  };

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

  const renderWorkout = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.workoutName}>
            {item.name}
          </Text>
          
          <View style={styles.chipsContainer}>
            <Chip
              style={[styles.chip, { backgroundColor: getCategoryColor(item.category) }]}
              textStyle={styles.chipText}
            >
              {item.category}
            </Chip>
            <Chip
              style={[styles.chip, { backgroundColor: getDifficultyColor(item.difficulty) }]}
              textStyle={styles.chipText}
            >
              {item.difficulty}
            </Chip>
          </View>

          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text variant="labelSmall" style={styles.statLabel}>
                Trajanje
              </Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                {item.duration} min
              </Text>
            </View>
            <View style={styles.stat}>
              <Text variant="labelSmall" style={styles.statLabel}>
                Kalorije
              </Text>
              <Text variant="bodyLarge" style={styles.statValue}>
                ~{item.calories} kcal
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Pretraži treninge..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredWorkouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleLarge">Nema rezultata 😕</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Pokušaj sa drugim pojmom
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  workoutName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    height: 28,
  },
  chipText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.6,
  },
});