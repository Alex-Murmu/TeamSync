import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import React from "react";

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  if (!isInitialized) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/30">
        <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
