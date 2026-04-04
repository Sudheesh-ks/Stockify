import { Navigate } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, checkAuthState } = useAuth();

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (loading) {
    return <Loading fullPage message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
