import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Goal, getProgress, getRemaining } from "@/types/goal";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { DepositDialog } from "./DepositDialog";
import { GoalForm, GoalFormValues } from "./GoalForm";

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function daysLeft(deadline: string) {
  const now = new Date();
  const dl = new Date(deadline + "T00:00:00");
  const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function getStatus(goal: Goal) {
  const complete = goal.savedAmount >= goal.targetAmount && goal.targetAmount > 0;
  const left = daysLeft(goal.deadline);
  if (complete) return { label: "Completed", tone: "success" as const };
  if (left < 0) return { label: "Overdue", tone: "destructive" as const };
  if (left <= 30) return { label: "Due soon", tone: "warning" as const };
  return { label: "Active", tone: "secondary" as const };
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (id: string, data: Partial<Goal>) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onDeposit: (id: string, amount: number) => Promise<void> | void;
}

export function GoalCard({ goal, onUpdate, onDelete, onDeposit }: GoalCardProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const progress = getProgress(goal);
  const remaining = getRemaining(goal);
  const status = useMemo(() => getStatus(goal), [goal]);

  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">{goal.category}</div>
        </div>
        <Badge
          variant={status.tone === "destructive" ? "destructive" : status.tone === "warning" ? "secondary" : status.tone === "success" ? "secondary" : "secondary"}
          className={status.tone === "warning" ? "text-warning border border-warning/30" : status.tone === "success" ? "text-success border border-success/30" : ""}
        >
          {status.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Saved</div>
            <div className="font-medium">{formatCurrency(goal.savedAmount)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Target</div>
            <div className="font-medium">{formatCurrency(goal.targetAmount)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Remaining</div>
            <div className="font-medium">{formatCurrency(remaining)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Deadline</div>
            <div className="font-medium">{format(new Date(goal.deadline + "T00:00:00"), "PP")}</div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={() => setDepositOpen(true)} className="bg-brand text-brand-foreground hover:opacity-90">Deposit</Button>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the goal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(goal.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>

      {/* Deposit */}
      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        onDeposit={async (amount) => {
          await onDeposit(goal.id, amount);
          setDepositOpen(false);
        }}
      />

      {/* Edit */}
      <GoalForm
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initial={goal}
        onSubmit={async (values: GoalFormValues) => {
          await onUpdate(goal.id, values);
          setEditOpen(false);
        }}
      />
    </Card>
  );
}
