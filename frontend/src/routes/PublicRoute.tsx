import { Navigate } from "react-router-dom";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, loading, checkAuthState } = useAuth();

    useEffect(() => {
        checkAuthState();
    }, [checkAuthState]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#080b12]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;