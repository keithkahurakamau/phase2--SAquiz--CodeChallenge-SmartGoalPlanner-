/**
 * GoalForm Component
 * 
 * A reusable form component for creating and editing savings goals.
 * Handles form validation, submission, and provides a consistent interface
 * for both creating new goals and editing existing ones.
 * 
 * Purpose: Centralized form handling for goal CRUD operations
 * Importance: Ensures consistent data structure and validation across the app
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Goal } from "@/types/goal";

/**
 * Form validation schema using Zod
 * Defines the structure and validation rules for goal data
 */
const formSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().min(1, "Target amount must be at least $1"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

// Export the form values type for use in other components
export type GoalFormValues = z.infer<typeof formSchema>;

/**
 * Props interface for GoalForm component
 */
interface GoalFormProps {
  open: boolean; // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Handler for dialog state changes
  mode: "create" | "edit"; // Determines form behavior (create vs edit)
  initial?: Goal; // Initial values for editing (optional)
  onSubmit: (values: GoalFormValues) => Promise<void> | void; // Submission handler
}

/**
 * GoalForm Component - Handles goal creation and editing
 * 
 * Features:
 * - Form validation with real-time error messages
 * - Date picker for deadline selection
 * - Category selection dropdown
 * - Amount validation with currency formatting
 * - Loading states during submission
 * - Success/error handling
 */
export function GoalForm({ open, onOpenChange, mode, initial, onSubmit }: GoalFormProps) {
  // Initialize form with validation schema
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      targetAmount: 1000,
      category: "",
      deadline: format(new Date(), "yyyy-MM-dd"),
    },
  });

  /**
   * Effect hook to populate form when editing
   * Runs when initial data changes or mode switches to edit
   */
  useEffect(() => {
    if (mode === "edit" && initial) {
      form.reset({
        name: initial.name,
        targetAmount: initial.targetAmount,
        category: initial.category,
        deadline: initial.deadline,
      });
    }
  }, [initial, mode, form]);

  /**
   * Form submission handler
   * Validates data and calls the provided onSubmit handler
   */
  const handleSubmit = async (values: GoalFormValues) => {
    try {
      await onSubmit(values);
      form.reset(); // Reset form after successful submission
    } catch (error) {
      // Error handling is typically done by the parent component
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Goal" : "Edit Goal"}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Set up a new savings goal with a target amount and deadline." 
              : "Update your goal details and save changes."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Goal Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Fund" {...field} />
                  </FormControl>
                  <FormDescription>
                    A descriptive name for your savings goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Amount Field */}
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The total amount you want to save
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency Fund</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retirement">Retirement</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a category for better organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deadline Field */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"));
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your target date to achieve this goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
