/**
 * OverviewStats Component
 * 
 * This component displays summary statistics for savings goals
 * including total goals, total saved, progress, and deadline tracking.
 * 
 * Purpose: Provides a visual summary of goal progress and key metrics
 * Importance: Central UI element for displaying goal overview
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal } from "@/types/goal";

/**
 * Props interface for OverviewStats component
 */
interface OverviewStatsProps {
  goals: Goal[]; // Array of all goals to calculate statistics from
}

/**
 * OverviewStats Component - Displays goal summary statistics
 * 
 * Features:
 * - Total number of goals
 * - Total amount saved across all goals
 * - Total target amount across all goals
 * - Overall progress percentage
 * - Number of completed goals
 * - Visual representation of key metrics
 */
export function OverviewStats({ goals }: OverviewStatsProps) {
  /**
   * Memoized calculation of statistics
   * Prevents recalculation on every render
   */
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;

    return {
      totalGoals,
      totalSaved,
      totalTarget,
      overallProgress,
      completedGoals,
    };
  }, [goals]);

  /**
   * Formats currency for display
   * @param amount - The amount to format
   * @returns Formatted currency string
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
  };

  // Don't render if no goals exist
  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Goals Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGoals}</div>
          <p className="text-xs text-muted-foreground">
            Active savings goals
          </p>
        </CardContent>
      </Card>

      {/* Total Saved Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalSaved)}</div>
          <p className="text-xs text-muted-foreground">
            across all goals
          </p>
        </CardContent>
      </Card>

      {/* Total Target Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Target</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalTarget)}</div>
          <p className="text-xs text-muted-foreground">
            combined goal targets
          </p>
        </CardContent>
      </Card>

      {/* Overall Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.overallProgress.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedGoals} of {stats.totalGoals} goals completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
