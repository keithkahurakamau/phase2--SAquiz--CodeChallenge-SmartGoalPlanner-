/**
 * GoalCard Component
 * 
 * This component displays an individual savings goal as a card with all relevant information
 * including progress, status, and action buttons for deposits, editing, and deletion.
 * 
 * Purpose: Provides a visual representation of a single goal with interactive controls
 * Importance: Central UI element that users interact with most frequently
 */

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

/**
 * Formats a number as USD currency
 * @param n - The number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

/**
 * Calculates days remaining until deadline
 * @param deadline - The deadline date string (YYYY-MM-DD format)
 * @returns Number of days remaining (negative if overdue)
 */
function daysLeft(deadline: string) {
  const now = new Date();
  const dl = new Date(deadline + "T00:00:00");
  const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

/**
 * Determines the status of a goal based on progress and deadline
 * @param goal - The goal object to evaluate
 * @returns Object with label and tone for styling
 */
function getStatus(goal: Goal) {
  const complete = goal.savedAmount >= goal.targetAmount && goal.targetAmount > 0;
  const left = daysLeft(goal.deadline);
  
  if (complete) return { label: "Completed", tone: "success" as const };
  if (left < 0) return { label: "Overdue", tone: "destructive" as const };
  if (left <= 30) return { label: "Due soon", tone: "warning" as const };
  return { label: "Active", tone: "secondary" as const };
}

/**
 * Props interface for GoalCard component
 * Defines the expected props and their types
 */
interface GoalCardProps {
  goal: Goal; // The goal object to display
  onUpdate: (id: string, data: Partial<Goal>) => Promise<void> | void; // Handler for goal updates
  onDelete: (id: string) => Promise<void> | void; // Handler for goal deletion
  onDeposit: (id: string, amount: number) => Promise<void> | void; // Handler for deposits
}

/**
 * GoalCard Component - Main component for displaying individual goals
 * 
 * This component renders a single goal as an interactive card with:
 * - Goal name and category
 * - Progress visualization
 * - Financial details (saved, target, remaining)
 * - Deadline information
 * - Status indicators
 * - Action buttons for deposits, editing, and deletion
 */
export function GoalCard({ goal, onUpdate, onDelete, onDeposit }: GoalCardProps) {
  // State for controlling dialog visibility
  const [depositOpen, setDepositOpen] = useState(false); // Controls deposit dialog
  const [editOpen, setEditOpen] = useState(false); // Controls edit form dialog

  // Calculate derived values using utility functions
  const progress = getProgress(goal); // Progress percentage (0-100)
  const remaining = getRemaining(goal); // Amount still needed to reach target
  const status = useMemo(() => getStatus(goal), [goal]); // Memoized status calculation

  return (
    // Card container with hover effects for better UX
    <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Card header with goal name, category, and status badge */}
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          {/* Goal name as the primary title */}
          <CardTitle className="text-lg font-semibold">{goal.name}</CardTitle>
          {/* Category as secondary information */}
          <div className="mt-1 text-sm text-muted-foreground">{goal.category}</div>
        </div>
        
        {/* Status badge with color coding based on goal status */}
        <Badge
          variant={status.tone === "destructive" ? "destructive" : status.tone === "warning" ? "secondary" : status.tone === "success" ? "secondary" : "secondary"}
          className={status.tone === "warning" ? "text-warning border border-warning/30" : status.tone === "success" ? "text-success border border-success/30" : ""}
        >
          {status.label}
        </Badge>
      </CardHeader>

      {/* Main content area with goal details */}
      <CardContent className="space-y-4">
        {/* Progress section with visual progress bar */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {/* Financial details grid - displays key metrics */}
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

        {/* Action buttons for user interactions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={() => setDepositOpen(true)} className="bg-brand text-brand-foreground hover:opacity-90">
            Deposit
          </Button>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>Edit</Button>
          
          {/* Delete confirmation dialog */}
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

      {/* Deposit dialog - allows users to add money to the goal */}
      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        onDeposit={async (amount) => {
          await onDeposit(goal.id, amount);
          setDepositOpen(false);
        }}
      />

      {/* Edit dialog - allows users to modify goal details */}
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
