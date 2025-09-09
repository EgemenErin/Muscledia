import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RaidBoss = {
  id: string;
  name: string;
  description: string;
  weeklyTargetSets: number;
  rewardXP: number;
};

type RaidState = {
  boss: RaidBoss;
  weekKey: string; // e.g., 2025-W14
  totalSets: number; // user's local sets contribution this week
};

type RaidContextType = {
  state: RaidState;
  contributeSets: (n: number) => Promise<void>;
  resetForNewWeekIfNeeded: () => Promise<void>;
};

const DEFAULT_BOSS: RaidBoss = {
  id: 'champion-titan',
  name: 'Titan of Iron',
  description: 'Your weekly Muscle Champion. Complete sets to clear your challenge!',
  weeklyTargetSets: 60,
  rewardXP: 500,
};

const getWeekKey = (d = new Date()) => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date as any) - (yearStart as any)) / 86400000 / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
};

const RaidContext = createContext<RaidContextType | undefined>(undefined);

export const RaidProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<RaidState>({ boss: DEFAULT_BOSS, weekKey: getWeekKey(), totalSets: 0 });

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('raid_state');
      if (stored) {
        const parsed: RaidState = JSON.parse(stored);
        const currentKey = getWeekKey();
        if (parsed.weekKey !== currentKey) {
          const fresh = { boss: DEFAULT_BOSS, weekKey: currentKey, totalSets: 0 };
          setState(fresh);
          await AsyncStorage.setItem('raid_state', JSON.stringify(fresh));
        } else {
          setState({ ...parsed, boss: DEFAULT_BOSS });
        }
      } else {
        const init = { boss: DEFAULT_BOSS, weekKey: getWeekKey(), totalSets: 0 };
        setState(init);
        await AsyncStorage.setItem('raid_state', JSON.stringify(init));
      }
    })();
  }, []);

  const persist = async (s: RaidState) => {
    setState(s);
    await AsyncStorage.setItem('raid_state', JSON.stringify(s));
  };

  const contributeSets = async (n: number) => {
    if (n <= 0) return;
    const currentKey = getWeekKey();
    const next = { ...state, weekKey: currentKey, totalSets: state.totalSets + n };
    await persist(next);
  };

  const resetForNewWeekIfNeeded = async () => {
    const currentKey = getWeekKey();
    if (currentKey !== state.weekKey) {
      await persist({ boss: DEFAULT_BOSS, weekKey: currentKey, totalSets: 0 });
    }
  };

  return (
    <RaidContext.Provider value={{ state, contributeSets, resetForNewWeekIfNeeded }}>
      {children}
    </RaidContext.Provider>
  );
};

export const useRaid = () => {
  const ctx = useContext(RaidContext);
  if (!ctx) throw new Error('useRaid must be used within RaidProvider');
  return ctx;
};
