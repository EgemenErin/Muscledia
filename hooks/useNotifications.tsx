import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

type NotificationsContextType = {
  isGranted: boolean | null;
  requestPermission: () => Promise<boolean>;
  scheduleDailyReminder: (hour: number, minute: number) => Promise<void>;
  scheduleInSeconds: (seconds: number, title: string, body: string) => Promise<void>;
  cancelAll: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGranted, setIsGranted] = useState<boolean | null>(null);

  useEffect(() => {
    // Configure handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    (async () => {
      const settings = await Notifications.getPermissionsAsync();
      setIsGranted(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL || false);
    })();
  }, []);

  const requestPermission = async () => {
    const settings = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    const granted = settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL || false;
    setIsGranted(granted);
    return granted;
  };

  const scheduleDailyReminder = async (hour: number, minute: number) => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
        vibrationPattern: [200, 100, 200],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Muscledia',
        body: "Time to log a workout!",
      },
      trigger: { hour, minute, repeats: true },
    });
  };

  const scheduleInSeconds = async (seconds: number, title: string, body: string) => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds },
    });
  };

  const cancelAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return (
    <NotificationsContext.Provider value={{ isGranted, requestPermission, scheduleDailyReminder, scheduleInSeconds, cancelAll }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};


