import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { useCharacter } from '@/hooks/useCharacter';
import { useAuth } from '@/hooks/useAuth';
import CharacterAvatar from '@/components/CharacterAvatar';
import ProgressBar from '@/components/ProgressBar';
import { ArrowLeft, Heart, Star, Settings, Bell, HelpCircle, LogOut } from 'lucide-react-native';
import { Colors, getThemeColors } from '@/constants/Colors';

export default function ProfileScreen() {
  const { character, updateCharacter } = useCharacter();
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  const equipment = [
    { name: 'Accessory', type: 'Earring', stat: 'Intelligence 7' },
    { name: 'Head Gear', type: 'Hat', stat: 'Intelligence 10' },
    { name: 'Shirt', type: 'Wolf Shirt', stat: 'Aura 23' },
    { name: 'Pants', type: 'Shorts', stat: 'Speed 10' },
  ];

  const attributes = [
    { name: 'Level', value: character.level.toString() },
    { name: 'Intelligence', value: '232' },
    { name: 'Muscle Mass', value: '232' },
    { name: 'Agility', value: '232' },
    { name: 'Push Muscles', value: '232' },
    { name: 'Pull Muscles', value: '232' },
    { name: 'Leg Muscles', value: '232' },
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
      <View style={[styles.characterSection, { backgroundColor: theme.surface }]}>
        {/* Health Bar */}
        <View style={styles.healthContainer}>
          <Heart size={16} color={theme.health} />
          <Text style={[styles.barLabel, { color: theme.text }]}>Health</Text>
          <ProgressBar 
            progress={0.58} // 29/50
            color={theme.health}
            height={8}
          />
          <Text style={[styles.barText, { color: theme.textSecondary }]}>29/50</Text>
        </View>

        {/* Character Avatar */}
        <View style={styles.avatarContainer}>
          <CharacterAvatar 
            level={character.level} 
            gender={character.gender} 
            streak={character.streak}
            size="large"
          />
        </View>

        {/* Level Bar */}
        <View style={styles.levelContainer}>
          <Star size={16} color={theme.xp} />
          <Text style={[styles.barLabel, { color: theme.text }]}>Level {character.level}</Text>
          <ProgressBar 
            progress={character.xp / character.xpToNextLevel} 
            color={theme.xp}
            height={8}
          />
          <Text style={[styles.barText, { color: theme.textSecondary }]}>
            {character.xp}/{character.xpToNextLevel}
          </Text>
        </View>
      </View>

      {/* User Info */}
      <View style={[styles.infoSection, { backgroundColor: theme.surface }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Username</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email?.split('@')[0] || 'egemenerin'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>User ID</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>832745387414693-953</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Member Since</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>2 Jan 2025</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Last Logged In</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>26 March 2025</Text>
        </View>
      </View>

      {/* Equipment Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Outfits</Text>
      {equipment.map((item, index) => (
        <View key={index} style={[styles.equipmentCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.equipmentName, { color: theme.cardText }]}>{item.name}</Text>
          <Text style={[styles.equipmentType, { color: theme.cardText }]}>{item.type}</Text>
          <Text style={[styles.equipmentStat, { color: theme.cardText }]}>{item.stat}</Text>
        </View>
      ))}

      {/* Attributes Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Attributes</Text>
      <View style={styles.attributesGrid}>
        {attributes.map((attr, index) => (
          <View key={index} style={[styles.attributeCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.attributeName, { color: theme.textSecondary }]}>{attr.name}</Text>
            <Text style={[styles.attributeValue, { color: theme.text }]}>{attr.value}</Text>
          </View>
        ))}
      </View>

      {/* Skills Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills</Text>
      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <View key={index} style={[styles.skillCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.skillName, { color: theme.cardText }]}>{skill.name}</Text>
            <Text style={[styles.skillInfo, { color: theme.cardText }]}>{skill.info}</Text>
          </View>
        ))}
      </View>

      {/* Settings Options */}
      <View style={styles.settingsSection}>
        <TouchableOpacity style={[styles.settingsOption, { backgroundColor: theme.surface }]}>
          <Settings size={20} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsOption, { backgroundColor: theme.surface }]}>
          <Bell size={20} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsOption, { backgroundColor: theme.surface }]}>
          <HelpCircle size={20} color={theme.text} />
          <Text style={[styles.settingsText, { color: theme.text }]}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingsOption, { backgroundColor: theme.surface }]}
          onPress={logout}
        >
          <LogOut size={20} color={theme.error} />
          <Text style={[styles.settingsText, { color: theme.error }]}>Logout</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthContainer: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 10,
  },
  levelContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
  },
  avatarContainer: {
    alignItems: 'center',
  },
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
}); 