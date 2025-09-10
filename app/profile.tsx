import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useCharacter } from '@/hooks/useCharacter';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';
import ProgressBar from '@/components/ProgressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useLeagues } from '@/hooks/useLeagues';
import { useHaptics } from '@/hooks/useHaptics';
import { ArrowLeft, Heart, Star, Settings, Bell, HelpCircle, LogOut, Camera } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useNotifications } from '@/hooks/useNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { character, updateCharacter } = useCharacter();
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { state: leagues, currentDivision, nextDivision, progressToNext, claimPendingReward, daysUntilReset } = useLeagues();
  const { impact } = useHaptics();
  const { isGranted, requestPermission, scheduleInSeconds, scheduleDailyReminder, cancelAll } = useNotifications();

  const equipment = [
    { name: 'Accessory', type: 'Earring', stat: 'Intelligence 7' },
    { name: 'Head Gear', type: 'Hat', stat: 'Intelligence 10' },
    { name: 'Shirt', type: 'Wolf Shirt', stat: 'Aura 23' },
    { name: 'Pants', type: 'Shorts', stat: 'Speed 10' },
  ];

  const strength = Math.min(999, Math.floor(character.totalXP / 50) + character.level * 2);
  const stamina = Math.min(999, character.maxHealth + character.level * 3);
  const agility = Math.min(999, 50 + character.level * 2);
  const focus = Math.min(999, 30 + Math.floor(character.streak * 1.5));
  const luck = Math.min(999, 10 + Math.floor(character.level / 2));

  const attributes = [
    { name: 'Strength', value: strength.toString() },
    { name: 'Stamina', value: stamina.toString() },
    { name: 'Agility', value: agility.toString() },
    { name: 'Focus', value: focus.toString() },
    { name: 'Luck', value: luck.toString() },
    { name: 'Level', value: character.level.toString() },
  ];

  const skills = [
    { name: 'SKILL_NAME1', info: 'Skill_info' },
    { name: 'SKILL_NAME1', info: 'Skill_info' },
    { name: 'SKILL_NAME1', info: 'Skill_info' },
    { name: 'SKILL_NAME1', info: 'Skill_info' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Character Section */}
      <LinearGradient
        colors={[theme.accent, theme.accentSecondary]}
        locations={[0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.characterSection]}
      >
        <View style={styles.topRow}>
          {/* Left: Avatar with edit button */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={async () => {
                const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (perm.status !== 'granted') return;
                const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
                if (!result.canceled && result.assets?.[0]?.uri) {
                  updateCharacter({ avatarUrl: result.assets[0].uri });
                }
              }}
            >
              <CharacterAvatar 
                level={character.level} 
                gender={character.gender} 
                streak={character.streak}
                size="large"
                imageUrlOverride={character.avatarUrl || undefined}
              />
              <View style={styles.cameraBadge}>
                <Camera size={16} color={theme.cardText} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Right: Username and dates */}
          <View style={styles.identityBlock}>
            <Text style={[styles.identityName, { color: theme.cardText }]}>{user?.email?.split('@')[0] || 'egemenerin'}</Text>
            <Text style={[styles.identityMeta, { color: theme.cardText }]}>Member Since • 2 Jan 2025</Text>
            <Text style={[styles.identityMeta, { color: theme.cardText }]}>Last Login • 26 Mar 2025</Text>
          </View>
        </View>

        <View style={styles.barsContainer}>
          {/* Health Bar */}
          <View style={styles.barItem}>
            <View style={styles.barTitleRow}><Heart size={14} color={theme.cardText} /><Text style={[styles.barLabel, { color: theme.cardText, marginLeft: 6 }]}>Health</Text></View>
            <ProgressBar progress={character.currentHealth / character.maxHealth} color={theme.cardText} height={8} />
            <Text style={[styles.barText, { color: theme.cardText }]}>{character.currentHealth}/{character.maxHealth}</Text>
          </View>
          {/* XP Bar */}
          <View style={styles.barItem}>
            <View style={styles.barTitleRow}><Star size={14} color={theme.cardText} /><Text style={[styles.barLabel, { color: theme.cardText, marginLeft: 6 }]}>Level {character.level}</Text></View>
            <ProgressBar progress={character.xp / character.xpToNextLevel} color={theme.cardText} height={8} />
            <Text style={[styles.barText, { color: theme.cardText }]}>{character.xp}/{character.xpToNextLevel}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Equipment Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Outfits</Text>
      {equipment.map((item, index) => (
        <LinearGradient
          key={index}
          colors={[theme.accent, theme.accentSecondary]}
          locations={[0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.equipmentCard]}
        >
          <Text style={[styles.equipmentName, { color: theme.cardText }]}>{item.name}</Text>
          <Text style={[styles.equipmentType, { color: theme.cardText }]}>{item.type}</Text>
          <Text style={[styles.equipmentStat, { color: theme.cardText }]}>{item.stat}</Text>
        </LinearGradient>
      ))}

      {/* Show equipped items */}
      <View style={[styles.infoSection, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Equipped</Text>
        <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Shirt</Text><Text style={[styles.infoValue, { color: theme.text }]}>{character.equippedShirt || 'None'}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Pants</Text><Text style={[styles.infoValue, { color: theme.text }]}>{character.equippedPants || 'None'}</Text></View>
        <View style={styles.infoRow}><Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Equipment</Text><Text style={[styles.infoValue, { color: theme.text }]}>{character.equippedEquipment || 'None'}</Text></View>
      </View>

      {/* Leagues Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Leagues</Text>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={async () => { await impact('selection'); router.push('/leagues'); }}
      >
      <View style={[styles.leaguesCard, { backgroundColor: theme.surface }]}> 
        <Text style={[styles.leagueTitle, { color: theme.text }]}>Current: {currentDivision.name}</Text>
        <Text style={[styles.leagueSub, { color: theme.textSecondary }]}>Month {leagues.monthKey} • Resets in {daysUntilReset}d</Text>
        <View style={styles.leagueRow}>
          <Text style={[styles.leaguePoints, { color: theme.text }]}>{leagues.points} pts</Text>
          <Text style={[styles.leagueNext, { color: theme.textSecondary }]}>
            {nextDivision ? `Next ${nextDivision.name} at ${nextDivision.minPoints}` : 'Top division'}
          </Text>
        </View>
        <View style={[styles.progressBarShell, { backgroundColor: theme.background }]}>
          <View style={[styles.progressBarFill, { width: `${progressToNext * 100}%`, backgroundColor: theme.accent }]} />
        </View>
        {leagues.pendingRewardXp > 0 && (
          <TouchableOpacity
            style={[styles.claimButton]}
            onPress={async () => { await impact('success'); claimPendingReward(); }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[theme.accent, theme.accentSecondary]}
              locations={[0.55, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.claimGradient}
            >
              <Text style={[styles.claimText, { color: theme.cardText }]}>Claim {leagues.pendingRewardXp} XP</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      </TouchableOpacity>

      {/* Attributes Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Attributes</Text>
      <View style={styles.attributesGrid}>
        {attributes.map((attr, index) => (
          <LinearGradient
            key={index}
            colors={[theme.accent, theme.accentSecondary]}
            locations={[0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.attributeCard]}
          >
            <Text style={[styles.attributeName, { color: theme.cardText }]}>{attr.name}</Text>
            <Text style={[styles.attributeValue, { color: theme.cardText }]}>{attr.value}</Text>
          </LinearGradient>
        ))}
      </View>

      {/* Skills removed per request */}

      {/* Settings Options */}
      <View style={styles.settingsSection}>
        <LinearGradient
          colors={[theme.accent, theme.accentSecondary]}
          locations={[0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.settingsOption]}
        >
          <Settings size={20} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Settings</Text>
        </LinearGradient>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={async () => {
            const ok = isGranted ?? await requestPermission();
            if (!ok) return;
            await impact('success');
            await scheduleInSeconds(3, 'Muscledia', 'This is a test notification.');
          }}
        >
          <LinearGradient
            colors={[theme.accent, theme.accentSecondary]}
            locations={[0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.settingsOption]}
          >
            <Bell size={20} color={theme.text} />
            <Text style={[styles.settingsText, { color: theme.text }]}>Test Notification</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={async () => {
            const ok = isGranted ?? await requestPermission();
            if (!ok) return;
            await impact('success');
            // schedule daily reminder at 9:00 local time
            await scheduleDailyReminder(9, 0);
          }}
        >
          <LinearGradient
            colors={[theme.accent, theme.accentSecondary]}
            locations={[0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.settingsOption]}
          >
            <Bell size={20} color={theme.text} />
            <Text style={[styles.settingsText, { color: theme.text }]}>Enable Daily Reminder (9:00)</Text>
          </LinearGradient>
        </TouchableOpacity>
        <LinearGradient
          colors={[theme.accent, theme.accentSecondary]}
          locations={[0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.settingsOption]}
        >
          <HelpCircle size={20} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Support</Text>
        </LinearGradient>
        <TouchableOpacity 
          style={[styles.settingsOption, { backgroundColor: theme.surface }]}
          onPress={logout}
        >
          <LogOut size={20} color={theme.error} />
          <Text style={[styles.settingsText, { color: theme.error }]}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingsOption, { backgroundColor: theme.surface }]}
          onPress={async () => {
            await AsyncStorage.removeItem('onboarding_complete');
            Alert.alert('Onboarding reset', 'Close and reopen the app to see onboarding again.');
          }}
        >
          <Text style={[styles.settingsText, { color: theme.text }]}>Reset Onboarding</Text>
        </TouchableOpacity>
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
    paddingTop: 60, // Account for no header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  characterSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'column',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatarContainer: {
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 6,
    borderRadius: 16,
  },
  identityBlock: { flex: 1, marginLeft: 16 },
  identityName: { fontSize: 18, fontWeight: '700' },
  identityMeta: { fontSize: 12, marginTop: 4 },
  barsContainer: { flexDirection: 'row', gap: 12, marginTop: 16 },
  barItem: { flex: 1 },
  barTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  barLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  barText: {
    fontSize: 11,
    marginTop: 4,
  },
  infoSection: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  userInfoMerged: {
    width: '100%',
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  equipmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  equipmentType: {
    fontSize: 14,
    marginBottom: 4,
  },
  equipmentStat: {
    fontSize: 12,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  attributeCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  attributeName: {
    fontSize: 12,
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  skillCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  skillName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  skillInfo: {
    fontSize: 10,
  },
  settingsSection: {
    marginTop: 20,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingsText: {
    fontSize: 16,
    marginLeft: 12,
  },
  leaguesCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  leagueTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  leagueSub: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  leagueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaguePoints: { fontSize: 18, fontWeight: '700' },
  leagueNext: { fontSize: 12 },
  progressBarShell: { height: 8, borderRadius: 6, overflow: 'hidden', marginTop: 10 },
  progressBarFill: { height: '100%', borderRadius: 6 },
  claimButton: { marginTop: 12 },
  claimGradient: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  claimText: { fontWeight: '700' },
}); 