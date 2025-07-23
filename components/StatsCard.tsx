import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';

type StatsCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  accentColor?: string;
  useGoldenCard?: boolean; // New prop for golden card style
};

export default function StatsCard({
  title,
  value,
  icon,
  accentColor = Colors.primary,
  useGoldenCard = false,
}: StatsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  const cardBackground = useGoldenCard ? theme.cardBackground : theme.surface;
  const textColor = useGoldenCard ? theme.cardText : theme.text;
  const secondaryTextColor = useGoldenCard ? theme.cardText : theme.textSecondary;

  return (
    <View style={[styles.container, { 
      backgroundColor: cardBackground,
      borderColor: theme.border,
      shadowColor: isDark ? Colors.black : accentColor,
    }]}>
      {icon && (
        <View style={[styles.iconContainer, { 
          backgroundColor: useGoldenCard ? 'rgba(0,0,0,0.1)' : accentColor + '15',
          borderRadius: 12,
          padding: 8,
        }]}>
          {icon}
        </View>
      )}
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={[styles.title, { color: secondaryTextColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
});