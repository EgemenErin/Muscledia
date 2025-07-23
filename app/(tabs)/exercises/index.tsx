import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  useColorScheme 
} from 'react-native';
import { router } from 'expo-router';
import { useCharacter } from '@/hooks/useCharacter';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Colors, getThemeColors } from '@/constants/Colors';
import { Search, Filter, Plus, Dumbbell, ArrowLeft } from 'lucide-react-native';

export default function ExercisesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const { incrementXP } = useCharacter();
  const { addWorkout } = useWorkouts();

  const categories = ['Popular', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  const exercises = [
    { 
      name: 'Bench Press', 
      category: 'Chest', 
      popular: true,
      icon: '🏋️',
      description: 'Classic chest exercise',
      sets: 3,
      reps: 12,
      weight: 60
    },
    { 
      name: 'Squats', 
      category: 'Legs', 
      popular: true,
      icon: '🦵',
      description: 'Fundamental leg exercise',
      sets: 3,
      reps: 15,
      weight: 80
    },
    { 
      name: 'Deadlift', 
      category: 'Back', 
      popular: true,
      icon: '💪',
      description: 'Full body compound movement',
      sets: 3,
      reps: 8,
      weight: 100
    },
    { 
      name: 'Pull-ups', 
      category: 'Back', 
      popular: true,
      icon: '🤲',
      description: 'Upper body pulling exercise',
      sets: 3,
      reps: 10,
      weight: 0
    },
    { 
      name: 'Overhead Press', 
      category: 'Shoulders', 
      popular: false,
      icon: '🏋️',
      description: 'Shoulder strengthening',
      sets: 3,
      reps: 10,
      weight: 40
    },
    { 
      name: 'Dips', 
      category: 'Chest', 
      popular: false,
      icon: '💪',
      description: 'Bodyweight chest exercise',
      sets: 3,
      reps: 12,
      weight: 0
    },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Popular' 
      ? exercise.popular 
      : exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddExercise = async (exercise: any) => {
    await addWorkout({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      weight: exercise.weight.toString()
    });
    incrementXP(50);
    router.back();
  };

  const ExerciseCard = ({ exercise }: { exercise: any }) => (
    <TouchableOpacity 
      style={[styles.exerciseCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleAddExercise(exercise)}
    >
      <View style={styles.exerciseIcon}>
        <Text style={styles.iconText}>{exercise.icon}</Text>
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseName, { color: theme.cardText }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseDescription, { color: theme.cardText }]}>
          {exercise.description}
        </Text>
        <Text style={[styles.exerciseDetails, { color: theme.cardText }]}>
          {exercise.sets} sets • {exercise.reps} reps • {exercise.weight}kg
        </Text>
      </View>
      <View style={styles.addButton}>
        <Plus size={20} color={theme.cardText} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Browse Exercises</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{selectedCategory}</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <Search size={20} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search exercises..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity>
          <Filter size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: selectedCategory === category 
                  ? theme.cardBackground 
                  : theme.surface 
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.categoryText,
                { 
                  color: selectedCategory === category 
                    ? theme.cardText 
                    : theme.textSecondary 
                }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercises List */}
      <ScrollView style={styles.exercisesList}>
        {filteredExercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  exerciseDetails: {
    fontSize: 11,
    opacity: 0.7,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});