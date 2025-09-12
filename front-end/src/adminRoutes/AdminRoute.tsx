import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, authReady } = useContext(AuthContext) as {
    user: any;
    authReady: boolean;
  };

  if (!authReady) return null; // or a tiny spinner

  const role = user?.role ?? user?.user?.role;
  const isAdmin = role === "admin" || user?.isAdmin === true;

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default AdminRoute;