import { Navigate } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import Loading from "../components/Loading";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, loading, checkAuthState } = useAuth();

    useEffect(() => {
        checkAuthState();
    }, [checkAuthState]);

    if (loading) {
        return <Loading fullPage message="Loading..." />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;