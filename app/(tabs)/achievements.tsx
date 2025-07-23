import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useCharacter } from '@/hooks/useCharacter';
import { Colors, getThemeColors } from '@/constants/Colors';
import { Trophy, Star, Award, Crown, Zap } from 'lucide-react-native';
import { badges } from '@/data/badges';

export default function AchievementsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { character } = useCharacter();

  // Check if badge is unlocked based on character progress
  const isBadgeUnlocked = (badge: any) => {
    switch (badge.id) {
      case 'first-workout':
        return character.totalXP > 0;
      case 'streak-master':
        return character.streak >= 7;
      case 'xp-collector':
        return character.totalXP >= 1000;
      case 'quest-hunter':
        return character.questsCompleted >= 10;
      case 'level-up':
        return character.level >= 5;
      case 'dedication':
        return character.streak >= 30;
      default:
        return false;
    }
  };

  const BadgeCard = ({ badge }: { badge: any }) => {
    const unlocked = isBadgeUnlocked(badge);
    
    return (
      <View 
        style={[
          styles.badgeCard, 
          { 
            backgroundColor: unlocked ? theme.cardBackground : theme.surface,
            opacity: unlocked ? 1 : 0.6 
          }
        ]}
      >
        <View style={[styles.badgeIcon, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
          {unlocked ? (
            <Trophy size={32} color={theme.cardText} />
          ) : (
            <Award size={32} color={theme.textMuted} />
          )}
        </View>
        <Text style={[styles.badgeTitle, { color: unlocked ? theme.cardText : theme.text }]}>
          {badge.title}
        </Text>
        <Text style={[styles.badgeDescription, { color: unlocked ? theme.cardText : theme.textSecondary }]}>
          {badge.description}
        </Text>
        {unlocked && (
          <View style={styles.unlockedIndicator}>
            <Star size={16} color={theme.cardText} />
            <Text style={[styles.unlockedText, { color: theme.cardText }]}>Unlocked!</Text>
          </View>
        )}
      </View>
    );
  };

  const StatsCard = ({ icon, title, value, color }: { icon: any; title: string; value: string; color: string }) => (
    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Stats Overview */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Progress</Text>
      <View style={styles.statsGrid}>
        <StatsCard 
          icon={<Trophy size={20} color={theme.accent} />}
          title="Level"
          value={character.level.toString()}
          color={theme.accent}
        />
        <StatsCard 
          icon={<Zap size={20} color="#0EA5E9" />}
          title="Total XP"
          value={character.totalXP.toString()}
          color="#0EA5E9"
        />
        <StatsCard 
          icon={<Award size={20} color="#10B981" />}
          title="Quests"
          value={character.questsCompleted.toString()}
          color="#10B981"
        />
        <StatsCard 
          icon={<Crown size={20} color="#F97316" />}
          title="Streak"
          value={character.streak.toString()}
          color="#F97316"
        />
      </View>

      {/* Achievements */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
      <View style={styles.badgesGrid}>
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </View>

      {/* Arena Info */}
      <View style={[styles.arenaCard, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.arenaTitle, { color: theme.cardText }]}>Training Arena</Text>
        <Text style={[styles.arenaDescription, { color: theme.cardText }]}>
          Compete with other warriors and climb the leaderboards!
        </Text>
        <Text style={[styles.arenaStatus, { color: theme.cardText }]}>
          Coming Soon...
        </Text>
      </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  badgeCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  arenaCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arenaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  arenaDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  arenaStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});