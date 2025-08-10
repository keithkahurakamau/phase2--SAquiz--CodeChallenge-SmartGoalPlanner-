/* eslint-disable @typescript-eslint/no-explicit-any */
// Main dashboard page component for the Smart Goal Planner
// This component serves as the primary interface for managing savings goals
// It handles goal creation, updates, deletion, deposits, and displays overview statistics

import { useState } from "react"; // React hook for managing local component state
import { Helmet } from "react-helmet-async"; // SEO and meta tag management for the page
import { Button } from "@/components/ui/button"; // Reusable button component with consistent styling
import { GoalForm, GoalFormValues } from "@/components/goals/GoalForm"; // Form component for creating/editing goals
import { GoalCard } from "@/components/goals/GoalCard"; // Individual goal display card component
import { OverviewStats } from "@/components/goals/OverviewStats"; // Summary statistics component
import { useCreateGoal, useGoals, useUpdateGoal, useDeleteGoal, useDeposit } from "@/api/goals"; // API hooks for goal operations
import type { Goal } from "@/types/goal"; // TypeScript type definitions for Goal objects
import { toast } from "sonner"; // Toast notification system for user feedback

const Index = () => {
  // Fetch all goals from the API with loading and error states
  const { data: goals = [], isLoading, error } = useGoals();
  
  // Mutation hooks for CRUD operations on goals
  const createGoal = useCreateGoal(); // Hook for creating new goals
  const updateGoal = useUpdateGoal(); // Hook for updating existing goals
  const deleteGoal = useDeleteGoal(); // Hook for deleting goals
  const deposit = useDeposit(); // Hook for making deposits to goals
  
  // Local state to control the visibility of the goal creation form
  const [createOpen, setCreateOpen] = useState(false);

  // Handler for creating a new goal
  // Takes form values and creates a new goal via API
  const handleCreate = async (values: GoalFormValues) => {
    try {
      // Create the goal with the provided values
      await createGoal.mutateAsync({
        name: values.name,
        targetAmount: values.targetAmount,
        category: values.category,
        deadline: values.deadline,
      });
      // Show success notification
      toast.success("Goal created");
      // Close the creation form
      setCreateOpen(false);
    } catch (e: any) {
      // Show error notification with fallback message
      toast.error(e.message || "Failed to create goal");
    }
  };

  // Handler for updating an existing goal
  // Takes goal ID and partial data to update
  const handleUpdate = async (id: string, data: Partial<Goal>) => {
    try {
      // Update the goal via API
      await updateGoal.mutateAsync({ id, data });
      // Show success notification
      toast.success("Goal updated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Show error notification with fallback message
      toast.error(e.message || "Failed to update goal");
    }
  };

  // Handler for deleting a goal
  // Takes goal ID and removes it from the system
  const handleDelete = async (id: string) => {
    try {
      // Delete the goal via API
      await deleteGoal.mutateAsync(id);
      // Show success notification
      toast.success("Goal deleted");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Show error notification with fallback message
      toast.error(e.message || "Failed to delete goal");
    }
  };

  // Handler for making a deposit to a specific goal
  // Takes goal ID and deposit amount
  const handleDeposit = async (id: string, amount: number) => {
    try {
      // Process the deposit via API
      await deposit.mutateAsync({ id, amount });
      // Show success notification
      toast.success("Deposit successful");
    } catch (e: any) {
      // Show error notification with fallback message
      toast.error(e.message || "Deposit failed");
    }
  };

  return (
    <>
      {/* SEO and meta tags for the page */}
      <Helmet>
        {/* Page title shown in browser tab */}
        <title>Smart Goal Planner — Track Your Savings Goals</title>
        {/* Meta description for search engines */}
        <meta name="description" content="Create, manage, and track multiple savings goals with deposits, progress, and deadlines." />
        {/* Canonical URL for SEO */}
        <link rel="canonical" href="/" />
        {/* Open Graph meta tags for social media sharing */}
        <meta property="og:title" content="Smart Goal Planner" />
        <meta property="og:description" content="Manage savings goals, make deposits, and visualize progress." />
        {/* Structured data for search engines */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Smart Goal Planner",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>

      {/* Page header with title and action button */}
      <header className="container py-10">
        <div className="flex items-center justify-between gap-4">
          {/* Main page title with gradient styling */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-[var(--gradient-hero)] bg-clip-text text-transparent">
            Smart Goal Planner
          </h1>
          {/* Button to trigger goal creation form */}
          <Button onClick={() => setCreateOpen(true)} className="bg-brand text-brand-foreground hover:opacity-90">
            Add Goal
          </Button>
        </div>
        {/* Subtitle/description of the app */}
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Manage multiple savings goals, allocate deposits, and track your progress with clear deadlines.
        </p>
      </header>

      {/* Main content area */}
      <main className="container pb-16 space-y-8">
        {/* Loading state */}
        {isLoading && (
          <div className="text-muted-foreground">Loading goals...</div>
        )}
        {/* Error state */}
        {error && (
          <div className="text-destructive">Failed to load goals.</div>
        )}

        {/* Main content when data is loaded */}
        {!isLoading && !error && (
          <>
            {/* Overview statistics section */}
            <section aria-labelledby="overview-heading" className="space-y-4">
              <h2 id="overview-heading" className="sr-only">Overview</h2>
              <OverviewStats goals={goals} />
            </section>

            {/* Goals grid section */}
            <section aria-labelledby="goals-heading" className="space-y-4">
              <h2 id="goals-heading" className="sr-only">Goals</h2>
              {/* Responsive grid layout for goal cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Render each goal as a card */}
                {goals.map((g) => (
                  <GoalCard key={g.id} goal={g} onUpdate={handleUpdate} onDelete={handleDelete} onDeposit={handleDeposit} />
                ))}
              </div>
              {/* Empty state when no goals exist */}
              {goals.length === 0 && (
                <div className="text-sm text-muted-foreground">No goals yet. Click "Add Goal" to get started.</div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Goal creation form modal */}
      <GoalForm open={createOpen} onOpenChange={setCreateOpen} mode="create" onSubmit={handleCreate} />
    </>
  );
};

export default Index;
