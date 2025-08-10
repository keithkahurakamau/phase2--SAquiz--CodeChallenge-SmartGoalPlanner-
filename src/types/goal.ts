export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  category: string;
  deadline: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
}

export type GoalInput = {
  name: string;
  targetAmount: number;
  category: string;
  deadline: string; // YYYY-MM-DD
};

export const getProgress = (g: Goal) => {
  if (g.targetAmount <= 0) return 0;
  return Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
};

export const getRemaining = (g: Goal) => Math.max(0, g.targetAmount - g.savedAmount);
