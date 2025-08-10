import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Goal } from "@/types/goal";

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

interface OverviewStatsProps {
  goals: Goal[];
}

export function OverviewStats({ goals }: OverviewStatsProps) {
  const totalGoals = goals.length;
  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const completed = goals.filter((g) => g.savedAmount >= g.targetAmount && g.targetAmount > 0).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalGoals}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Saved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(totalSaved)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Goals Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completed}</div>
        </CardContent>
      </Card>
    </div>
  );
}
