
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Stats from "./pages/Stats";
import Study from "./pages/Study";
import Weekly from "./pages/Weekly";
import NotFound from "./pages/NotFound";
import { useTheme } from "./hooks/use-theme";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const arabicFontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');
  
  .font-arabic {
    font-family: 'Noto Sans Arabic', sans-serif;
    direction: rtl;
    display: inline-block;
  }
`;

// Create QueryClient instance with updated configuration
const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    },
    queries: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "An error occurred",
          });
        }
      }
    }
  }
});

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/tasks" element={<PageWrapper><Tasks /></PageWrapper>} />
        <Route path="/stats" element={<PageWrapper><Stats /></PageWrapper>} />
        <Route path="/study" element={<PageWrapper><Study /></PageWrapper>} />
        <Route path="/weekly" element={<PageWrapper><Weekly /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { theme } = useTheme();
  
  useEffect(() => {
    const setupInitialData = () => {
      const hasVisited = localStorage.getItem("abdetask_visited");
      
      if (!hasVisited) {
        localStorage.setItem("abdetask_visited", "true");
        
        localStorage.setItem("abdetask_dailytasks", JSON.stringify([]));
        localStorage.setItem("abdetask_study_sessions", JSON.stringify([]));
        localStorage.setItem("abdetask_english_sessions", JSON.stringify([]));
        localStorage.setItem("abdetask_quran_progress", JSON.stringify([]));
        localStorage.setItem("abdetask_nofap_streak", "0");
      }
    };
    
    setupInitialData();

    const styleElement = document.createElement('style');
    styleElement.textContent = arabicFontStyle;
    document.head.appendChild(styleElement);

    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap';
    document.head.appendChild(linkElement);

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
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
