import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special handling for pending roles - allow them to see their dashboard
  if (userRole === "pending_student" && location.pathname === "/student") {
    return children;
  }
  
  if (userRole === "pending_parent" && location.pathname === "/parent") {
    return children;
  }

  // If specific roles are required and user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Check if it's a pending version of an allowed role
    const isPendingVersion = 
      (allowedRoles.includes("student") && userRole === "pending_student") ||
      (allowedRoles.includes("parent") && userRole === "pending_parent");
    
    if (!isPendingVersion) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
