import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getThemeColors } from '@/constants/Colors';
import { useLeagues } from '@/hooks/useLeagues';
import { useHaptics } from '@/hooks/useHaptics';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaguesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { state, divisions, currentDivision, nextDivision, progressToNext, daysUntilReset, claimPendingReward, resetIfNewMonth } = useLeagues();
  const { impact } = useHaptics();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    resetIfNewMonth();
  }, [resetIfNewMonth]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ padding: 16, paddingTop: Math.max(16, (insets?.top || 0) + 8) }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={async () => { await impact('selection'); router.back(); }}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Leagues</Text>
        <View style={{ width: 24 }} />
      </View>

      <LinearGradient
        colors={[theme.accent, theme.accentSecondary]}
        locations={[0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card]}
      >
        <Text style={[styles.title, { color: theme.cardText }]}>Monthly Divisions</Text>
        <Text style={[styles.meta, { color: theme.cardText }]}>Month: {state.monthKey} • Resets in {daysUntilReset}d</Text>

        <View style={styles.rowBetween}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: theme.cardText }]}>{currentDivision.name}</Text>
          </View>
          <Text style={[styles.points, { color: theme.cardText }]}>{state.points} pts</Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: 'rgba(0,0,0,0.25)' }]}>
          <View style={[styles.progressFill, { width: `${progressToNext * 100}%`, backgroundColor: theme.cardText }]} />
        </View>
        <Text style={[styles.meta, { color: theme.cardText }]}>
          {nextDivision ? `Next: ${nextDivision.name} at ${nextDivision.minPoints} pts` : 'Top division reached'}
        </Text>

        {state.pendingRewardXp > 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginTop: 12 }}
            onPress={async () => { await impact('success'); claimPendingReward(); }}
          >
            <LinearGradient
              colors={[theme.accent, theme.accentSecondary]}
              locations={[0.55, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.rewardCard]}
            >
              <Text style={[styles.rewardText, { color: theme.cardText }]}>Claim {state.pendingRewardXp} XP</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Divisions</Text>
        {divisions.map(div => (
          <View key={div.id} style={[styles.divisionRow]}> 
            <Text style={[styles.divisionName, { color: theme.text }]}>{div.name}</Text>
            <Text style={[styles.divisionInfo, { color: theme.textSecondary }]}>
              {div.minPoints} pts • Reward {div.rewardXp} XP
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  badge: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.2)' },
  badgeText: { fontWeight: '700' },
  points: { fontSize: 18, fontWeight: 'bold' },
  progressBar: { height: 8, borderRadius: 6, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', borderRadius: 6 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  divisionRow: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.06)' },
  divisionName: { fontSize: 14, fontWeight: '600' },
  divisionInfo: { fontSize: 12 },
  rewardCard: { padding: 14, borderRadius: 12, alignItems: 'center' },
  rewardText: { fontWeight: '700' },
});


