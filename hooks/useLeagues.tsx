import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCharacter } from './useCharacter';

type DivisionId = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'challenger';

type Division = {
  id: DivisionId;
  name: string;
  minPoints: number;
  rewardXp: number;
};

type LeaguesState = {
  monthKey: string; // YYYY-MM
  points: number;
  bestDivisionId: DivisionId;
  // Pending reward from the previous month (available to claim)
  pendingRewardXp: number;
  lastMonthKey?: string | null;
  lastDivisionId?: DivisionId | null;
};

const DIVISIONS: Division[] = [
  { id: 'bronze', name: 'Bronze', minPoints: 0, rewardXp: 50 },
  { id: 'silver', name: 'Silver', minPoints: 50, rewardXp: 100 },
  { id: 'gold', name: 'Gold', minPoints: 150, rewardXp: 200 },
  { id: 'platinum', name: 'Platinum', minPoints: 300, rewardXp: 350 },
  { id: 'diamond', name: 'Diamond', minPoints: 500, rewardXp: 500 },
  { id: 'master', name: 'Master', minPoints: 800, rewardXp: 700 },
  { id: 'challenger', name: 'Challenger', minPoints: 1200, rewardXp: 1000 },
];

const STORAGE_KEY = 'leagues';

type LeaguesContextType = {
  state: LeaguesState;
  divisions: Division[];
  currentDivision: Division;
  nextDivision: Division | null;
  progressToNext: number; // 0..1
  daysUntilReset: number;
  addPoints: (amount: number) => void;
  claimPendingReward: () => void;
  resetIfNewMonth: () => void;
};

const defaultState: LeaguesState = {
  monthKey: new Date().toISOString().slice(0, 7),
  points: 0,
  bestDivisionId: 'bronze',
  pendingRewardXp: 0,
  lastMonthKey: null,
  lastDivisionId: null,
};

const LeaguesContext = createContext<LeaguesContextType | undefined>(undefined);

const getMonthKey = (d = new Date()) => d.toISOString().slice(0, 7);

const getDivisionForPoints = (points: number): Division => {
  let current = DIVISIONS[0];
  for (const div of DIVISIONS) {
    if (points >= div.minPoints) current = div;
  }
  return current;
};

const getNextDivision = (current: Division): Division | null => {
  const idx = DIVISIONS.findIndex(d => d.id === current.id);
  if (idx < 0 || idx === DIVISIONS.length - 1) return null;
  return DIVISIONS[idx + 1];
};

const calculateDaysUntilMonthEnd = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const diffMs = lastDay.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
};

export const LeaguesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LeaguesState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const { incrementXP } = useCharacter();

  // Load
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: LeaguesState = { ...defaultState, ...JSON.parse(raw) };
          setState(parsed);
        }
      } catch {}
      setLoaded(true);
    };
    load();
  }, []);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, loaded]);

  const ensureMonth = useCallback(() => {
    const currentKey = getMonthKey();
    if (state.monthKey !== currentKey) {
      // Month has changed → finalize last month and reset
      const finalDivision = getDivisionForPoints(state.points);
      setState(prev => ({
        monthKey: currentKey,
        points: 0,
        bestDivisionId: 'bronze',
        pendingRewardXp: prev.pendingRewardXp + finalDivision.rewardXp,
        lastMonthKey: prev.monthKey,
        lastDivisionId: finalDivision.id,
      }));
    }
  }, [state.monthKey, state.points]);

  // Run on mount and periodically (optional). For simplicity, run once on load and when screen uses daysUntilReset
  useEffect(() => {
    if (!loaded) return;
    ensureMonth();
  }, [loaded, ensureMonth]);

  const addPoints = useCallback((amount: number) => {
    if (amount <= 0) return;
    setState(prev => {
      const monthKey = getMonthKey();
      const isNewMonth = prev.monthKey !== monthKey;
      if (isNewMonth) {
        // If month rolled over between renders, finalize and then add to new month
        const finalDiv = getDivisionForPoints(prev.points);
        const newPoints = amount;
        const newDiv = getDivisionForPoints(newPoints);
        return {
          monthKey,
          points: newPoints,
          bestDivisionId: newDiv.id,
          pendingRewardXp: prev.pendingRewardXp + finalDiv.rewardXp,
          lastMonthKey: prev.monthKey,
          lastDivisionId: finalDiv.id,
        };
      }
      const updatedPoints = prev.points + amount;
      const newDiv = getDivisionForPoints(updatedPoints);
      const bestId = DIVISIONS.findIndex(d => d.id === newDiv.id) > DIVISIONS.findIndex(d => d.id === prev.bestDivisionId)
        ? newDiv.id
        : prev.bestDivisionId;
      return { ...prev, points: updatedPoints, bestDivisionId: bestId };
    });
  }, []);

  const claimPendingReward = useCallback(() => {
    setState(prev => {
      const xp = prev.pendingRewardXp || 0;
      if (xp > 0) {
        incrementXP(xp);
      }
      return { ...prev, pendingRewardXp: 0 };
    });
  }, [incrementXP]);

  const currentDivision = useMemo(() => getDivisionForPoints(state.points), [state.points]);
  const nextDivision = useMemo(() => getNextDivision(currentDivision), [currentDivision]);
  const progressToNext = useMemo(() => {
    if (!nextDivision) return 1;
    const span = nextDivision.minPoints - currentDivision.minPoints;
    if (span <= 0) return 1;
    const into = state.points - currentDivision.minPoints;
    return Math.min(1, Math.max(0, into / span));
  }, [state.points, currentDivision, nextDivision]);

  const daysUntilReset = useMemo(() => calculateDaysUntilMonthEnd(), [state.monthKey]);

  const value: LeaguesContextType = {
    state,
    divisions: DIVISIONS,
    currentDivision,
    nextDivision,
    progressToNext,
    daysUntilReset,
    addPoints,
    claimPendingReward,
    resetIfNewMonth: ensureMonth,
  };

  return (
    <LeaguesContext.Provider value={value}>{children}</LeaguesContext.Provider>
  );
};

export const useLeagues = () => {
  const ctx = useContext(LeaguesContext);
  if (!ctx) throw new Error('useLeagues must be used within a LeaguesProvider');
  return ctx;
};


