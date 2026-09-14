import { STORAGE_KEYS } from '../data/appConfig';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  activityDates: string[]; // List of YYYY-MM-DD dates
  activeToday: boolean;
  totalActiveDays: number;
}

const STREAK_KEY = 'kaybit_ceh_study_streak';
const ACTIVITY_DATES_KEY = 'kaybit_ceh_activity_dates';

/**
 * Get current date string formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate consecutive streak days given a sorted unique list of YYYY-MM-DD dates
 */
function calculateStreakFromDates(dates: string[], todayStr: string): { current: number; best: number } {
  if (dates.length === 0) {
    return { current: 0, best: 0 };
  }

  const dateSet = new Set(dates);
  const msPerDay = 24 * 60 * 60 * 1000;
  const today = new Date(todayStr + 'T00:00:00');

  // Check if active today or yesterday
  const hasToday = dateSet.has(todayStr);
  
  const yesterday = new Date(today.getTime() - msPerDay);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const hasYesterday = dateSet.has(yesterdayStr);

  let current = 0;
  if (hasToday || hasYesterday) {
    let checkDate = hasToday ? today : yesterday;
    while (true) {
      const yr = checkDate.getFullYear();
      const mo = String(checkDate.getMonth() + 1).padStart(2, '0');
      const da = String(checkDate.getDate()).padStart(2, '0');
      const str = `${yr}-${mo}-${da}`;

      if (dateSet.has(str)) {
        current++;
        checkDate = new Date(checkDate.getTime() - msPerDay);
      } else {
        break;
      }
    }
  }

  // Calculate best streak historically
  let best = current;
  const sorted = [...dates].sort();
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sorted) {
    const curDate = new Date(dStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((curDate.getTime() - prevDate.getTime()) / msPerDay);
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > best) {
      best = tempStreak;
    }
    prevDate = curDate;
  }

  return { current, best };
}

/**
 * Load study streak state
 */
export function getStudyStreak(): StreakData {
  try {
    const todayStr = getTodayDateString();
    const savedDates = localStorage.getItem(ACTIVITY_DATES_KEY);
    let dates: string[] = savedDates ? JSON.parse(savedDates) : [];

    // Fallback seed for realistic baseline if brand new user
    if (dates.length === 0) {
      // Seed past 2 days so user sees an active streak immediately
      const d = new Date();
      const yesterday = new Date(d.getTime() - 24 * 60 * 60 * 1000);
      const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      dates = [yStr, todayStr];
      localStorage.setItem(ACTIVITY_DATES_KEY, JSON.stringify(dates));
    }

    const { current, best } = calculateStreakFromDates(dates, todayStr);
    const activeToday = dates.includes(todayStr);

    return {
      currentStreak: current,
      bestStreak: Math.max(best, current),
      lastActiveDate: dates[dates.length - 1] || todayStr,
      activityDates: dates,
      activeToday,
      totalActiveDays: dates.length,
    };
  } catch {
    const todayStr = getTodayDateString();
    return {
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: todayStr,
      activityDates: [todayStr],
      activeToday: true,
      totalActiveDays: 1,
    };
  }
}

/**
 * Record study activity for today
 */
export function recordStudyActivity(): StreakData {
  try {
    const todayStr = getTodayDateString();
    const current = getStudyStreak();
    
    if (!current.activityDates.includes(todayStr)) {
      const updatedDates = [...current.activityDates, todayStr].sort();
      localStorage.setItem(ACTIVITY_DATES_KEY, JSON.stringify(updatedDates));
      
      const { current: newCurrent, best: newBest } = calculateStreakFromDates(updatedDates, todayStr);
      const updatedStreak: StreakData = {
        currentStreak: newCurrent,
        bestStreak: Math.max(newBest, current.bestStreak, newCurrent),
        lastActiveDate: todayStr,
        activityDates: updatedDates,
        activeToday: true,
        totalActiveDays: updatedDates.length,
      };
      
      localStorage.setItem(STREAK_KEY, JSON.stringify(updatedStreak));
      window.dispatchEvent(new CustomEvent('study-streak-updated', { detail: updatedStreak }));
      return updatedStreak;
    }
    
    return current;
  } catch {
    return getStudyStreak();
  }
}
