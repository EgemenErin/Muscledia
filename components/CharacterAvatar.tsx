import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

type CharacterAvatarProps = {
  level: number;
  gender: string;
  streak: number;
  size?: 'small' | 'medium' | 'large';
  imageUrlOverride?: string | null;
};

export default function CharacterAvatar({ level, gender, streak, size = 'medium', imageUrlOverride }: CharacterAvatarProps) {
  const flameOpacity = useRef(new Animated.Value(0.4)).current;
  
  useEffect(() => {
    // Pulsing animation for the flame effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flameOpacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Determine avatar stage based on level
  const getAvatarStage = (level: number) => {
    if (level < 5) return 'beginner';
    if (level < 15) return 'intermediate';
    if (level < 30) return 'advanced';
    return 'master';
  };

  // Get avatar image based on gender and stage
  const getAvatarImage = () => {
    if (imageUrlOverride) return imageUrlOverride;
    const stage = getAvatarStage(level);
    const avatarGender = gender === 'male' ? 'male' : 'female';
    
    // Placeholder URLs for avatar images - in a real app, you'd use actual images
    const avatarImages = {
      male: {
        beginner: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        intermediate: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        advanced: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        master: 'https://images.pexels.com/photos/1431283/pexels-photo-1431283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      female: {
        beginner: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        intermediate: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        advanced: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        master: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      }
    };
    
    return avatarImages[avatarGender][stage];
  };

  // Determine size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 50, height: 50, borderRadius: 25 };
      case 'large':
        return { width: 120, height: 120, borderRadius: 60 };
      case 'medium':
      default:
        return { width: 80, height: 80, borderRadius: 40 };
    }
  };

  const sizeDimensions = getSizeDimensions();
  const showFlame = streak >= 3; // Show flame effect for streaks of 3 or more days

  return (
    <View style={[styles.container, sizeDimensions]}>
      <Image
        source={{ uri: getAvatarImage() }}
        style={[styles.avatarImage, sizeDimensions]}
      />
      
      {showFlame && (
        <Animated.View 
          style={[
            styles.streakEffect,
            {
              opacity: flameOpacity,
              width: sizeDimensions.width * 1.2,
              height: sizeDimensions.height * 0.6,
              top: -sizeDimensions.height * 0.4,
              left: -sizeDimensions.width * 0.1,
            }
          ]}
        >
          <Image
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fitness-app-images/o/flame_effect.png?alt=media' }}
            style={styles.flameImage}
            resizeMode="contain"
          />
        </Animated.View>
      )}
      
      <View 
        style={[
          styles.levelBadge,
          {
            width: size === 'small' ? 20 : size === 'large' ? 36 : 28,
            height: size === 'small' ? 20 : size === 'large' ? 36 : 28,
            borderRadius: size === 'small' ? 10 : size === 'large' ? 18 : 14,
            bottom: size === 'small' ? -5 : size === 'large' ? -10 : -8,
            right: size === 'small' ? -5 : size === 'large' ? -10 : -8,
          }
        ]}
      >
        <Image
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fitness-app-images/o/level_badge.png?alt=media' }}
          style={styles.badgeImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#6D28D9',
  },
  streakEffect: {
    position: 'absolute',
    width: 100,
    height: 50,
    top: -30,
    left: -10,
    zIndex: 10,
  },
  flameImage: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -8,
    right: -8,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
});