import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';
import { Shirt, Shield, Sword, Gem } from 'lucide-react-native';

export default function ShopScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  const shopCategories = [
    {
      title: 'Shirts',
      items: [
        { name: 'Basic Tee', price: 50, icon: '👕' },
        { name: 'Tank Top', price: 75, icon: '👕' },
        { name: 'Muscle Shirt', price: 100, icon: '👕' },
        { name: 'Pro Shirt', price: 150, icon: '👕' },
      ]
    },
    {
      title: 'Pants',
      items: [
        { name: 'Shorts', price: 60, icon: '🩳' },
        { name: 'Joggers', price: 80, icon: '👖' },
        { name: 'Pro Pants', price: 120, icon: '👖' },
        { name: 'Elite Gear', price: 200, icon: '👖' },
      ]
    },
    {
      title: 'Equipment',
      items: [
        { name: 'Dumbbells', price: 300, icon: '🏋️' },
        { name: 'Barbell', price: 500, icon: '🏋️' },
        { name: 'Bench', price: 400, icon: '🪑' },
        { name: 'Rack', price: 800, icon: '🏗️' },
      ]
    },
    {
      title: 'Backgrounds',
      items: [
        { name: 'Gym Floor', price: 100, icon: '🏟️' },
        { name: 'Beach', price: 150, icon: '🏖️' },
        { name: 'Mountains', price: 200, icon: '⛰️' },
        { name: 'Space', price: 300, icon: '🌌' },
      ]
    }
  ];

  const ShopItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.shopItem, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemIcon, { color: theme.cardText }]}>{item.icon}</Text>
        <Text style={[styles.itemName, { color: theme.cardText }]}>{item.name}</Text>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.priceContainer}>
          <Gem size={16} color={theme.cardText} />
          <Text style={[styles.itemPrice, { color: theme.cardText }]}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.welcomeText, { color: theme.text }]}>
        Welcome to the shop! Treat yourself. Come to see{'\n'}what we have for you!
      </Text>

      {shopCategories.map((category, index) => (
        <View key={index} style={styles.categorySection}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>{category.title}</Text>
          <View style={styles.itemsGrid}>
            {category.items.map((item, itemIndex) => (
              <ShopItem key={itemIndex} item={item} />
            ))}
          </View>
        </View>
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
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopItem: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  itemHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemFooter: {
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 