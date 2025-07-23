import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, getThemeColors } from '@/constants/Colors';
import { ArrowLeft, Check, X, ChevronDown, Plus, Edit } from 'lucide-react-native';
import { useRoutines } from '@/hooks/useRoutines';
import { useCharacter } from '@/hooks/useCharacter';

export default function RoutineWorkoutScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { getRoutine, markSetCompleted, deleteRoutine, updateRoutine } = useRoutines();
  const { incrementXP } = useCharacter();
  
  const [routine, setRoutine] = useState<any>(null);
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRoutine = getRoutine(id as string);
      setRoutine(foundRoutine);
      
      // Expand all exercises by default
      if (foundRoutine) {
        setExpandedExercises(foundRoutine.exercises.map((ex: any) => ex.id));
      }
    }
  }, [id]);

  const handleSetCompletion = async (exerciseId: string, setId: string, currentStatus: boolean) => {
    if (!routine) return;

    const newStatus = !currentStatus;
    await markSetCompleted(routine.id, exerciseId, setId, newStatus);
    
    // Update local state
    const updatedRoutine = { ...routine };
    const exercise = updatedRoutine.exercises.find((ex: any) => ex.id === exerciseId);
    if (exercise) {
      const set = exercise.sets.find((s: any) => s.id === setId);
      if (set) {
        set.completed = newStatus;
        setRoutine(updatedRoutine);
        
        // Give XP for completing a set
        if (newStatus) {
          incrementXP(10);
        }
      }
    }
  };

  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleDeleteRoutine = () => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRoutine(routine.id);
            router.back();
          },
        },
      ]
    );
  };

  const addSetToExercise = (exerciseId: string) => {
    if (!routine) return;
    
    const updatedRoutine = { ...routine };
    const exercise = updatedRoutine.exercises.find((ex: any) => ex.id === exerciseId);
    if (exercise) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      const newSet = {
        id: `${Date.now()}-${exercise.sets.length}`,
        reps: lastSet?.reps || 12,
        weight: lastSet?.weight || 60,
        completed: false,
      };
      exercise.sets.push(newSet);
      setRoutine(updatedRoutine);
      updateRoutine(routine.id, updatedRoutine);
    }
  };

  const removeSet = (exerciseId: string, setId: string) => {
    if (!routine) return;
    
    const updatedRoutine = { ...routine };
    const exercise = updatedRoutine.exercises.find((ex: any) => ex.id === exerciseId);
    if (exercise && exercise.sets.length > 1) {
      exercise.sets = exercise.sets.filter((set: any) => set.id !== setId);
      setRoutine(updatedRoutine);
      updateRoutine(routine.id, updatedRoutine);
    }
  };

  const updateSetValue = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: number) => {
    if (!routine) return;
    
    const updatedRoutine = { ...routine };
    const exercise = updatedRoutine.exercises.find((ex: any) => ex.id === exerciseId);
    if (exercise) {
      const set = exercise.sets.find((s: any) => s.id === setId);
      if (set) {
        set[field] = value;
        setRoutine(updatedRoutine);
        updateRoutine(routine.id, updatedRoutine);
      }
    }
  };

  const getTotalSets = () => {
    if (!routine) return { completed: 0, total: 0 };
    
    let completed = 0;
    let total = 0;
    
    routine.exercises.forEach((exercise: any) => {
      exercise.sets.forEach((set: any) => {
        total++;
        if (set.completed) completed++;
      });
    });
    
    return { completed, total };
  };

  if (!routine) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Routine not found</Text>
      </View>
    );
  }

  const { completed, total } = getTotalSets();
  const progress = total > 0 ? completed / total : 0;

  const ExerciseCard = ({ exercise }: { exercise: any }) => {
    const isExpanded = expandedExercises.includes(exercise.id);
    const completedSets = exercise.sets.filter((set: any) => set.completed).length;
    
    return (
      <View style={[styles.exerciseCard, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          style={styles.exerciseHeader}
          onPress={() => toggleExerciseExpansion(exercise.id)}
        >
          <View style={styles.exerciseIcon}>
            <Text style={styles.iconText}>🏋️</Text>
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
            <Text style={[styles.exerciseProgress, { color: theme.textSecondary }]}>
              {completedSets}/{exercise.sets.length} sets completed
            </Text>
          </View>
          <ChevronDown 
            size={20} 
            color={theme.textMuted} 
            style={{ 
              transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] 
            }} 
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.setsContainer}>
            <View style={styles.setsHeader}>
              <Text style={[styles.setLabel, { color: theme.textSecondary }]}>Set</Text>
              <Text style={[styles.setLabel, { color: theme.textSecondary }]}>Weight</Text>
              <Text style={[styles.setLabel, { color: theme.textSecondary }]}>Reps</Text>
              <Text style={[styles.setLabel, { color: theme.textSecondary }]}>✓</Text>
            </View>

            {exercise.sets.map((set: any, index: number) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={[styles.setNumber, { color: theme.text }]}>{index + 1}</Text>
                
                {isEditMode ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.editableValue, { backgroundColor: theme.background }]}
                      onPress={() => {
                        Alert.prompt(
                          'Edit Weight',
                          'Enter weight in kg:',
                          (text) => {
                            const value = parseFloat(text || '0');
                            if (!isNaN(value) && value >= 0) {
                              updateSetValue(exercise.id, set.id, 'weight', value);
                            }
                          },
                          'plain-text',
                          set.weight.toString()
                        );
                      }}
                    >
                      <Text style={[styles.editableText, { color: theme.text }]}>{set.weight}kg</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.editableValue, { backgroundColor: theme.background }]}
                      onPress={() => {
                        Alert.prompt(
                          'Edit Reps',
                          'Enter number of reps:',
                          (text) => {
                            const value = parseInt(text || '0');
                            if (!isNaN(value) && value > 0) {
                              updateSetValue(exercise.id, set.id, 'reps', value);
                            }
                          },
                          'plain-text',
                          set.reps.toString()
                        );
                      }}
                    >
                      <Text style={[styles.editableText, { color: theme.text }]}>{set.reps}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={() => removeSet(exercise.id, set.id)}
                      style={styles.removeButton}
                    >
                      <X size={16} color={theme.error} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={[styles.setValue, { color: theme.text }]}>{set.weight}kg</Text>
                    <Text style={[styles.setValue, { color: theme.text }]}>{set.reps}</Text>
                    <TouchableOpacity
                      style={[
                        styles.checkBox,
                        { 
                          backgroundColor: set.completed ? theme.accent : 'transparent',
                          borderColor: set.completed ? theme.accent : theme.border,
                        }
                      ]}
                      onPress={() => handleSetCompletion(exercise.id, set.id, set.completed)}
                    >
                      {set.completed && <Check size={16} color={theme.cardText} />}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
            
            {isEditMode && (
              <TouchableOpacity 
                style={[styles.addSetButton, { backgroundColor: theme.accent }]}
                onPress={() => addSetToExercise(exercise.id)}
              >
                <Plus size={16} color={theme.cardText} />
                <Text style={[styles.addSetText, { color: theme.cardText }]}>Add Set</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{routine.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setIsEditMode(!isEditMode)}
            style={[styles.editButton, { backgroundColor: isEditMode ? theme.accent : 'transparent' }]}
          >
            <Edit size={20} color={isEditMode ? theme.cardText : theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteRoutine}>
            <X size={24} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: theme.surface }]}>
        <Text style={[styles.progressText, { color: theme.text }]}>
          Progress: {completed}/{total} sets
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.background }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.accent,
                width: `${progress * 100}%`,
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressPercent, { color: theme.textSecondary }]}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>

      {/* Exercises List */}
      <ScrollView style={styles.content}>
        {routine.exercises.map((exercise: any) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}

        {/* Completion Message */}
        {progress === 1 && (
          <View style={[styles.completionCard, { backgroundColor: theme.accent }]}>
            <Text style={[styles.completionText, { color: theme.cardText }]}>
              🎉 Workout Complete! Great job!
            </Text>
            <Text style={[styles.completionSubtext, { color: theme.cardText }]}>
              You earned {total * 10} XP for completing all sets!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  progressContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  exerciseProgress: {
    fontSize: 12,
  },
  setsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  setsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  setLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  setValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
  },
  completionCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  completionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completionSubtext: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  editableValue: {
    flex: 1,
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  editableText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  addSetText: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 