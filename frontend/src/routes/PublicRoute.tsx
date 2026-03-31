import { Navigate } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, loading, checkAuthState } = useAuth();

    useEffect(() => {
        checkAuthState();
    }, [checkAuthState]);

    if (loading) {
        return null; // Or a loading spinner if needed
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;