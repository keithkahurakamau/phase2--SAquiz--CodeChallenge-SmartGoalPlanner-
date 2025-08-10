import { z } from "zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Goal } from "@/types/goal";

const GoalSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  targetAmount: z.coerce.number().positive("Target must be > 0"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Deadline is required"),
});

export type GoalFormValues = z.infer<typeof GoalSchema>;

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: Partial<Goal>;
  onSubmit: (values: GoalFormValues) => Promise<void> | void;
}

export function GoalForm({ open, onOpenChange, mode, initial, onSubmit }: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      name: initial?.name ?? "",
      targetAmount: initial?.targetAmount ?? 0,
      category: initial?.category ?? "",
      deadline: initial?.deadline ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: initial?.name ?? "",
      targetAmount: initial?.targetAmount ?? 0,
      category: initial?.category ?? "",
      deadline: initial?.deadline ?? "",
    });
  }, [initial, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Goal" : "Edit Goal"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Travel Fund - Japan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Travel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand text-brand-foreground hover:opacity-90">
                {mode === "create" ? "Create Goal" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
