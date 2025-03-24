
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLayout } from "./components/layout/PageLayout";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Assignments from "./pages/Assignments";
import Students from "./pages/Students";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  }
});

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for bypassed authentication in localStorage
    const bypassAuth = () => {
      const authTokenString = localStorage.getItem('supabase.auth.token');
      if (authTokenString) {
        try {
          const authToken = JSON.parse(authTokenString);
          if (authToken.currentSession && authToken.currentSession.access_token === 'demo-token') {
            return true;
          }
        } catch (error) {
          console.error("Error parsing auth token:", error);
        }
      }
      return false;
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    // If we have a bypassed auth token, set loading to false
    if (bypassAuth()) {
      setIsLoading(false);
    }

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
    }
    
    const bypassAuth = () => {
      const authTokenString = localStorage.getItem('supabase.auth.token');
      if (authTokenString) {
        try {
          const authToken = JSON.parse(authTokenString);
          if (authToken.currentSession && authToken.currentSession.access_token === 'demo-token') {
            return true;
          }
        } catch (error) {
          console.error("Error parsing auth token:", error);
        }
      }
      return false;
    };
    
    if (!session && !bypassAuth()) {
      return <Navigate to="/auth" />;
    }
    
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/auth" 
              element={(session || localStorage.getItem('supabase.auth.token')) ? <Navigate to="/" /> : <Auth />} 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Dashboard />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Schedule />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Assignments />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Students />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Notifications />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <PageLayout>
                    <Settings />
                  </PageLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
