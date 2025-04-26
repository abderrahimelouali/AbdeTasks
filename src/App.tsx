
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

// Add Google Fonts for Arabic text directly in the App component
const arabicFontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
  
  .font-arabic {
    font-family: 'Noto Sans Arabic', sans-serif;
    direction: rtl;
    display: inline-block;
  }
`;

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

    // Add Arabic font style to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = arabicFontStyle;
    document.head.appendChild(styleElement);

    // Add Google Fonts link to the document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap';
    document.head.appendChild(linkElement);

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(styleElement);
      if (document.head.contains(linkElement)) {
        document.head.removeChild(linkElement);
      }
    };
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
