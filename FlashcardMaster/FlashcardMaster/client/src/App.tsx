import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import HomePage from "@/pages/home";
import DeckDetailPage from "@/pages/deck-detail";
import TrainerPage from "@/pages/trainer";
import ProgressPage from "@/pages/progress";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/deck/:id" component={DeckDetailPage} />
      <Route path="/train/:id" component={TrainerPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MobileNavigation() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        <a 
          href="/" 
          className={`flex flex-col items-center space-y-1 py-2 px-3 ${
            location === "/" ? "text-primary" : "text-slate-400"
          }`}
        >
          <div className="text-lg">🏠</div>
          <span className="text-xs font-medium">Decks</span>
        </a>
        <a 
          href="/progress" 
          className={`flex flex-col items-center space-y-1 py-2 px-3 ${
            location === "/progress" ? "text-primary" : "text-slate-400"
          }`}
        >
          <div className="text-lg">📊</div>
          <span className="text-xs font-medium">Progress</span>
        </a>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
            <Router />
          </main>
          
          <MobileNavigation />
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
