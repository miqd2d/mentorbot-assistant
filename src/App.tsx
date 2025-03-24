
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/PageLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PageLayout>
                <Dashboard />
              </PageLayout>
            } 
          />
          <Route 
            path="/schedule" 
            element={
              <PageLayout>
                <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                  <p className="text-lg text-muted-foreground">Schedule page coming soon</p>
                </div>
              </PageLayout>
            } 
          />
          <Route 
            path="/assignments" 
            element={
              <PageLayout>
                <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                  <p className="text-lg text-muted-foreground">Assignments page coming soon</p>
                </div>
              </PageLayout>
            } 
          />
          <Route 
            path="/students" 
            element={
              <PageLayout>
                <Students />
              </PageLayout>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <PageLayout>
                <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                  <p className="text-lg text-muted-foreground">Notifications page coming soon</p>
                </div>
              </PageLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PageLayout>
                <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                  <p className="text-lg text-muted-foreground">Settings page coming soon</p>
                </div>
              </PageLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
