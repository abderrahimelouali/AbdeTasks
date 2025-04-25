
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Stats from "./pages/Stats";
import Study from "./pages/Study";
import Weekly from "./pages/Weekly";
import NotFound from "./pages/NotFound";
import { useTheme } from "./hooks/use-theme";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const { theme } = useTheme();
  
  // Initialize local storage data if first time
  useEffect(() => {
    const setupInitialData = () => {
      const hasVisited = localStorage.getItem("abdetask_visited");
      
      if (!hasVisited) {
        // Mark as visited
        localStorage.setItem("abdetask_visited", "true");
        
        // Initialize empty arrays for various data
        localStorage.setItem("abdetask_dailytasks", JSON.stringify([]));
        localStorage.setItem("abdetask_study_sessions", JSON.stringify([]));
        localStorage.setItem("abdetask_english_sessions", JSON.stringify([]));
        localStorage.setItem("abdetask_quran_progress", JSON.stringify([]));
        localStorage.setItem("abdetask_nofap_streak", "0");
      }
    };
    
    setupInitialData();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/study" element={<Study />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
