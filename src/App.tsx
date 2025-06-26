
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Auth wrapper component to handle redirection after login
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const location = window.location;

  useEffect(() => {
    // Redirect to home if user is already logged in and trying to access auth pages
    if ((location.pathname === '/login' || location.pathname === '/signup') && currentUser) {
      window.location.href = '/';
    }
  }, [currentUser, location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected Admin Route */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Component to handle redirection after login
const AuthRedirect = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      // Redirect to home if logged in
      window.location.href = '/';
    } else {
      // Redirect to login if not logged in
      window.location.href = '/login';
    }
  }, [currentUser]);

  return <div>Redirecting...</div>;
};

export default App;
