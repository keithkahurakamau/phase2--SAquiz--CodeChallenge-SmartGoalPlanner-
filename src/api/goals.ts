// API layer for goal-related operations
// This file contains all the data fetching and mutation logic for goals
// It uses React Query for state management and provides custom hooks for components

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // React Query for server state management
import { Goal, GoalInput } from "@/types/goal"; // TypeScript type definitions for Goal objects

// Base URL for the JSON server API
// Using localhost:3000 as specified in project requirements (no environment variables)
const BASE_URL = "http://localhost:3000"; // json-server base URL (no envs per project rules)
const GOALS_URL = `${BASE_URL}/goals`; // Full URL for goals endpoint

// Generic HTTP client function for making API requests
// Provides consistent error handling and JSON parsing
async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  // Make the fetch request with JSON content type header
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  
  // Handle error responses by throwing descriptive errors
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  
  // Parse and return JSON response
  return res.json();
}

// Fetch all goals from the API
// Returns an array of Goal objects
export const fetchGoals = () => http<Goal[]>(GOALS_URL);

// Create a new goal with the provided input data
// Generates a unique ID and sets initial saved amount to 0
export const postGoal = (input: GoalInput) => {
  // Construct the complete Goal object with generated fields
  const body: Goal = {
    id: Date.now().toString(), // Generate unique ID based on timestamp
    name: input.name,
    targetAmount: input.targetAmount,
    savedAmount: 0, // Initialize saved amount to 0 for new goals
    category: input.category,
    deadline: input.deadline,
    createdAt: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
  };
  
  // Send POST request to create the goal
  return http<Goal>(GOALS_URL, { method: "POST", body: JSON.stringify(body) });
};

// Partially update an existing goal
// Uses PATCH method to update only specified fields
export const patchGoal = (id: string, data: Partial<Goal>) =>
  http<Goal>(`${GOALS_URL}/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// Fully replace an existing goal
// Uses PUT method to replace the entire goal object
export const putGoal = (id: string, data: Goal) =>
  http<Goal>(`${GOALS_URL}/${id}`, { method: "PUT", body: JSON.stringify(data) });

// Delete a goal by ID
// Uses DELETE method to remove the goal from the database
export const deleteGoalApi = (id: string) =>
  fetch(`${GOALS_URL}/${id}`, { method: "DELETE" }).then((res) => {
    if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
  });

// React Query hook for fetching all goals
// Provides loading, error, and data states
export function useGoals() {
  return useQuery({ queryKey: ["goals"], queryFn: fetchGoals });
}

// React Query mutation hook for creating new goals
// Automatically invalidates the goals cache on success
export function useCreateGoal() {
  const qc = useQueryClient(); // Get the query client instance
  return useMutation<Goal, Error, GoalInput>({
    mutationFn: postGoal, // Function to execute the mutation
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }), // Refresh goals list on success
  });
}

// React Query mutation hook for updating existing goals
// Automatically invalidates the goals cache on success
export function useUpdateGoal() {
  const qc = useQueryClient(); // Get the query client instance
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) => patchGoal(id, data), // Function to execute the mutation
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }), // Refresh goals list on success
  });
}

// React Query mutation hook for deleting goals
// Automatically invalidates the goals cache on success
export function useDeleteGoal() {
  const qc = useQueryClient(); // Get the query client instance
  return useMutation({
    mutationFn: (id: string) => deleteGoalApi(id), // Function to execute the mutation
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }), // Refresh goals list on success
  });
}

// React Query mutation hook for making deposits to goals
// Calculates new saved amount based on current value and deposit
// Automatically invalidates the goals cache on success
export function useDeposit() {
  const qc = useQueryClient(); // Get the query client instance
  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      // Get current goals from cache to calculate new saved amount
      const goals = qc.getQueryData<Goal[]>(["goals"]) || [];
      const current = goals.find((g) => g.id === id);
      // Calculate new saved amount ensuring it doesn't go below 0
      const newSaved = Math.max(0, (current?.savedAmount ?? 0) + amount);
      // Update the goal with the new saved amount
      return patchGoal(id, { savedAmount: newSaved });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }), // Refresh goals list on success
  });
}
