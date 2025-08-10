/**
 * DepositDialog Component
 * 
 * A modal dialog for making deposits to savings goals.
 * Provides a simple interface for users to add money to their goals
 * with validation and user-friendly feedback.
 * 
 * Purpose: Handles the deposit flow with amount validation
 * Importance: Critical for the core functionality of adding money to goals
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Props interface for DepositDialog component
 */
interface DepositDialogProps {
  open: boolean; // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Handler for dialog state changes
  onDeposit: (amount: number) => Promise<void> | void; // Handler for deposit submission
}

/**
 * DepositDialog Component - Handles deposit functionality
 * 
 * Features:
 * - Amount validation (must be positive number)
 * - Loading state during submission
 * - Success/error handling
 * - Auto-close after successful deposit
 * - Clear user feedback
 */
export function DepositDialog({ open, onOpenChange, onDeposit }: DepositDialogProps) {
  // State for deposit amount and loading status
  const [amount, setAmount] = useState(""); // Stores the deposit amount as string
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission state

  /**
   * Formats currency for display
   * @param n - The number to format
   * @returns Formatted currency string
   */
  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
  };

  /**
   * Handles deposit submission
   * Validates amount and calls the provided onDeposit handler
   */
  const handleDeposit = async () => {
    const numericAmount = Number(amount);
    
    // Validation: Check if amount is valid
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      return; // Don't proceed with invalid amount
    }

    setIsSubmitting(true); // Set loading state
    
    try {
      await onDeposit(numericAmount); // Process the deposit
      setAmount(""); // Reset amount field
      onOpenChange(false); // Close dialog
    } catch (error) {
      console.error("Deposit failed:", error);
      // Error handling is typically done by parent component
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  /**
   * Handles key press events (Enter key submission)
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && amount && Number(amount) > 0) {
      handleDeposit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a Deposit</DialogTitle>
          <DialogDescription>
            Add money to this goal to track your progress
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              min="0.01"
              step="0.01"
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Enter the amount you want to add to this goal
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
