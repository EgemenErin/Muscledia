import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { getThemeColors } from '@/constants/Colors';
import { useCharacter } from '@/hooks/useCharacter';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomizeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  const { character, updateCharacter } = useCharacter();
  const insets = useSafeAreaInsets();

  // For now we only let user pick backgrounds they've set (or sample presets)
  const backgrounds = [
    { name: 'Gym Floor', url: 'https://images.unsplash.com/photo-1517963879433-6ad2b3bf0f84?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Mountains', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Space', url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1200&auto=format&fit=crop' },
  ];

  // Build owned items lists
  const shirts = character.ownedShirts || [];
  const pants = character.ownedPants || [];
  const equipment = character.ownedEquipment || [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: 16, paddingTop: Math.max(16, (insets?.top || 0) + 8) }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Customize</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Backgrounds</Text>
      <View style={styles.grid}>
        {backgrounds.map(bg => (
          <TouchableOpacity key={bg.name} style={styles.card} activeOpacity={0.9} onPress={() => updateCharacter({ characterBackgroundUrl: bg.url })}>
            <Image source={{ uri: bg.url }} style={styles.bgThumb} />
            <LinearGradient colors={[theme.accent, theme.accentSecondary]} locations={[0.55, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardFooter}>
              <Text style={[styles.cardText, { color: theme.cardText }]}>{bg.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Shirts</Text>
      {shirts.length === 0 ? (
        <Text style={{ color: theme.textSecondary, marginBottom: 8 }}>No shirts owned yet.</Text>
      ) : (
        <View style={styles.tagRow}>
          {shirts.map(name => (
            <TouchableOpacity key={name} style={styles.tag} onPress={() => updateCharacter({ equippedShirt: name })}>
              <Text style={{ color: theme.text }}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Pants</Text>
      {pants.length === 0 ? (
        <Text style={{ color: theme.textSecondary, marginBottom: 8 }}>No pants owned yet.</Text>
      ) : (
        <View style={styles.tagRow}>
          {pants.map(name => (
            <TouchableOpacity key={name} style={styles.tag} onPress={() => updateCharacter({ equippedPants: name })}>
              <Text style={{ color: theme.text }}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Equipment</Text>
      {equipment.length === 0 ? (
        <Text style={{ color: theme.textSecondary, marginBottom: 8 }}>No equipment owned yet.</Text>
      ) : (
        <View style={styles.tagRow}>
          {equipment.map(name => (
            <TouchableOpacity key={name} style={styles.tag} onPress={() => updateCharacter({ equippedEquipment: name, baseStrength: (character.baseStrength||10)+5 })}>
              <Text style={{ color: theme.text }}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  bgThumb: { width: '100%', height: 100 },
  cardFooter: { padding: 10 },
  cardText: { fontWeight: '700', textAlign: 'center' },
  placeholder: { borderRadius: 12, padding: 16 },
  placeholderText: { textAlign: 'center' },
});


