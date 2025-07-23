import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useCharacter } from '@/hooks/useCharacter';
import { Colors, getThemeColors } from '@/constants/Colors';
import { Zap, Trophy, Clock, CheckCircle } from 'lucide-react-native';
import { dailyQuests, weeklyQuests, specialQuests } from '@/data/quests';

export default function QuestsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { character, incrementXP, completeQuest } = useCharacter();
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  const handleQuestComplete = (questId: string, xpReward: number) => {
    if (!completedQuests.includes(questId)) {
      setCompletedQuests([...completedQuests, questId]);
      incrementXP(xpReward);
      completeQuest(questId, xpReward);
    }
  };

  const QuestCard = ({ quest, type }: { quest: { id: string; title: string; description: string; xp: number }; type: string }) => {
    const isCompleted = completedQuests.includes(quest.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.questCard,
          { backgroundColor: isCompleted ? theme.success : theme.cardBackground }
        ]}
        onPress={() => handleQuestComplete(quest.id, quest.xp)}
        disabled={isCompleted}
      >
        <View style={styles.questHeader}>
          <View style={[styles.questIcon, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
            {isCompleted ? (
              <CheckCircle size={24} color={theme.cardText} />
            ) : (
              <Zap size={24} color={theme.cardText} />
            )}
          </View>
          <View style={styles.questInfo}>
            <Text style={[styles.questTitle, { color: theme.cardText }]}>
              {quest.title}
            </Text>
            <Text style={[styles.questDescription, { color: theme.cardText }]}>
              {quest.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.questReward}>
          <View style={styles.rewardContainer}>
            <Zap size={16} color={theme.cardText} />
            <Text style={[styles.rewardText, { color: theme.cardText }]}>
              +{quest.xp} XP
            </Text>
          </View>
          <Text style={[styles.questType, { color: theme.cardText }]}>
            {type}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Stats Header */}
      <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Trophy size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {character.questsCompleted}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Completed
          </Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {dailyQuests.length - completedQuests.filter(id => 
              dailyQuests.some(q => q.id === id)
            ).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Remaining
          </Text>
        </View>
        <View style={styles.statItem}>
          <Zap size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {character.totalXP}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total XP
          </Text>
        </View>
      </View>

      {/* Daily Quests */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Daily Challenges
      </Text>
      {dailyQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} type="Daily" />
      ))}

      {/* Weekly Challenges */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Weekly Challenges
      </Text>
      {weeklyQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} type="Weekly" />
      ))}

      {/* Special Events */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Special Events
      </Text>
      {specialQuests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} type="Special" />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  questCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  questReward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questType: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
});