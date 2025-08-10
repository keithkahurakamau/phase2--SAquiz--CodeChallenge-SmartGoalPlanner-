// Root application component that sets up all global providers and routing
// This component wraps the entire application with necessary context providers

import { Toaster } from "@/components/ui/toaster"; // Toast notification component for user feedback
import { Toaster as Sonner } from "@/components/ui/sonner"; // Alternative toast system for rich notifications
import { TooltipProvider } from "@/components/ui/tooltip"; // Enables hover tooltips throughout the app
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query for server state management
import { BrowserRouter, Routes, Route } from "react-router-dom"; // React Router for client-side routing
import { HelmetProvider } from "react-helmet-async"; // SEO and meta tag management
import Index from "./pages/Index"; // Main dashboard page component
import NotFound from "./pages/NotFound"; // 404 error page component

// Create a single instance of QueryClient for the entire app
// This manages caching, background refetching, and state synchronization
const queryClient = new QueryClient();

// Main application component that wraps everything with providers
const App = () => (
  // HelmetProvider enables dynamic meta tag management for SEO
  <HelmetProvider>
    {/* QueryClientProvider gives all child components access to React Query */}
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider enables hover tooltips globally */}
      <TooltipProvider>
        {/* Toast notification system for user feedback */}
        <Toaster />
        {/* Rich notification system for more complex messages */}
        <Sonner />
        
        {/* BrowserRouter enables client-side routing */}
        <BrowserRouter>
          <Routes>
            {/* Main route for the dashboard/home page */}
            <Route path="/" element={<Index />} />
            {/* Catch-all route for 404 pages - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
