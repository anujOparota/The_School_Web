import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Academics from "./pages/Academics";
import Faculty from "./pages/Faculty";
import Students from "./pages/Students";
import Admission from "./pages/Admission";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ParentDashboard from "./pages/dashboard/ParentDashboard";

const queryClient = new QueryClient();

// Redirect component based on role
const DashboardRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  switch (userRole) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "student":
    case "pending_student":
    case "rejected_student":
      return <Navigate to="/student" replace />;
    case "parent":
    case "pending_parent":
      return <Navigate to="/parent" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/academics" element={<Academics />} />
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/students" element={<Students />} />
      <Route path="/admission" element={<Admission />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Admin Dashboard - Protected (admin only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard - Protected (student and pending_student) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student", "pending_student", "rejected_student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Parent Dashboard - Protected (parent and pending_parent) */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={["parent", "pending_parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
