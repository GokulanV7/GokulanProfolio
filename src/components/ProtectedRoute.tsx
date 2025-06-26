import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!currentUser) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required but user is not an admin
  if (adminOnly && currentUser.uid !== 'YOUR_ADMIN_UID') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
